import Scene from "telegraf/scenes/base";
import { setupStartQuest } from "../../../util";
import { createServerFromTemplate } from "../../../server";
import { stateWrapper, translate } from "../../../helpers/ctx";
import { enterScene, keyboard, redirectToOopsScene } from "../../../helpers/TelegramApiHelpers";

const buyProcessorQuestIntro = new Scene("buyProcessorQuestIntro");

buyProcessorQuestIntro.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let data = player.data;

        player.personalCoordinates.floor = player.currentFloor;
        player.currentQuest.introPlayed = true;
        data.programsInMemory = [];
        player.server = createServerFromTemplate(ctx.session.startServer);
        setupStartQuest(state, { ctx, playerId: player.id });
        return keyboard(translate(state, `texts.quests.${player.currentQuest.name}.intro`), [[translate(state, "texts.ok")]], {
            playerId: state.player.id
        });
    })
);

buyProcessorQuestIntro.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        if (ctx.update.message.text === translate(state, "texts.ok") || ctx.update.message.text === translate(state, "texts.accept")) {
            enterScene(ctx, "mainScene", state);
        } else {
            redirectToOopsScene(ctx);
        }
    })
);

module.exports = buyProcessorQuestIntro;
