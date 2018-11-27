import Scene from "telegraf/scenes/base";
import { stateWrapper, t } from "../../helpers/ctx";
import { enterScene, keyboard, redirectToOopsScene, replyWithMarkdown } from "../../helpers/TelegramApiHelpers";

let debug = require("debug")("bot:hallwayRoomScene");

const hallwayRoomScene = new Scene("hallwayRoomScene");
hallwayRoomScene.enter(ctx => {
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
            'You are in a large hallway.\n It has a grandiose staircase in the center with giant floating "ARENA" hologram.\n' +
            'There is a stairway down as well. Weary sign nearby spells "TRAINING".' +
            "Also you see some people doing little business here";
        let buttons = [];
        buttons.push([t(state, "menu.enterArena"), t(state, "menu.room.market")]);
        buttons.push([t(state, "menu.room.training"), t(state, "menu.room.cell")]);
        //any scene
        buttons.push([t(state, "menu.character"), t(state, "menu.menu")]);
        return keyboard(message, buttons, { playerId: state.player.id });
    });
});


hallwayRoomScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        switch (ctx.update.message.text) {
            case t(state, "menu.enterArena"):
                return enterScene(ctx, "arenaScene", state);
                break;
            case t(state, "menu.room.market"):
                return enterScene(ctx, "marketRoomScene", state);
                break;
            case t(state, "menu.room.training"):
                return enterScene(ctx, "trainingRoomScene", state);
                break;
            case t(state, "menu.room.cell"):
                return enterScene(ctx, "mainScene", state);
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

module.exports = hallwayRoomScene;
