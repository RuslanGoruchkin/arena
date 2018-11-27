import Scene from "telegraf/scenes/base";
import { stateWrapper, t } from "../../helpers/ctx";
import { enterScene, keyboard, redirectToOopsScene, replyWithMarkdown } from "../../helpers/TelegramApiHelpers";

let debug = require("debug")("bot:marketRoomScene");

const marketRoomScene = new Scene("marketRoomScene");
marketRoomScene.enter(ctx => {
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
            "You come closer and see three tents. One has lots of weapons. Other two sell shields and armor\n" +
            'Inbetween them sits a shady man. A tattoo under his eyes spells:"SECOND HAND"\n' +
            "Some people are talking about something. Some are playing APPULSE\n";
        let buttons = [];
        buttons.push([t(state, "menu.shop.consumables"), t(state, "menu.shop.secondHand")]);
        buttons.push([t(state, "menu.rumors"), t(state, "menu.appulse")]);
        buttons.push([t(state, "menu.hack.back")]);
        //any scene
        buttons.push([t(state, "menu.character"), t(state, "menu.menu")]);
        return keyboard(message, buttons, { playerId: state.player.id });
    });
});

marketRoomScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        switch (ctx.update.message.text) {
            case t(state, "menu.shop.consumables"):
                return enterScene(ctx, "vendorScene", state);
                break;
            case t(state, "menu.shop.secondHand"):
                return enterScene(ctx, "secondHandScene", state);
                break;
            case t(state, "menu.appulse"):
                return enterScene(ctx, "appulseScene", state);
                break;
            case t(state, "menu.hack.back"):
                return enterScene(ctx, "hallwayRoomScene", state);
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

module.exports = marketRoomScene;
