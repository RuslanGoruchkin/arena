import Scene from "telegraf/scenes/base";
import { enterScene, keyboard, replyWithMarkdown, stateWrapper, redirectToOopsScene, t } from "../../helpers";

// let debug = require("debug")("bot:marketRoomScene");

const marketRoomScene = new Scene("marketRoomScene");
marketRoomScene.enter(ctx => {
    return stateWrapper(ctx, (ctx, state) => {
        //Status report start

        let player = state.player;
        let needs = "";
        if (player.hungry) needs += " hungry";
        if (player.sleepy) needs += " sleepy";
        if (player.thirsty) needs += " thirsty";
        if (needs === "") needs = "Fine";
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
            "You come closer and see some shops selling things\n" +
            'Inbetween them sits a shady man. A tattoo under his eyes spells:"SECOND HAND"\n' +
            "Some people are talking about something.\nSome are playing APPULSE\n";
        let buttons = [];
        buttons.push([t(state, "menu.shop.consumables"), t(state, "menu.shop.secondHand")]);
        buttons.push([t(state, "menu.rumors"), t(state, "menu.appulse")]);
        buttons.push([t(state, "menu.hack.back")]);
        //any scene
        buttons.push([t(state, "menu.character"), t(state, "menu.menu")]);
        return keyboard(message, buttons, { playerId: state.player.id }, state);
    });
});

marketRoomScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        switch (ctx.update.message.text) {
            case t(state, "menu.shop.consumables"):
                return enterScene(ctx, "vendorScene", state);

            case t(state, "menu.shop.secondHand"):
                return enterScene(ctx, "secondHandScene", state);

            case t(state, "menu.appulse"):
                return enterScene(ctx, "appulseScene", state);

            case t(state, "menu.hack.back"):
                return enterScene(ctx, "hallwayRoomScene", state);

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

module.exports = marketRoomScene;
