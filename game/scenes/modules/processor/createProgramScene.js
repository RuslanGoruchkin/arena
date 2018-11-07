import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { calculateProgramCount } from "../../../util";
import { programs } from "../../../resources/programs";
import { characters } from "../../../resources/characters";
import { getModule, setModule, stateWrapper, translate } from "../../../helpers/ctx";
import stateManager from "../../../stateManager";
import { enterScene, keyboard, redirectToOopsScene, replyWithMarkdown } from "../../../helpers/TelegramApiHelpers";

const createProgramScene = new Scene("createProgramScene");

createProgramScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let coordinates = player.coordinates;
        let processor = getModule(state, { floor: player.currentFloor, x: coordinates.xPos, y: coordinates.yPos });
        let data = player.data;
        let message;
        //if (player.data.isOrderPaid) {
        if (processor.completeProgram || processor.programToCreate) {
            if (!processor.finishTick) {
                setTimeout(
                    () =>
                        keyboard(
                            translate(state, "texts.modulesScenes.createProgramScene.waitTime", {
                                time: processor.finishTick - state.currentTick + 1
                            }),
                            [[translate(state, "texts.back")]],
                            { playerId: state.player.id }
                        ),
                    data.gameSpeed / data.gameSpeedMultiplier
                );
            } else {
                let buttons = [];
                if (processor.complete) {
                    message = translate(state, "texts.modulesScenes.createProgramScene.programComplete", {
                        name: translate(state, `texts.${processor.completeProgram.key}`)
                    });
                    buttons.push(translate(state, "texts.modulesScenes.createProgramScene.pickUp"));
                } else {
                    message = translate(state, "texts.modulesScenes.createProgramScene.waitTime", {
                        time: processor.finishTick - state.currentTick + 1
                    });
                }
                buttons.push(translate(state, "texts.back"));
                return keyboard(message, [buttons], { playerId: state.player.id });
            }
        } else {
            message = translate(state, "texts.modulesScenes.createProgramScene.selectTypeProgram");
            let buttons = [[translate(state, `texts.hack`), translate(state, "texts.scan")]];
            if (player.selectedCharacter !== characters.defaultCharacter) {
                buttons.push([translate(state, `texts.${player.selectedCharacter.specialProgram.key}`)]);
            }
            buttons.push([translate(state, "texts.back")]);
            return keyboard(message, buttons, { playerId: state.player.id });
        }
        /*} else {
        message = translate(state, 'texts.modulesScenes.processorModuleScene.payForElectricity');
        enterScene(ctx, 'mainScene');
        return keyboard(message, [[translate(state, 'texts.modulesScenes.manageModuleScene.placeModuleToInventory')], [translate(state, 'texts.back')]]);
    }*/
    })
);

createProgramScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let data = player.data;
        let coordinates = player.coordinates;
        let processor = getModule(state, { floor: player.currentFloor, x: coordinates.xPos, y: coordinates.yPos });
        let text = ctx.update.message.text;
        switch (text) {
            // case translate(state,`texts.virus`): {
            //     processor.programToCreate = programs.virus;
            //     enterScene(ctx, 'createProgramScene');
            //     break;
            // }
            case translate(state, `texts.scan`):
                processor.programToCreate = programs.scan;
                enterScene(ctx, "selectCreatedProgramLevelScene", state);
                break;
            case translate(state, `texts.hack`):
                processor.programToCreate = programs.hack;
                enterScene(ctx, "selectCreatedProgramLevelScene", state);
                break;
            case translate(state, "texts.modulesScenes.createProgramScene.pickUp"):
                if (data.programsInMemory.length < calculateProgramCount(player.selectedCharacter.memory)) {
                    data.programsInMemory.push(processor.completeProgram);
                    processor.completeProgram = undefined;
                    processor.finishTick = undefined;
                    processor.complete = false;
                    enterScene(ctx, "mainScene", state);
                } else {
                    let memoryOverflowText = translate(state, "texts.modulesScenes.createProgramScene.memoryOverflow");
                    replyWithMarkdown(memoryOverflowText, { playerId: state.player.id }).then(enterScene(ctx, "mainScene", state));
                }
                break;
            case translate(state, "texts.back"):
                enterScene(ctx, "mainScene", state);
                break;
            default:
                if (player.selectedCharacter !== characters.defaultCharacter) {
                    if (text === translate(state, `texts.${player.selectedCharacter.specialProgram.key}`)) {
                        processor.programToCreate = _.find(programs, program => {
                            return translate(state, `texts.${program.key}`) === text;
                        });
                        enterScene(ctx, "createProgramScene", state);
                    }
                } else {
                    redirectToOopsScene(ctx);
                }
                break;
        }
        state = setModule(state, processor, { floor: player.currentFloor, x: coordinates.xPos, y: coordinates.yPos });
        stateManager.setState(state);
    })
);

module.exports = createProgramScene;
