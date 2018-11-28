import { enterScene, keyboard, replyWithMarkdown, stateWrapper, redirectToOopsScene, t } from "../../helpers";
import Scene from "telegraf/scenes/base";

const drinkingScene = new Scene("drinkingScene");
drinkingScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let data = player.data;
        let currentTick = state.currentTick;
        let drinkingTime = 36;
        data.timeout = currentTick + drinkingTime;
        data.timeoutStatus = true;
        data.activity = "drinking";
        return keyboard(
            t(state, "texts.needs.drinking"),
            [[t(state, "menu.needs.status")], [t(state, "menu.needs.stop")]],
            {
                playerId: state.player.id
            },
            state
        );
    })
);

drinkingScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        switch (ctx.update.message.text) {
            case t(state, "menu.needs.status"):
                let currentTick = state.currentTick;
                let timeout = player.data.timeout;
                let delta = timeout - currentTick;
                if (delta > 0) {
                    return replyWithMarkdown(
                        t(state, "texts.needs.timeLeft") + " " + delta + " " + t(state, "texts.seconds"),
                        {
                            playerId: player.id
                        },
                        state
                    );
                } else {
                    return replyWithMarkdown("You have already drunk", { playerId: player.id }, state);
                }
            case t(state, "menu.needs.stop"):
                timeout = 0;
                replyWithMarkdown(t(state, "texts.needs.stopDrinking"), { playerId: player.id }, state);
                return enterScene(ctx, "mainScene", state);
            default:
                return redirectToOopsScene(ctx, state);
        }
    })
);

module.exports = drinkingScene;
