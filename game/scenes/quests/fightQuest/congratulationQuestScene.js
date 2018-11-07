import Scene from "telegraf/scenes/base";
import { keyboard } from "../../../helpers/TelegramApiHelpers";
import { stateWrapper, translate } from "../../../helpers/ctx";
import { enterScene, redirectToOopsScene, replyWithMarkdown } from "../../../helpers/TelegramApiHelpers";

const congratulationQuestScene = new Scene("congratulationQuestScene");

congratulationQuestScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        return keyboard(
            translate(state, "texts.quests.fightQuest.congratulationQuestScene.regard"),
            [[translate(state, "texts.yes")], [translate(state, "texts.no")]],
            { playerId: state.player.id }
        );
    })
);

congratulationQuestScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        player.currentQuest = undefined;
        switch (ctx.update.message.text) {
            case translate(state, "texts.yes"):
                player.corporation = "L-Ri";
                break;
            case translate(state, "texts.no"):
                player.corporation = "Resistance";
                break;
            default:
                redirectToOopsScene(ctx);
                break;
        }
        let newMemberText = translate(state, "texts.quests.fightQuest.confirmQuestScene.newMember", { corporation: player.corporation });
        let selectCharacterText = translate(state, "texts.quests.fightQuest.confirmQuestScene.selectCharacter");
        replyWithMarkdown(newMemberText, { playerId: state.player.id })
            .then(replyWithMarkdown(selectCharacterText, { playerId: state.player.id }))
            .then(enterScene(ctx, "selectCharacterScene", state));
    })
);

module.exports = congratulationQuestScene;
