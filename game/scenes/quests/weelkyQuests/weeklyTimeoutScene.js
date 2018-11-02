import Scene from "telegraf/scenes/base";
import { keyboard } from "../../../helpers/TelegramApiHelpers";
import { stateWrapper, translate } from "../../../helpers/ctx";
import { enterScene, redirectToOopsScene, replyWithMarkdown } from "../../../helpers/TelegramApiHelpers";

const weeklyTimeoutScene = new Scene("weeklyTimeoutScene");

weeklyTimeoutScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let data = player.data;
        let currentTick = data.tick;
        let weeklyTick = data.weeklyTick;
        let weeklyDelta = currentTick - weeklyTick;
        let weeklyLeft = 24 - weeklyDelta;
        return keyboard(
            "Please wait" + weeklyLeft + "hours for new weekly quest",
            [translate(state, "texts.accept"), translate(state, "texts.decline")],
            { playerId: state.player.id }
        );
    })
);

weeklyTimeoutScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        switch (ctx.update.message.text) {
            case translate(state, "texts.accept"):
                let hereShouldStartQuestText = "Here should start Quest";
                replyWithMarkdown(hereShouldStartQuestText, { playerId: state.player.id });
                enterScene(ctx, "mainScene", state);
                break;
            case translate(state, "texts.decline"):
                let youDonTLikeQuestWellText = "You don't like Quest? Well...";
                replyWithMarkdown(youDonTLikeQuestWellText, { playerId: state.player.id });
                enterScene(ctx, "mainScene", state);
                break;
            default:
                redirectToOopsScene(ctx);
                break;
        }
    })
);

module.exports = weeklyTimeoutScene;
