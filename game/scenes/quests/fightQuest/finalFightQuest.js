import Scene from "telegraf/scenes/base";
import { createQuestFromTemplate } from "../../../util";
import { programs } from "../../../resources/programs";
import { stateWrapper, translate } from "../../../helpers/ctx";
import { finalFightQuestTemplate } from "../../../resources/templates/finalFightQuestTemplate";
import { enterScene, keyboard, redirectToOopsScene } from "../../../helpers/TelegramApiHelpers";

const finalFightQuest = new Scene("finalFightQuest");

finalFightQuest.enter(ctx => {
    let state = { ...ctx.state };
    return keyboard(translate(state, "texts.rooms.fightQuest.finalFightQuest"), [[translate(state, "texts.go")]], {
        playerId: state.player.id
    });
});

finalFightQuest.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        switch (ctx.update.message.text) {
            case translate(state, "texts.go"):
                player.currentFloor = "fight";
                let data = player.data;
                data.programsInMemory = [programs.hack, programs.hack, programs.hack, programs.scan, programs.scan, programs.scan];
                ctx.session.alreadyStolen = false;
                createQuestFromTemplate(state, { questTemplate: finalFightQuestTemplate, fog: false, coins: 500 });
                enterScene(ctx, "mainScene", state);
                break;
            default:
                redirectToOopsScene(ctx);
                break;
        }
    })
);

module.exports = finalFightQuest;
