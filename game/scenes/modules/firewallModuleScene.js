import Scene from "telegraf/scenes/base";
import { placeModuleToInventory } from "../../util";
import { stateWrapper, translate } from "../../helpers/ctx";
import { enterScene, keyboard, redirectToOopsScene } from "../../helpers/TelegramApiHelpers";

const firewallModuleScene = new Scene("firewallModuleScene");

firewallModuleScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        return keyboard(
            translate(state, "texts.selectAction"),
            [[translate(state, "texts.modulesScenes.manageModuleScene.placeModuleToInventory")], [translate(state, "texts.back")]],
            { playerId: state.player.id }
        );
    })
);

firewallModuleScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        switch (text) {
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

module.exports = firewallModuleScene;
