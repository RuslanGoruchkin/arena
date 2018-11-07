import Scene from "telegraf/scenes/base";
import { keyboard } from "../../../helpers/TelegramApiHelpers";
import { stateWrapper, translate } from "../../../helpers/ctx";
import { enterScene } from "../../../helpers/TelegramApiHelpers";

const dailyOutroScene = new Scene("dailyOutroScene");

dailyOutroScene.enter(ctx => {
    stateWrapper(ctx, (ctx, state) => {
        let questName = state.player.currentQuest.name;
        return keyboard(ctx, translate(state, `texts.quests.${questName}.outro`), [translate(state, `texts.quests.${questName}.corpA`), translate(state, `quests.${questName}.corpB`)], { playerId: state.player.id });
    });
});

dailyOutroScene.on("text", ctx => {
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        player.currentFloor = "4x4";
        player.personalCoordinates.floor = "4x4";
        let questName = state.player.currentQuest.name;
        if (ctx.update.message.text === translate(state, `texts.quests.${questName}.corpB`)) {
            enterScene(ctx, "rewardSceneB", state);
        } else if (ctx.update.message.text === translate(state, `texts.quests.${questName}.corpA`)) {
            enterScene(ctx, "rewardScene", state);
        } else {
            console.log(
                `User ${ctx.update.message.from.first_name} ${ctx.update.message.from.last_name} ${
                    ctx.update.message.from.id
                } tries to write "${ctx.update.message.text}" in ${ctx.session.__scenes.current}`
            );
            ctx.session.player.lastScene = ctx.session.__scenes.current;
            enterScene(ctx, "oopsScene", state);
        }
    });
});

module.exports = dailyOutroScene;
