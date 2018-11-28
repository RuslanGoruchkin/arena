import Scene from "telegraf/scenes/base";
import { enterScene, keyboard, redirectToOopsScene, stateWrapper, t } from "../../helpers";

const oopsScene = new Scene("oopsScene");

let buttons;

oopsScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        buttons = [[t(state, "menu.confirm.return")]];
        // let user = JSON.parse(JSON.stringify(variables.users[ctx.from.id]));
        return keyboard(t(state, "texts.oopsMessage"), buttons, { playerId: state.player.id }, state);
    })
);

oopsScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        switch (ctx.update.message.text) {
            case t(state, "menu.confirm.return"):
                if (ctx.session.lastScene === "oopsScene") {
                    return enterScene(ctx, "languageScene", state);
                }
                return enterScene(ctx, ctx.session.lastScene, state);
            default:
                return redirectToOopsScene(ctx, state);
        }
    })
);

module.exports = oopsScene;
