import Scene from "telegraf/scenes/base";
import { assembleServerToInventory } from "../../../util";
import { stateWrapper } from "../../../helpers/ctx";
import { enterScene } from "../../../helpers/TelegramApiHelpers";

const finalFightQuestIntro = new Scene("finalFightQuestIntro");

finalFightQuestIntro.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        assembleServerToInventory(state, { ctx });
        enterScene(ctx, "finalFightQuest", state);
    })
);

module.exports = finalFightQuestIntro;
