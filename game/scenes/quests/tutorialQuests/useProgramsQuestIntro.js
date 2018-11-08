import { programs } from "../../../resources/programs";
import { createQuestFromTemplate } from "../../../util";
import Scene from "telegraf/scenes/base";
import { useProgramsQuestIntroTemplate } from "../../../resources/templates/useProgramsQuestIntroTemplate";
import { stateWrapper, translate } from "../../../helpers/ctx";
import stateManager from "../../../stateManager";
import { enterScene, replyWithMarkdown } from "../../../helpers/TelegramApiHelpers";

const useProgramsQuestIntro = new Scene("useProgramsQuestIntro");

useProgramsQuestIntro.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        player.currentFloor = "fight";
        let data = player.data;
        let params = { ctx, playerId: player.id, floor: player.currentFloor, x: player.coordinates.xPos, y: player.coordinates.yPos };
        data.programsInMemory.push(programs.cheatHack, programs.cheatHack, programs.cheatHack, programs.cheatHack);
        ctx.session.alreadyStolen = false;
        state = createQuestFromTemplate(state, { ...params, questTemplate: useProgramsQuestIntroTemplate, fog: false, coins: 100 });
        let seeWhatIFindText = translate(state, "texts.rooms.introduction.seeWhatIFind");
        replyWithMarkdown(seeWhatIFindText, { playerId: state.player.id });
        enterScene(ctx, "mainScene", state);
    })
);

module.exports = useProgramsQuestIntro;
