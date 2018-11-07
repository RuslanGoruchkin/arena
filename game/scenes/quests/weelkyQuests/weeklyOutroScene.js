import Scene from "telegraf/scenes/base";
import { keyboard } from "../../../helpers/TelegramApiHelpers";
import { stateWrapper, translate } from "../../../helpers/ctx";
import { enterScene } from "../../../helpers/TelegramApiHelpers";

const weeklyOutroScene = new Scene("weeklyOutroScene");

weeklyOutroScene.enter(ctx => {
    stateWrapper(ctx, (ctx, state) => {
        return keyboard(ctx, translate(state, `texts.quests.success`), [translate(state, "texts.ok")], { playerId: state.player.id });
    });
});

weeklyOutroScene.on("text", ctx => {
    stateWrapper(ctx, (ctx, state) => {
        if (ctx.update.message.text === translate(state, "texts.ok") || ctx.update.message.text === translate(state, "texts.accept")) {
            let player = state.player;
            player.currentFloor = "4x4";
            player.personalCoordinates.floor = "4x4";
            player.currentQuest = undefined;
            enterScene(ctx, "mainScene", state);
        } else {
            console.log(
                `User ${ctx.update.message.from.first_name} ${ctx.update.message.from.last_name} ${
                    ctx.update.message.from.id
                } tries to write "${ctx.update.message.text}" in ${ctx.session.__scenes.current}`
            );
            ctx.session.player.lastScene = ctx.session.__scenes.current;
            enterScene(ctx, "oopsScene", state);
        }
    });
});

module.exports = weeklyOutroScene;
