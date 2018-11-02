import Scene from "telegraf/scenes/base";
import { keyboard } from "../../../helpers/TelegramApiHelpers";
import { stateWrapper, translate } from "../../../helpers/ctx";
import { enterScene, redirectToOopsScene, replyWithMarkdown } from "../../../helpers/TelegramApiHelpers";

const weeklyQuestScene = new Scene("weeklyQuestScene");

weeklyQuestScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        return keyboard("Weekly Quest description", [translate(state, "texts.accept"), translate(state, "texts.decline")], {
            playerId: state.player.id
        });
    })
);

weeklyQuestScene.on("text", ctx =>
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

module.exports = weeklyQuestScene;
