import Scene from "telegraf/scenes/base";
import { placeModuleToInventory } from "../../../util";
import { stateWrapper, translate } from "../../../helpers/ctx";
import { enterScene, keyboard, redirectToOopsScene } from "../../../helpers/TelegramApiHelpers";

const processorModuleScene = new Scene("processorModuleScene");

processorModuleScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let message = translate(state, "texts.selectAction");
        let player = state.player;
        let coordinates = player.coordinates;
        let processor = state.map[player.currentFloor][coordinates.xPos][coordinates.yPos];
        if (!processor.complete && !processor.programToCreate) {
            return keyboard(
                message,
                [
                    [translate(state, "texts.modulesScenes.processorModuleScene.createProgram")],
                    [translate(state, "texts.modulesScenes.manageModuleScene.placeModuleToInventory")],
                    [translate(state, "texts.back")]
                ],
                { playerId: state.player.id }
            );
        } else {
            enterScene(ctx, "createProgramScene", state);
        }
    })
);

processorModuleScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        switch (ctx.update.message.text) {
            case translate(state, "texts.modulesScenes.processorModuleScene.createProgram"):
                enterScene(ctx, "createProgramScene", state);
                break;
            case translate(state, "texts.back"):
                enterScene(ctx, "mainScene", state);
                break;
            case translate(state, "texts.modulesScenes.manageModuleScene.placeModuleToInventory"):
                placeModuleToInventory(state, { ctx });
                break;
            default:
                redirectToOopsScene(ctx);
                break;
        }
    })
);

module.exports = processorModuleScene;
