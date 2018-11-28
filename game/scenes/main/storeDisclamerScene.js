import Scene from "telegraf/scenes/base";
import { enterScene, keyboard, redirectToOopsScene, stateWrapper, t } from "../../helpers";

const storeDisclamerScene = new Scene("storeDisclamerScene");

let buttons;

storeDisclamerScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        buttons = [[t(state, "menu.confirm.confirm")]];
        return keyboard(t(state, "texts.betaDisclamer"), buttons, { playerId: state.player.id }, state);
    })
);

storeDisclamerScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        switch (ctx.update.message.text) {
            case t(state, "menu.confirm.confirm"):
                return enterScene(ctx, "paymentScene", state);
            default:
                return redirectToOopsScene(ctx, state);
        }
    })
);

module.exports = storeDisclamerScene;
