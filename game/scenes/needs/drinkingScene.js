import { enterScene, keyboard, replyWithMarkdown, stateWrapper, redirectToOopsScene, t } from "../../helpers";
import Scene from "telegraf/scenes/base";

const drinkingScene = new Scene("drinkingScene");
drinkingScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let data = player.data;
        let currentTick = state.currentTick;
        let drinkingTime = 5;
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
        let data = player.data;
        let currentTick = state.currentTick;
        let drinkingTime = 36;
        let sleepingTime = 100;
        let eatingTime = 100;
        switch (ctx.update.message.text) {
            case t(state, "menu.needs.status"):
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
            case t(state, "menu.action.eat"):
                data.timeout = currentTick + eatingTime;
                data.timeoutStatus = true;
                data.activity = "eating";
                return enterScene(ctx, "eatingScene", state);
            case t(state, "menu.action.drink"):
                data.timeout = currentTick + drinkingTime;
                data.timeoutStatus = true;
                data.activity = "drinking";
                return enterScene(ctx, "drinkingScene", state);
            case t(state, "menu.leaveCell"):
                data.timeout = 0;
                return enterScene(ctx, "hallwayRoomScene", state);
            case t(state, "menu.action.sleep"):
                data.timeout = currentTick + sleepingTime;
                data.timeoutStatus = true;
                data.activity = "sleeping";
                return enterScene(ctx, "sleepingScene", state);
            case t(state, "menu.inventory"):
                data.timeout = 0;
                return enterScene(ctx, "inventoryScene", state);
            //any scene
            case t(state, "menu.character"):
                data.timeout = 0;
                return enterScene(ctx, "characterScene", state);
            case t(state, "menu.menu"):
                data.timeout = 0;
                return enterScene(ctx, "mainMenuScene", state);
            default:
                return redirectToOopsScene(ctx, state);
        }
    })
);

module.exports = drinkingScene;
