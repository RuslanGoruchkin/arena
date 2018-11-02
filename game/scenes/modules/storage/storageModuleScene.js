import Scene from "telegraf/scenes/base";
import { placeModuleToInventory } from "../../../util";
import { stateWrapper, translate } from "../../../helpers/ctx";
import { enterScene, keyboard } from "../../../helpers/TelegramApiHelpers";

const storageModuleScene = new Scene("storageModuleScene");

storageModuleScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let message = translate(state, "texts.selectAction");
        let buttons = [
            [translate(state, "texts.modulesScenes.transferProgramFromStorageScene.loadPrograms")],
            [translate(state, "texts.modulesScenes.transferProgramFromMemoryScene.savePrograms")],
            [translate(state, "texts.modulesScenes.manageModuleScene.placeModuleToInventory")],
            [translate(state, "texts.back")]
        ];
        return keyboard(message, buttons, { playerId: state.player.id });
    })
);

storageModuleScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        switch (text) {
            case translate(state, "texts.modulesScenes.transferProgramFromStorageScene.loadPrograms"):
                enterScene(ctx, "transferProgramFromMemoryScene", state);
                break;
            case translate(state, "texts.modulesScenes.transferProgramFromMemoryScene.savePrograms"):
                enterScene(ctx, "transferProgramFromStorageScene", state);
                break;
            case translate(state, "texts.modulesScenes.manageModuleScene.placeModuleToInventory"):
                placeModuleToInventory(state, { ctx });
                break;
            case translate(state, "texts.back"):
                enterScene(ctx, "mainScene", state);
                break;
        }
    })
);

module.exports = storageModuleScene;
