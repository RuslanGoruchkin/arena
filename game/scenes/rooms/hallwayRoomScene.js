import Scene from "telegraf/scenes/base";
import {
    enterScene,
    keyboard,
    replyWithMarkdown,
    stateWrapper,
    redirectToOopsScene,
    t,
    statusMessage
} from "../../helpers";
import _ from "lodash";

// let debug = require("debug")("bot:hallwayRoomScene");

const hallwayRoomScene = new Scene("hallwayRoomScene");
hallwayRoomScene.enter(ctx => {
    return stateWrapper(ctx, (ctx, state) => {
        statusMessage(state);

        let message =
            'You are in a large hallway.\n It has a grandiose staircase in the center with giant floating "ARENA" hologram.\n' +
            'There is a stairway down as well. Weary sign nearby spells "TRAINING".' +
            "Also you see some people doing little business here";
        let buttons = [];
        buttons.push([t(state, "menu.enterArena"), t(state, "menu.room.market")]);
        buttons.push([t(state, "menu.room.training"), t(state, "menu.room.cell")]);
        //any scene
        buttons.push([t(state, "menu.character"), t(state, "menu.menu")]);
        return keyboard(message, buttons, { playerId: state.player.id }, state);
    });
});

hallwayRoomScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        switch (ctx.update.message.text) {
            case t(state, "menu.enterArena"):
                return enterScene(ctx, "arenaScene", state);

            case t(state, "menu.room.market"):
                return enterScene(ctx, "marketRoomScene", state);

            case t(state, "menu.room.training"):
                return enterScene(ctx, "trainingRoomScene", state);

            case t(state, "menu.room.cell"):
                return enterScene(ctx, "mainScene", state);

            //any scene
            case t(state, "menu.character"):
                return enterScene(ctx, "characterScene", state);

            case t(state, "menu.menu"):
                return enterScene(ctx, "mainMenuScene", state);

            default:
                return redirectToOopsScene(ctx);
        }
    })
);

module.exports = hallwayRoomScene;
