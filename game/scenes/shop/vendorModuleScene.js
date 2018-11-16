import Scene from "telegraf/scenes/base";
import { keyboard } from "../../helpers/TelegramApiHelpers";
import { stateWrapper, t } from "../../helpers/ctx";
import { enterScene } from "../../helpers/TelegramApiHelpers";

const vendorModuleScene = new Scene("vendorModuleScene");

vendorModuleScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        return keyboard(
            t(state, "texts.selectAction"),
            [[t(state, "texts.shopScenes.vendorModuleScene.buyModule")], [t(state, "texts.back")]],
            { playerId: state.player.id }
        );
    })
);

vendorModuleScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        if (text === t(state, "texts.back")) {
            enterScene(ctx, "mainScene", state);
        } else if (text === t(state, "texts.shopScenes.vendorModuleScene.buyModule")) {
            enterScene(ctx, "buyModuleScene", state);
        }
    })
);

module.exports = vendorModuleScene;
