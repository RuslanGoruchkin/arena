import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { enterScene, keyboard, replyWithMarkdown, stateWrapper, t } from "../../helpers";

const teleportScene = new Scene("teleportScene");

teleportScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        return keyboard(
            t(state, "texts.startScenes.teleportScene.goHome"),
            [[t(state, "texts.accept")], [t(state, "texts.decline")]],
            {
                playerId: state.player.id
            },
            state
        );
    })
);

teleportScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        let player = state.player;
        switch (text) {
            case t(state, "texts.accept"):
                player.data.programsInMemory = [];
                player.coordinates.xPos = player.personalCoordinates.xPos;
                player.coordinates.yPos = player.personalCoordinates.yPos;
                if (_.includes(player.currentFloor, "fight")) {
                    let questFailed = "Your quest was failed";
                    return replyWithMarkdown(questFailed, { playerId: state.player.id }, state).then(
                        enterScene(ctx, "congratulationQuestScene", state)
                    );
                }
                player.currentFloor = player.personalCoordinates.floor;
                return enterScene(ctx, "mainScene", state);
            case t(state, "texts.decline"):
                return enterScene(ctx, "mainMenuScene", state);
        }
    })
);

module.exports = teleportScene;
