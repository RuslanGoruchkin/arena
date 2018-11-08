import Scene from "telegraf/scenes/base";
import { keyboard } from "../../../helpers/TelegramApiHelpers";
import { quests } from "../../../resources/quests";
import { stateWrapper, translate } from "../../../helpers/ctx";
import { enterScene } from "../../../helpers/TelegramApiHelpers";

const offenseQuestScene = new Scene("offenseQuestScene");

offenseQuestScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        return keyboard(translate(state, "texts.rooms.offenceQuest"), [[translate(state, "texts.ok")]], { playerId: state.player.id });
    })
);

offenseQuestScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        switch (ctx.update.message.text) {
            case translate(state, "texts.ok"):
                player.currentQuest = quests.hackSomething;
                player.data.antivirusQuest = true;
                enterScene(ctx, "mainScene", state);
                break;
            default:
        }
    })
);

module.exports = offenseQuestScene;
