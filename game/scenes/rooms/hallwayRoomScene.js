import Scene from "telegraf/scenes/base";
import { enterScene, keyboard, replyWithMarkdown, stateWrapper, redirectToOopsScene, t } from "../../helpers";

// let debug = require("debug")("bot:hallwayRoomScene");

const hallwayRoomScene = new Scene("hallwayRoomScene");
hallwayRoomScene.enter(ctx => {
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
