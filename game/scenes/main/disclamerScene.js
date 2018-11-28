import Scene from "telegraf/scenes/base";
import { enterScene, keyboard, redirectToOopsScene, stateWrapper, t } from "../../helpers";

const disclamerScene = new Scene("disclamerScene");

let buttons;

disclamerScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        buttons = [[t(state, "menu.confirm.confirm")]];
        return keyboard(
            t(state, "texts.betaDisclamer") + "\n" + t(state, "texts.betaLetBegin"),
            buttons,
            {
                playerId: state.player.id
            },
            state
        );
    })
);

disclamerScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        switch (ctx.update.message.text) {
            case t(state, "menu.confirm.confirm"):
                return enterScene(ctx, "selectCharacterScene", state);
            default:
                return redirectToOopsScene(ctx, state);
        }
    })
);

module.exports = disclamerScene;
