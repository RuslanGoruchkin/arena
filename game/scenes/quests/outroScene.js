import Scene from "telegraf/scenes/base";
import { stateWrapper } from "../../helpers/ctx";
import { enterScene} from "../../helpers/TelegramApiHelpers";

const outroScene = new Scene("outroScene");

outroScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        if (player.currentQuest) {
            if (player.currentQuest.outroScene) {
                return enterScene(ctx, player.currentQuest.outroScene, state);
            } else {
                return enterScene(ctx, "rewardScene", state);
            }
        } else {
            return enterScene(ctx, "mainScene", state);
        };
    })
);

module.exports = outroScene;
