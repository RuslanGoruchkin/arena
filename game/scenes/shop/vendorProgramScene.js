import Scene from "telegraf/scenes/base";
import { keyboard } from "../../helpers/TelegramApiHelpers";
import { stateWrapper, t } from "../../helpers/ctx";
import { enterScene, redirectToOopsScene } from "../../helpers/TelegramApiHelpers";

const vendorProgramScene = new Scene("vendorProgramScene");

vendorProgramScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        return keyboard(
            t(state, "texts.selectAction"),
            [
                [
                    t(state, "texts.shopScenes.vendorProgramScene.buyProgram"),
                    t(state, "texts.shopScenes.vendorProgramScene.sellProgram")
                ],
                [t(state, "texts.back")]
            ],
            { playerId: state.player.id }
        );
    })
);

vendorProgramScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        switch (ctx.update.message.text) {
            case t(state, "texts.shopScenes.vendorProgramScene.buyProgram"):
                enterScene(ctx, "buyProgramScene", state);
                break;
            case t(state, "texts.shopScenes.vendorProgramScene.sellProgram"):
                enterScene(ctx, "sellProgramScene", state);
                break;
            case t(state, "texts.back"):
                enterScene(ctx, "mainScene", state);
                break;
            default:
                redirectToOopsScene(ctx);
                break;
        }
    })
);

module.exports = vendorProgramScene;
