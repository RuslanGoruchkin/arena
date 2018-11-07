import Scene from "telegraf/scenes/base";
import { keyboard } from "../../helpers/TelegramApiHelpers";
import { stateWrapper, translate } from "../../helpers/ctx";
import { enterScene, redirectToOopsScene } from "../../helpers/TelegramApiHelpers";

const disclamerScene = new Scene("disclamerScene");

let buttons;

disclamerScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        console.log(state.language);
        buttons = [[translate(state, "menu.confirm.confirm")]];
        return keyboard(translate(state, "texts.betaDisclamer") + "\n" + translate(state, "texts.betaLetBegin"), buttons, {
            playerId: state.player.id
        });
    })
);

disclamerScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        switch (ctx.update.message.text) {
            case translate(state, "menu.confirm.confirm"):
                enterScene(ctx, "questStartScene", state);
                break;
            default:
                redirectToOopsScene(ctx);
                break;
        }
    })
);

module.exports = disclamerScene;
