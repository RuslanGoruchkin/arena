import Scene from "telegraf/scenes/base";
import { keyboard } from "../../helpers/TelegramApiHelpers";
import { stateWrapper, translate } from "../../helpers/ctx";
import { enterScene } from "../../helpers/TelegramApiHelpers";

const vendorModuleScene = new Scene("vendorModuleScene");

vendorModuleScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        return keyboard(
            translate(state, "texts.selectAction"),
            [[translate(state, "texts.shopScenes.vendorModuleScene.buyModule")], [translate(state, "texts.back")]],
            { playerId: state.player.id }
        );
    })
);

vendorModuleScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        if (text === translate(state, "texts.back")) {
            enterScene(ctx, "mainScene", state);
        } else if (text === translate(state, "texts.shopScenes.vendorModuleScene.buyModule")) {
            enterScene(ctx, "buyModuleScene", state);
        }
    })
);

module.exports = vendorModuleScene;
