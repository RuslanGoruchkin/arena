import Scene from "telegraf/scenes/base";
import { keyboard } from "../../helpers/TelegramApiHelpers";
import { stateWrapper, translate } from "../../helpers/ctx";
import { enterScene, redirectToOopsScene } from "../../helpers/TelegramApiHelpers";

const questRestartScene = new Scene("questRestartScene");

questRestartScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        return keyboard(translate(state, "texts.restart"), [[translate(state, "texts.accept"), translate(state, "texts.decline")]], {
            playerId: state.player.id
        });
    })
);

questRestartScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        switch (ctx.update.message.text) {
            case translate(state, "texts.accept"):
                let player = state.player;
                player.currentQuest.introPlayed = false;
                break;
            case translate(state, "texts.decline"):
                state.player.currentQuest.failed = true;
                state.player.currentQuest = undefined;
                enterScene(ctx, "mainScene", state);
                break;
            default:
                redirectToOopsScene(ctx);
                break;
        }
    })
);

export default questRestartScene;
