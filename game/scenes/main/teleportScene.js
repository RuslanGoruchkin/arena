import Scene from "telegraf/scenes/base";
import { keyboard } from "../../helpers/TelegramApiHelpers";
import { stateWrapper, translate } from "../../helpers/ctx";
import _ from "lodash";
import { enterScene, replyWithMarkdown } from "../../helpers/TelegramApiHelpers";

const teleportScene = new Scene("teleportScene");

teleportScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        return keyboard(
            translate(state, "texts.startScenes.teleportScene.goHome"),
            [[translate(state, "texts.accept")], [translate(state, "texts.decline")]],
            { playerId: state.player.id }
        );
    })
);

teleportScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        let player = state.player;
        switch (text) {
            case translate(state, "texts.accept"):
                player.data.programsInMemory = [];
                player.coordinates.xPos = player.personalCoordinates.xPos;
                player.coordinates.yPos = player.personalCoordinates.yPos;
                if (_.includes(player.currentFloor, "fight")) {
                    let questFailed = "Your quest was failed";
                    replyWithMarkdown(questFailed, { playerId: state.player.id });
                    enterScene(ctx, "congratulationQuestScene", state);
                    break;
                }
                player.currentFloor = player.personalCoordinates.floor;
                enterScene(ctx, "mainScene", state);
                break;
            case translate(state, "texts.decline"):
                enterScene(ctx, "mainMenuScene", state);
                break;
        }
    })
);

module.exports = teleportScene;
