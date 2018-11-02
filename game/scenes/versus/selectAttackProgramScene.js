import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { keyboard } from "../../helpers/TelegramApiHelpers";
import { programs } from "../../resources/programs";
import { gameModules } from "../../gameModules";
import { getModule, stateWrapper, translate } from "../../helpers/ctx";
import { enterScene } from "../../helpers/TelegramApiHelpers";

const selectAttackProgramScene = new Scene("selectAttackProgramScene");

selectAttackProgramScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let data = player.data;
        let params = { ctx, playerId: player.id, floor: player.currentFloor, x: player.coordinates.xPos, y: player.coordinates.yPos };
        if (_.isEmpty(data.programsInMemory)) {
            let message = translate(state, "texts.versusScenes.selectAttackProgramScene.emptyMemory");
            return keyboard(message, [[translate(state, "texts.back")]], params);
        } else {
            let message = translate(state, "texts.versusScenes.selectAttackProgramScene.selectProgram");
            let options = [];
            _.filter(data.programsInMemory, program => {
                //TODO: delete newItem, follow storageModuleScene
                let newItem = [];
                let description;
                if (program.name === programs.scan.name) {
                    let potential = program.level + player.selectedCharacter.logic;
                    description = `${program.name} ${program.level} ${translate(
                        state,
                        "texts.versusScenes.selectAttackProgramScene.levelOfProgram"
                    )} (${potential} ${translate(state, "texts.versusScenes.selectAttackProgramScene.countOfModules")})`;
                } else {
                    let xPos = player.coordinates.xPos;
                    let yPos = player.coordinates.yPos;
                    let attack = data.baseHack + (program.level - 1) * 10 + player.selectedCharacter.processing * 10;
                    let currentModule = getModule(state, params);
                    let defence = _.get(currentModule, "defence");
                    let multiplier = 0;
                    for (let x = xPos - 1; x < xPos + 2; x++) {
                        for (let y = yPos - 1; y < yPos + 2; y++) {
                            let areaModule = getModule(state, { ...params, x, y });
                            if (
                                (x === xPos && y === yPos) ||
                                areaModule.character === gameModules.space.character ||
                                areaModule.character === gameModules.denied.character
                            ) {
                                continue;
                            }
                            if (!areaModule.isBroken) {
                                multiplier += 12.5;
                            }
                        }
                    }
                    defence *= multiplier / 100;
                    let chance = (attack / (attack + defence)) * 100;
                    description = `${translate(state, `texts.${program.key}`)} ${program.level} ${translate(
                        state,
                        "texts.versusScenes.selectAttackProgramScene.levelOfProgram"
                    )} (${chance.toFixed(2)}% ${translate(state, "texts.versusScenes.selectAttackProgramScene.success")})`;
                }
                newItem.push(description);
                options.push(newItem);
            });
            options.push([translate(state, "texts.back")]);
            return keyboard(message, options, params);
        }
    })
);

selectAttackProgramScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let text = ctx.update.message.text;
        if (text === translate(state, "texts.back")) {
            enterScene(ctx, "mainScene", state);
        } else {
            let split = text.split(" ");
            player.attackProgram = _.find(player.data.programsInMemory, program => {
                return translate(state, `texts.${program.key}`) === split[0] && parseInt(program.level) === parseInt(split[1]);
            });
            enterScene(ctx, "attackScene", state);
        }
    })
);

module.exports = selectAttackProgramScene;
