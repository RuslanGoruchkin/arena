import Scene from "telegraf/scenes/base";
import { keyboard } from "../../helpers/TelegramApiHelpers";
import { stateWrapper, translate } from "../../helpers/ctx";
import { enterScene, redirectToOopsScene } from "../../helpers/TelegramApiHelpers";

const availableSpaceModuleScene = new Scene("availableSpaceModuleScene");

availableSpaceModuleScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        return keyboard(
            translate(state, "texts.selectAction"),
            [[translate(state, "texts.modulesScenes.manageModuleScene.placeModuleFromInventory")], [translate(state, "texts.back")]],
            { playerId: state.player.id }
        );
    })
);

availableSpaceModuleScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        switch (text) {
            case translate(state, "texts.back"):
                enterScene(ctx, "mainScene", state);
                break;
            case translate(state, "texts.modulesScenes.manageModuleScene.placeModuleFromInventory"):
                enterScene(ctx, "placeModuleScene", state);
                break;
            default:
                redirectToOopsScene(ctx);
                break;
        }
    })
);

module.exports = availableSpaceModuleScene;
