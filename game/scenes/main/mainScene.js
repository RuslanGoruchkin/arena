import Scene from "telegraf/scenes/base";
import { enterScene, keyboard, redirectToOopsScene, replyWithMarkdown, stateWrapper, t } from "../../helpers";
// let debug = require("debug")("bot:mainScene");

const mainScene = new Scene("mainScene");
mainScene.enter(ctx => {
    return stateWrapper(ctx, (ctx, state) => {
        //Status report start

        let player = state.player;
        let needs = (player.hungry * " hungry " + player.thirsty * "thirsty " + player.sleepy * "sleepy ") | "Fine";
        let status = t(state, "texts.status", {
            charClass: t(state, `menu.characters.${player.selectedCharacter.class}`),
            nickname: player.nickname,
            coins: player.data.coins,
            tokens: player.data.tokens,
            hp: player.data.hp,
            sp: player.data.sp,
            mp: player.data.mp,
            level: player.level,
            xp: player.XP,
            needs: needs
        });
        replyWithMarkdown(status, { playerId: state.player.id }, state);

        //Status report end

        let message =
            "You are in your cell. You are sitting on your bed. There is a table nearby. You can see a glass of bits and a cybermeal on it.";
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
            case t(state, "menu.action.drink"):
                data.timeout = currentTick + drinkingTime;
                data.timeoutStatus = true;
                data.activity = "drinking";
                return enterScene(ctx, "drinkingScene", state);
            case t(state, "menu.leaveCell"):
                return enterScene(ctx, "hallwayRoomScene", state);
            case t(state, "menu.action.sleep"):
                data.timeout = currentTick + sleepingTime;
                data.timeoutStatus = true;
                data.activity = "sleeping";
                return enterScene(ctx, "sleepingScene", state);
            case t(state, "menu.inventory"):
                return enterScene(ctx, "inventoryScene", state);
            //any scene
            case t(state, "menu.character"):
                return enterScene(ctx, "characterScene", state);
            case t(state, "menu.menu"):
                return enterScene(ctx, "mainMenuScene", state);
            default:
                return redirectToOopsScene(ctx, state);
        }
    })
);

module.exports = mainScene;
