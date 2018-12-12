import Scene from "telegraf/scenes/base";
import {
    enterScene,
    enterSceneCB,
    inlineKeyboard,
    keyboard,
    redirectToOopsScene,
    removeKeyboard,
    replyWithMarkdown,
    routerScene,
    stateWrapper,
    statusMessage,
    t
} from "../../helpers";
import _ from "lodash";
import stateManager from "../../stateManager";
// let debug = require("debug")("bot:mainScene");

const mainScene = new Scene("mainScene");
mainScene.enter(ctx => {
    return stateWrapper(ctx, (ctx, state) => {
        let message = "";
        let buttons = [];
        let player = state.player;
        let data = player.data;
        console.log(data.activity || "main");
        if (data.activity === "") {
            statusMessage(state);
            message =
                "You are in your cell. You are sitting on your bed. There is a table nearby. You can see a glass of bits and a cybermeal on it.";
            buttons.push([t(state, "menu.action.eat"), t(state, "menu.action.drink"), t(state, "menu.action.sleep")]);
            buttons.push([t(state, "menu.inventory"), t(state, "menu.leaveCell")]);
            //any scene
            buttons.push([t(state, "menu.character"), t(state, "menu.menu")]);
        } else if (data.activity === "drinking") {
            message = t(state, "texts.needs.drinking");
            buttons.push([t(state, "menu.needs.status")]);
            buttons.push([t(state, "menu.needs.stop")]);
        } else if (data.activity === "eating") {
            message = t(state, "texts.needs.eating");
            buttons.push([t(state, "menu.needs.status")]);
            buttons.push([t(state, "menu.needs.stop")]);
        } else if (data.activity === "sleeping") {
            message = t(state, "texts.needs.sleeping");
            buttons.push([t(state, "menu.needs.status")]);
            buttons.push([t(state, "menu.needs.stop")]);
        }

        if (player.XP >= player.selectedCharacter.levelUp * 2 ** player.level - player.selectedCharacter.levelUp) {
            state.levelBuffer = {
                cls: { warrior: 0, mage: 0, evangelist: 0, prophet: 0, nomad: 0 },
                att: { baseStrength: 0, baseDexterity: 0, baseIntelligence: 0, baseWisdom: 0, baseVitality: 0 }
            };
            player.level += 1;
            player.data.classPoints += 1;
            player.data.statPoints += 1;
            //return replyWithMarkdown(, { playerId: player.id }, state).then(() =>
            //  enterScene(ctx, "levelUpAltScene", state)
            //removeKeyboard("LEVEL UP!", { playerId: state.player.id }, state);
            return keyboard(
                "🍄LEVEL UP!🍄\n\n" +
                    state.player.level +
                    " LEVEL!" +
                    '\nDo you want to assign your points now?\nYou can do it later from "character" menu',
                [["NOW", "LATER"]],
                { playerId: state.player.id },
                state
            );
        } else {
            return keyboard(message, buttons, { playerId: state.player.id });
        }
    });
});

mainScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let data = player.data;
        let currentTick = state.currentTick;
        let drinkingTime = 5;
        let sleepingTime = 10;
        let eatingTime = 100;
        //Drinking
        if (data.activity === "drinking") {
            switch (ctx.update.message.text) {
                case t(state, "menu.needs.status"):
                    let delta = data.timeout - currentTick;
                    if (delta > 0) {
                        return replyWithMarkdown(
                            t(state, "texts.needs.timeLeft") + " " + delta + " " + t(state, "texts.seconds"),
                            {
                                playerId: player.id
                            },
                            state
                        );
                    } else {
                        return replyWithMarkdown("You have already drunk", { playerId: player.id }, state);
                    }
                case t(state, "menu.needs.stop"):
                    data.timeout = 0;
                    replyWithMarkdown(t(state, "texts.needs.stopDrinking"), { playerId: player.id }, state);
                    return enterScene(ctx, "mainScene", state);
                default:
                    return redirectToOopsScene(ctx, state);
            }
        } else if (data.activity === "eating") {
            //Eating
            switch (ctx.update.message.text) {
                case t(state, "menu.needs.status"):
                    let delta = data.timeout - currentTick;
                    if (delta > 0) {
                        return replyWithMarkdown(
                            t(state, "texts.needs.timeLeft") + " " + delta + " " + t(state, "texts.seconds"),
                            {
                                playerId: player.id
                            },
                            state
                        );
                    } else {
                        return replyWithMarkdown("You have already eaten", { playerId: player.id }, state);
                    }
                case t(state, "menu.needs.stop"):
                    data.timeout = 0;
                    replyWithMarkdown(t(state, "texts.needs.stopEating"), { playerId: player.id }, state);
                    return enterScene(ctx, "mainScene", state);
                default:
                    return redirectToOopsScene(ctx, state);
            }
        } else if (data.activity === "sleeping") {
            //Sleeping
            switch (ctx.update.message.text) {
                case t(state, "menu.needs.status"):
                    let delta = data.timeout - currentTick;
                    if (delta > 0) {
                        return replyWithMarkdown(
                            t(state, "texts.needs.timeLeft") + " " + delta + " " + t(state, "texts.seconds"),
                            {
                                playerId: player.id
                            },
                            state
                        );
                    } else {
                        return replyWithMarkdown("You have already slept", { playerId: player.id }, state);
                    }
                case t(state, "menu.needs.stop"):
                    data.timeout = 0;
                    replyWithMarkdown(t(state, "texts.needs.stopSleeping"), { playerId: player.id }, state);
                    return enterScene(ctx, "mainScene", state);
                default:
                    return redirectToOopsScene(ctx, state);
            }
        } else if (!data.activity) {
            //Main
            switch (ctx.update.message.text) {
                case t(state, "menu.action.eat"):
                    data.timeout = currentTick + eatingTime;
                    data.timeoutStatus = true;
                    data.activity = "eating";
                    return enterScene(ctx, "mainScene", state);
                case t(state, "menu.action.drink"):
                    data.timeout = currentTick + drinkingTime;
                    data.timeoutStatus = true;
                    data.activity = "drinking";
                    return enterScene(ctx, "mainScene", state);
                case t(state, "menu.leaveCell"):
                    return enterScene(ctx, "hallwayRoomScene", state);
                case t(state, "menu.action.sleep"):
                    data.timeout = currentTick + sleepingTime;
                    data.timeoutStatus = true;
                    data.activity = "sleeping";
                    return enterScene(ctx, "mainScene", state);
                case t(state, "menu.inventory"):
                    return enterScene(ctx, "inventoryScene", state);
                //any scene
                case t(state, "menu.character"):
                    return enterScene(ctx, "characterScene", state);
                case t(state, "menu.menu"):
                    return enterScene(ctx, "mainMenuScene", state);
                case "NOW":
                    data.activity = "leveling1";
                    return enterScene(ctx, "levelUpScene", state);
                case "LATER":
                    return enterScene(ctx, "mainScene", state);
                default:
                    return redirectToOopsScene(ctx, state);
            }
        }
    })
);
/*
mainScene.on(
    "callback_query",
    ("callback_query",
    ctx => {
        stateWrapper(ctx, (ctx, state) => {
            ctx.editMessageReplyMarkup({ message_id: ctx.update.callback_query.message.message_id, reply_markup: null });
            let text = ctx.update.callback_query.data;
            //return ctx.answerCbQuery("later", false).then(() => enterSceneCB(ctx, "mainScene", state));
            // stateManager.queue.add(() => {
            //let state = stateManager.getState({ playerId: _.get(ctx, "from.id") });
            console.log("MAIN");

            if (text === "now") {
                state.player.data.activity = "leveling1";
            }
            //enterScene(ctx, "mainScene", state);
            //routerScene(ctx, "mainScene", false);
            // });
            state.player.data.activity = "leveling1";
            return ctx.answerCbQuery("later", false).then(() => enterScene(ctx, "mainScene", state));
            // });
        });
    })
);
//)
//);
*/
module.exports = mainScene;
