import { stateWrapper, t } from "../../helpers/ctx";
import { enterScene, keyboard, redirectToOopsScene, replyWithMarkdown } from "../../helpers/TelegramApiHelpers";
import Scene from "telegraf/scenes/base";

const sleepingScene = new Scene("sleepingScene");
sleepingScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let data = player.data;
        let currentTick = state.currentTick;
        let sleepingTime = 100;
        data.timeout = currentTick + sleepingTime;
        data.timeoutStatus = true;
        data.activity = "sleeping";
        return keyboard(t(state, "texts.needs.sleeping"),
            [[t(state, "menu.needs.status")],[t(state, "menu.needs.stop")]]);
    })
);


sleepingScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let timeout = player.data.timeout;
        switch (text) {
            case t(state, "texts.needs.status"):
                let currentTick = state.currentTick;
                let delta = timeout - currentTick;
                replyWithMarkdown(t(state, "texts.needs.timeLeft")+" "+delta+" "+t(state, "texts.seconds"), params);
                break;
            case t(state, "texts.needs.stop"):
                timeout=0;
                replyWithMarkdown(t(state, "texts.needs.stopSleeping"), params);
                enterScene(ctx, "mainScene", state);
                break;
            default:
                redirectToOopsScene(ctx);
                break;
        }
    })
);

module.exports = sleepingScene;
