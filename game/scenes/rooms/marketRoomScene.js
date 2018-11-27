import Scene from "telegraf/scenes/base";
import { stateWrapper, t } from "../../helpers/ctx";
import { enterScene, keyboard, redirectToOopsScene, replyWithMarkdown } from "../../helpers/TelegramApiHelpers";

let debug = require("debug")("bot:marketRoomScene");

const marketRoomScene = new Scene("marketRoomScene");
marketRoomScene.enter(ctx => {
    return stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let status = t(state, "texts.status", {
            charClass: t(state, `menu.characters.${player.selectedCharacter.class}`),
            nickname: player.nickname,
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
            "You come closer and see three tents. One has lots of weapons. Other two sell shields and armor" +
            'Inbetween them sits a shady man. A tattoo under his eyes spells:"SECOND HAND"' +
            "Some people are talking about something. Some are playing APPULSE";
        let buttons = [];
        buttons.push([t(state, "menu.shop.weapons"), t(state, "menu.shop.shields"), t(state, "menu.shop.armor")]);
        buttons.push([t(state, "menu.rumors"), t(state, "menu.shop.secondHand"), t(state, "menu.appulse")]);
        buttons.push([t(state, "menu.hack.back")]);
        //any scene
        buttons.push([t(state, "menu.character"), t(state, "menu.menu")]);
        return keyboard(message, buttons, { playerId: state.player.id });
    });
});

marketRoomScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        switch (ctx.update.message.text) {
            case t(state, "menu.shop.weapons"):
                return enterScene(ctx, "weaponShopScene", state);
                break;
            case t(state, "menu.shop.shields"):
                return enterScene(ctx, "shieldShopScene", state);
                break;
            case t(state, "menu.shop.armor"):
                return enterScene(ctx, "armorShopScene", state);
                break;
            case t(state, "menu.rumors"):
                return enterScene(ctx, "rumorScene", state);
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
