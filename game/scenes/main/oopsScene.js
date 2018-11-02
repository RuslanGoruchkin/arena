import Scene from "telegraf/scenes/base";
import { keyboard } from "../../helpers/TelegramApiHelpers";
import { stateWrapper, translate } from "../../helpers/ctx";
import { enterScene, redirectToOopsScene } from "../../helpers/TelegramApiHelpers";

const oopsScene = new Scene("oopsScene");

let buttons;

oopsScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        buttons = [[translate(state, "menu.confirm.return")]];
        // let user = JSON.parse(JSON.stringify(variables.users[ctx.from.id]));
        return keyboard(translate(state, "texts.oopsMessage"), buttons, { playerId: state.player.id });
    })
);

oopsScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        switch (ctx.update.message.text) {
            case translate(state, "menu.confirm.return"):
                if (ctx.session.lastScene === "oopsScene") {
                    enterScene(ctx, "languageScene", state);
                    break;
                }
                enterScene(ctx, ctx.session.lastScene, state);
                break;
            default:
                redirectToOopsScene(ctx);
                break;
        }
    })
);

module.exports = oopsScene;
