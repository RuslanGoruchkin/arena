import Scene from "telegraf/scenes/base";
import { keyboard } from "../../../helpers/TelegramApiHelpers";
import { stateWrapper, translate } from "../../../helpers/ctx";
import { enterScene, redirectToOopsScene } from "../../../helpers/TelegramApiHelpers";

const processorDefeatedActionScene = new Scene("processorDefeatedActionScene");

processorDefeatedActionScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        return keyboard(translate(state, "texts.selectAction"), [[translate(state, "texts.back")]], { playerId: state.player.id });
    })
);

processorDefeatedActionScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        switch (ctx.update.message.text) {
            case translate(state, "texts.back"):
                enterScene(ctx, "mainScene", state);
                break;
            default:
                redirectToOopsScene(ctx);
                break;
        }
    })
);

module.exports = processorDefeatedActionScene;
