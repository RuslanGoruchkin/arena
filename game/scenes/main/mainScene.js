import Scene from "telegraf/scenes/base";
import { stateWrapper, t } from "../../helpers/ctx";
import { enterScene, keyboard, redirectToOopsScene, replyWithMarkdown } from "../../helpers/TelegramApiHelpers";

let debug = require("debug")("bot:mainScene");

const mainScene = new Scene("mainScene");
mainScene.enter(ctx => {
    return stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let status = t(state, "texts.status", {
            charClass: t(state, `menu.characters.${player.selectedCharacter.class}`),
            nickname: player.nickname,
            coins: player.data.coins,
            token: player.data.tokens,
            hp: player.data.hp,
            sp: player.data.sp,
            mp: player.data.mp,
            level: player.level,
            xp: player.XP,
            hungry: player.hungry * "hungry",
            thirsty: player.thirsty * "thirsty",
            sleepy: player.sleepy * "sleepy"
        });
        replyWithMarkdown(status, { playerId: state.player.id }, state);
        let message =
            "You are in your cell. You are sitting on your bed. There is a table nearby. You can see a glass of bits and a cybermeal, programmed not to induce vomit, on it. You can smell cybervomit though";
        let buttons = [];
        buttons.push([t(state, "menu.action.eat"), t(state, "menu.action.drink"), t(state, "menu.action.sleep")]);
        buttons.push([t(state, "menu.inventory"), t(state, "menu.leaveCell")]);
        //any scene
        buttons.push([t(state, "menu.character"), t(state, "menu.menu")]);
        return keyboard(message, buttons, { playerId: state.player.id });
    });
});

mainScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let data = player.data;
        let currentTick = state.currentTick;
        let drinkingTime = 36;
        let sleepingTime = 100;
        let eatingTime = 100;
        switch (ctx.update.message.text) {
            case t(state, "menu.action.eat"):
                data.timeout = currentTick + eatingTime;
                data.timeoutStatus = true;
                data.activity = "eating";
                return enterScene(ctx, "eatingScene", state);
                break;
            case t(state, "menu.action.drink"):
                data.timeout = currentTick + drinkingTime;
                data.timeoutStatus = true;
                data.activity = "drinking";
                return enterScene(ctx, "drinkingScene", state);
                break;
            case t(state, "menu.leaveCell"):
                return enterScene(ctx, "hallwayRoomScene", state);
                break;
            case t(state, "menu.action.sleep"):
                data.timeout = currentTick + sleepingTime;
                data.timeoutStatus = true;
                data.activity = "sleeping";
                return enterScene(ctx, "sleepingScene", state);
                break;
            case t(state, "menu.inventory"):
                return enterScene(ctx, "inventoryScene", state);
                break;
            //any scene
            case t(state, "menu.character"):
                return enterScene(ctx, "characterScene", state);
                break;
            case t(state, "menu.menu"):
                return enterScene(ctx, "mainMenuScene", state);
                break;
            default:
                return redirectToOopsScene(ctx);
                break;
        }
    })
);

module.exports = mainScene;
