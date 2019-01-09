import Scene from "telegraf/scenes/base";
import { enterScene, keyboard, redirectToOopsScene, replyWithMarkdown, stateWrapper, statusMessage, t } from "../../helpers";

const trainingRoomScene = new Scene("trainingRoomScene");
trainingRoomScene.enter(ctx => {
    return stateWrapper(ctx, (ctx, state) => {
        let message = "";
        let buttons = [];
        let player = state.player;
        let data = player.data;
        console.log(data.activity || "main");
        if (data.activity !== "") {
            if (data.activity.startsWith("training")) {
                message = t(state, "texts.needs.training");
                buttons = [[t(state, "menu.needs.status")], [t(state, "menu.needs.stop")]];
            }
        } else {
            statusMessage(state);
            message = "You are in a training room. What do you want to train?";
            buttons = [
                [t(state, "texts.attributeNames.strength"), t(state, "texts.attributeNames.vitality"), t(state, "texts.attributeNames.wisdom")],
                [t(state, "texts.attributeNames.intelligence"), t(state, "texts.attributeNames.dexterity"), t(state, "texts.back")]
            ];
        }

        return keyboard(message, buttons, { playerId: state.player.id });
    });
});

trainingRoomScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let data = player.data;
        let currentTick = state.currentTick;
        let trainingTime = 10;
        //Training
        if (data.activity.startsWith("training")) {
            switch (ctx.update.message.text) {
                case t(state, "menu.needs.status"):
                    let delta = data.timeout - currentTick;
                    if (delta > 0) {
                        return replyWithMarkdown(
                            t(state, "texts.needs.timeLeft") + " " + delta + " " + t(state, "texts.seconds"),
                            {
                                playerId: player.id
                            },
                            state
                        );
                    } else {
                        return replyWithMarkdown("You are already trained", { playerId: player.id }, state);
                    }
                case t(state, "menu.needs.stop"):
                    data.timeout = 0;
                    data.activity = "";
                    return enterScene(ctx, "trainingRoomScene", state);
                default:
                    return redirectToOopsScene(ctx, state);
            }
        } else if (!data.activity) {
            //Main
            switch (ctx.update.message.text) {
                case t(state, "texts.attributeNames.strength"):
                    data.timeout = currentTick + trainingTime;
                    data.timeoutStatus = true;
                    data.activity = "training_strength";
                    return enterScene(ctx, "trainingRoomScene", state);
                case t(state, "texts.attributeNames.vitality"):
                    data.timeout = currentTick + trainingTime;
                    data.timeoutStatus = true;
                    data.activity = "training_vitality";
                    return enterScene(ctx, "trainingRoomScene", state);
                case t(state, "texts.attributeNames.wisdom"):
                    data.timeout = currentTick + trainingTime;
                    data.timeoutStatus = true;
                    data.activity = "training_wisdom";
                    return enterScene(ctx, "trainingRoomScene", state);
                case t(state, "texts.attributeNames.intelligence"):
                    data.timeout = currentTick + trainingTime;
                    data.timeoutStatus = true;
                    data.activity = "training_intelligence";
                    return enterScene(ctx, "trainingRoomScene", state);
                case t(state, "texts.attributeNames.dexterity"):
                    data.timeout = currentTick + trainingTime;
                    data.timeoutStatus = true;
                    data.activity = "training_dexterity";
                    return enterScene(ctx, "trainingRoomScene", state);
                //any scene
                case t(state, "texts.back"):
                    return enterScene(ctx, "hallwayRoomScene", state);
                default:
                    return redirectToOopsScene(ctx, state);
            }
        }
    })
);

module.exports = trainingRoomScene;
