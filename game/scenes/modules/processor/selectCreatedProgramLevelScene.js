import Scene from "telegraf/scenes/base";
import { keyboard } from "../../../helpers/TelegramApiHelpers";
import { stateWrapper, translate } from "../../../helpers/ctx";
import { enterScene, redirectToOopsScene } from "../../../helpers/TelegramApiHelpers";

const selectCreatedProgramLevelScene = new Scene("selectCreatedProgramLevelScene");

selectCreatedProgramLevelScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let message = translate(state, "texts.modulesScenes.selectCreatedProgramLevelScene.selectProgramLevel");
        let buttons = [];
        for (let level = 1; level <= player.level; level++) {
            if (level <= 9) {
                buttons.push([`${level} ${translate(state, "texts.versusScenes.selectAttackProgramScene.levelOfProgram")}`]);
            }
        }
        buttons.push([translate(state, "texts.back")]);
        return keyboard(message, buttons, { playerId: state.player.id });
    })
);

selectCreatedProgramLevelScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        let split = text.split(" ");
        if (text === translate(state, "texts.back")) {
            enterScene(ctx, "mainScene", state);
        } else if (
            _.isNumber(parseInt(split[0])) &&
            split[1] === translate(state, "texts.versusScenes.selectAttackProgramScene.levelOfProgram") &&
            split[0] <= 9
        ) {
            let player = state.player;
            let coordinates = player.coordinates;
            let processor = map[player.currentFloor][coordinates.xPos][coordinates.yPos];
            processor.programToCreate.level = split[0];
            enterScene(ctx, "createProgramScene", state);
        } else {
            redirectToOopsScene(ctx);
        }
    })
);

module.exports = selectCreatedProgramLevelScene;
