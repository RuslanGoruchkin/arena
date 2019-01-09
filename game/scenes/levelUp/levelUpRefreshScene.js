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
import { items } from "../../resources/items";
// let debug = require("debug")("bot:mainScene");

const levelUpRefreshScene = new Scene("levelUpRefreshScene");

levelUpRefreshScene.enter(ctx => {
    return stateWrapper(ctx, (ctx, state) => {
        let options = [];
        options[0] = [];
        let player = state.player;
        player.data.activity="leveling1";
        return enterScene(ctx, "mainScene", state);
    });
});

levelUpRefreshScene.on("text", ctx =>
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
        } else if (data.activity === "leveling1" || data.activity === "leveling2") {
            //Level-Up
            if (data.statPoints > 0 && data.activity === "leveling2") {
                switch (ctx.update.message.text) {
                    case t(state, "texts.attributeNames.strength"):
                        state.player.data.levelBuffer.att.strength += 1;
                        data.statPoints -= 1;
                        break;
                    case t(state, "texts.attributeNames.dexterity"):
                        state.player.data.levelBuffer.att.dexterity += 1;
                        data.statPoints -= 1;
                        break;
                    case t(state, "texts.attributeNames.intelligence"):
                        state.player.data.levelBuffer.att.intelligence += 1;
                        data.statPoints -= 1;
                        break;
                    case t(state, "texts.attributeNames.wisdom"):
                        state.player.data.levelBuffer.att.wisdom += 1;
                        data.statPoints -= 1;
                        break;
                    case t(state, "texts.attributeNames.vitality"):
                        state.player.data.levelBuffer.att.vitality += 1;
                        data.statPoints -= 1;
                        break;
                }
            }
            if (data.classPoints > 0 && data.activity === "leveling1") {
                switch (ctx.update.message.text) {
                    case t(state, "menu.characters.warrior"):
                        state.player.data.levelBuffer.cls.warrior += 1;
                        data.classPoints -= 1;
                        data.activity = "leveling1";
                        break;
                    case t(state, "menu.characters.mage"):
                        state.player.data.levelBuffer.cls.mage += 1;
                        data.classPoints -= 1;
                        data.activity = "leveling1";
                        break;
                    case t(state, "menu.characters.evangelist"):
                        state.player.data.levelBuffer.cls.evangelist += 1;
                        data.classPoints -= 1;
                        data.activity = "leveling1";
                        break;
                    case t(state, "menu.characters.prophet"):
                        state.player.data.levelBuffer.cls.prophet += 1;
                        data.classPoints -= 1;
                        data.activity = "leveling1";
                        break;
                    case t(state, "menu.characters.nomad"):
                        state.player.data.levelBuffer.cls.nomad += 1;
                        data.classPoints -= 1;
                        data.activity = "leveling1";
                        break;
                }
            }
            switch (ctx.update.message.text) {
                case t(state, "texts.ok"):
                    if (data.activity === "leveling1") {
                        _.forEach(player.selectedCharacter.classes, function(classLvl, key) {
                            player.selectedCharacter.classes[key] = classLvl + state.player.data.levelBuffer.cls[key];
                            state.player.data.levelBuffer.cls[key] = 0;
                        });
                        data.activity = "leveling2";
                    } else if (data.activity === "leveling2") {
                        _.forEach(state.player.data.levelBuffer.att, function(value, att) {
                            player.selectedCharacter.classes[att] = value + player.selectedCharacter.classes[att];
                            state.player.data.levelBuffer.att[att] = 0;
                        });
                        data.activity = "";
                    }
                case "RESET":
                    data.classPoints += _.sum(state.player.data.levelBuffer.cls);
                    _.fill(state.player.data.levelBuffer.cls, 0);
                    data.statPoints += _.sum(state.player.data.levelBuffer.att);
                    _.fill(state.player.data.levelBuffer.att, 0);
                    if (ctx.update.message.text === "LATER") {
                        data.activity = "";
                    }
                case "LATER":
                    data.classPoints += _.sum(state.player.data.levelBuffer.cls);
                    _.fill(state.player.data.levelBuffer.cls, 0);
                    data.statPoints += _.sum(state.player.data.levelBuffer.att);
                    _.fill(state.player.data.levelBuffer.att, 0);
                    data.activity = "";
            }
            return enterScene(ctx, "mainScene", state);
            //Level-Up End
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
                case t(state, "menu.characters.warrior"):
                    if (data.classPoints > 0) {
                        state.player.data.levelBuffer.cls.warrior += 1;
                        data.classPoints -= 1;
                    }
                    data.activity = "leveling1";
                    return enterScene(ctx, "levelUpRefreshScene", state);
                case t(state, "menu.characters.mage"):
                    if (data.classPoints > 0) {
                        state.player.data.levelBuffer.cls.mage += 1;
                        data.classPoints -= 1;
                    }
                    data.activity = "leveling1";
                    return enterScene(ctx, "levelUpRefreshScene", state);
                case t(state, "menu.characters.evangelist"):
                    if (data.classPoints > 0) {
                        state.player.data.levelBuffer.cls.evangelist += 1;
                        data.classPoints -= 1;
                    }
                    data.activity = "leveling1";
                    return enterScene(ctx, "levelUpRefreshScene", state);
                case t(state, "menu.characters.prophet"):
                    if (data.classPoints > 0) {
                        state.player.data.levelBuffer.cls.prophet += 1;
                        data.classPoints -= 1;
                    }
                    data.activity = "leveling1";
                    return enterScene(ctx, "levelUpRefreshScene", state);
                case t(state, "menu.characters.nomad"):
                    if (data.classPoints > 0) {
                        state.player.data.levelBuffer.cls.nomad += 1;
                        data.classPoints -= 1;
                    }
                    data.activity = "leveling1";
                    return enterScene(ctx, "levelUpRefreshScene", state);
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
                return ctx.answerCbQuery("later", false).then(() => enterSceneCB(ctx, "levelUpRefreshScene", null));
                // });
            });
        })
);
*/
//)
//);

module.exports = levelUpRefreshScene;
