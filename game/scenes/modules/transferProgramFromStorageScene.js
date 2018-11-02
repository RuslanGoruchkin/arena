import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { keyboard } from "../../helpers/TelegramApiHelpers";
import { stateWrapper, translate } from "../../helpers/ctx";
import { enterScene } from "../../helpers/TelegramApiHelpers";

const transferProgramFromStorageScene = new Scene("transferProgramFromStorageScene");

transferProgramFromStorageScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let coordinates = player.coordinates;
        let storage = map[player.currentFloor][coordinates.xPos][coordinates.yPos];
        let message = translate(state, "texts.selectAction");
        let buttons = [];
        if (_.isEmpty(player.data.programsInMemory)) {
            message = translate(state, "texts.modulesScenes.transferProgramFromMemoryScene.emptyMemory");
        } else {
            if (_.isEmpty(storage.programs)) {
                message = translate(state, "texts.modulesScenes.transferProgramFromStorageScene.selectProgramForTransfer");
            } else {
                message = translate(state, "texts.modulesScenes.transferProgramFromStorageScene.selectProgramForTransferFromMemory", {
                    programs: player.data.programsInMemory.length
                });
            }
            _.each(player.data.programsInMemory, program => {
                buttons.push([
                    `${translate(state, `texts.${program.key}`)} ${program.level} ${translate(
                        state,
                        "texts.versusScenes.selectAttackProgramScene.levelOfProgram"
                    )}`
                ]);
            });
        }
        buttons.push([translate(state, "texts.back")]);
        return keyboard(message, buttons, { playerId: state.player.id });
    })
);

transferProgramFromStorageScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        if (text === translate(state, "texts.back")) {
            enterScene(ctx, "storageModuleScene", state);
        } else {
            let player = state.player;
            let coordinates = player.coordinates;
            let data = player.data;
            let split = text.split(" ");
            let splitted = [];
            splitted[0] = _.isNaN(parseInt(split[1])) ? `${split[0]} ${split[1]}` : split[0];
            splitted[1] = !_.isNaN(parseInt(split[1])) ? split[1] : split[2];
            let storage = map[player.currentFloor][coordinates.xPos][coordinates.yPos];
            let program = _.find(data.programsInMemory, programInMemory => {
                return translate(state, `texts.${programInMemory.key}`) === splitted[0] && programInMemory.level === parseInt(splitted[1]);
            });
            let element = _.indexOf(data.programsInMemory, program);
            if (~element) {
                data.programsInMemory.splice(element, 1);
                storage.programs.push(program);
                enterScene(ctx, "transferProgramFromStorageScene", state);
            }
        }
    })
);

module.exports = transferProgramFromStorageScene;
