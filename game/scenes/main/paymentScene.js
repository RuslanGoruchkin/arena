import Scene from "telegraf/scenes/base";
import { enterScene, keyboard, redirectToOopsScene, stateWrapper, t } from "../../helpers";

const paymentScene = new Scene("paymentScene");

let buttons;

paymentScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        buttons = [[t(state, "menu.confirm.back")]];
        // let user = JSON.parse(JSON.stringify(variables.users[ctx.from.id]));
        return keyboard(
            t(state, "texts.shopScenes.donateText") + "\n\n" + t(state, "texts.shopScenes.donateLink", { link: "shouwld be link" }),
            buttons,
            { playerId: state.player.id },
            state
        );
    })
);

paymentScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        switch (ctx.update.message.text) {
            case t(state, "menu.confirm.back"):
                return enterScene(ctx, "mainMenuScene", state);
            default:
                return redirectToOopsScene(ctx, state);
        }
    })
);

module.exports = paymentScene;
