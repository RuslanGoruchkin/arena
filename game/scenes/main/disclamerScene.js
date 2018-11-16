import Scene from "telegraf/scenes/base";
import { keyboard } from "../../helpers/TelegramApiHelpers";
import { stateWrapper, t } from "../../helpers/ctx";
import { enterScene, redirectToOopsScene } from "../../helpers/TelegramApiHelpers";

const disclamerScene = new Scene("disclamerScene");

let buttons;

disclamerScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        console.log(state.language);
        buttons = [[t(state, "menu.confirm.confirm")]];
        return keyboard(t(state, "texts.betaDisclamer") + "\n" + t(state, "texts.betaLetBegin"), buttons, {
            playerId: state.player.id
        });
    })
);

disclamerScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        switch (ctx.update.message.text) {
            case t(state, "menu.confirm.confirm"):
                return enterScene(ctx, "selectCharacterScene", state);
                break;
            default:
                return redirectToOopsScene(ctx);
                break;
        }
    })
);

module.exports = disclamerScene;
