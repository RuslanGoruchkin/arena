import Scene from "telegraf/scenes/base";
import { keyboard } from "../../../helpers/TelegramApiHelpers";
import { stateWrapper, translate } from "../../../helpers/ctx";
import { enterScene, redirectToOopsScene, replyWithMarkdown } from "../../../helpers/TelegramApiHelpers";

const dailyTimeoutScene = new Scene("dailyTimeoutScene");

dailyTimeoutScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let data = player.data;
        let currentTick = state.currentTick;
        let dailyTick = data.dailyTick;
        let dailyDelta = currentTick - dailyTick;
        let dailyLeft = 24 - dailyDelta;
        return keyboard(
            "Please wait" + dailyLeft + "hours for new daily quest",
            [[translate(state, "texts.accept")], [translate(state, "texts.decline")]],
            { playerId: state.player.id }
        );
    })
);

dailyTimeoutScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        switch (ctx.update.message.text) {
            case translate(state, "texts.accept"): {
                let text = "Here should start Quest";
                replyWithMarkdown(text, { playerId: state.player.id });
                enterScene(ctx, "mainScene", state);
                break;
            }
            case translate(state, "texts.decline"): {
                let text = "You don't like Quest? Well...";
                replyWithMarkdown(text, { playerId: state.player.id });
                enterScene(ctx, "mainScene", state);
                break;
            }
            default:
                redirectToOopsScene(ctx);
                break;
        }
    })
);

module.exports = dailyTimeoutScene;
