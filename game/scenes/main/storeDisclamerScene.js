import Scene from "telegraf/scenes/base";
import { keyboard } from "../../helpers/TelegramApiHelpers";
import { stateWrapper, t } from "../../helpers/ctx";
import { enterScene, redirectToOopsScene } from "../../helpers/TelegramApiHelpers";

const storeDisclamerScene = new Scene("storeDisclamerScene");

let buttons;

storeDisclamerScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        buttons = [[t(state, "menu.confirm.confirm")]];
        return keyboard(t(state, "texts.betaDisclamer"), buttons, { playerId: state.player.id });
    })
);

storeDisclamerScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        switch (ctx.update.message.text) {
            case t(state, "menu.confirm.confirm"):
                enterScene(ctx, "paymentScene", state);
                break;
            default:
                redirectToOopsScene(ctx);
                break;
        }
    })
);

module.exports = storeDisclamerScene;
