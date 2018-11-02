import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { keyboard } from "../../../helpers/TelegramApiHelpers";
import { stateWrapper, translate } from "../../../helpers/ctx";
import { enterScene, redirectToOopsScene, replyWithMarkdown } from "../../../helpers/TelegramApiHelpers";

const confirmQuestScene = new Scene("confirmQuestScene");

confirmQuestScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        return keyboard(
            translate(state, "texts.quests.fightQuest.confirmQuestScene.leaveQuest"),
            [[translate(state, "texts.yes")], [translate(state, "texts.no")]],
            { playerId: state.player.id }
        );
    })
);

confirmQuestScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let data = player.data;
        switch (ctx.update.message.text) {
            case translate(state, "texts.yes"):
                let program = _.find(data.programsInMemory, programInMemory => {
                    return programInMemory.level === 100;
                });
                if (program) {
                    let element = _.indexOf(data.programsInMemory, program);
                    data.programsInMemory.splice(element, 1);
                    enterScene(ctx, "congratulationQuestScene", state);
                } else {
                    state.corporation = "Resistance";
                    let newMemberText = translate(state, "texts.quests.fightQuest.confirmQuestScene.newMember", {
                        corporation: player.corporation
                    });
                    let selectCharacterText = translate(state, "texts.quests.fightQuest.confirmQuestScene.selectCharacter");
                    replyWithMarkdown(newMemberText, { playerId: state.player.id })
                        .then(replyWithMarkdown(selectCharacterText, { playerId: state.player.id }))
                        .then(enterScene(ctx, "selectCharacterScene", state));
                }
                break;
            case translate(state, "texts.no"):
                enterScene(ctx, "mainScene", state);
                break;
            default:
                redirectToOopsScene(ctx);
                break;
        }
    })
);

module.exports = confirmQuestScene;
