import Scene from "telegraf/scenes/base";
import { createServerFromInventory } from "../../../server";
import { enterScene } from "../../../helpers/TelegramApiHelpers";
import { stateWrapper, translate } from "../../../helpers/ctx";
import { replyWithMarkdown } from "../../../helpers/TelegramApiHelpers";

const finalFightQuestOutro = new Scene("finalFightQuestOutro");

finalFightQuestOutro.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let data = player.data;
        createServerFromInventory(data.inventory);
        data.programsInMemory = [];
        data.coins += 450;
        let endingText = translate(state, "texts.rooms.fightQuest.ending");
        let andNowWeRunText = translate(state, "texts.rooms.fightQuest.andNowWeRun");
        replyWithMarkdown(endingText, { playerId: state.player.id });
        replyWithMarkdown(andNowWeRunText, { playerId: state.player.id });
        enterScene(ctx, "congratulationQuestScene", state);
    })
);

module.exports = finalFightQuestOutro;
