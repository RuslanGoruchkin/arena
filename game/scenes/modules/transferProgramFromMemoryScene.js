import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { keyboard } from "../../helpers/TelegramApiHelpers";
import { stateWrapper, translate } from "../../helpers/ctx";
import { enterScene } from "../../helpers/TelegramApiHelpers";

const transferProgramFromMemoryScene = new Scene("transferProgramFromMemoryScene");

transferProgramFromMemoryScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let coordinates = player.coordinates;
        let storage = map[player.currentFloor][coordinates.xPos][coordinates.yPos];
        let message = translate(state, "texts.selectAction");
        let buttons = [];
        if (_.isEmpty(storage.programs)) {
            message = translate(state, "texts.modulesScenes.transferProgramFromStorageScene.emptyStorage");
        } else {
            if (_.isEmpty(player.data.programsInMemory)) {
                message = translate(state, "texts.modulesScenes.transferProgramFromMemoryScene.selectProgramForTransfer");
            } else {
                message = translate(state, "texts.modulesScenes.transferProgramFromMemoryScene.selectProgramForTransferFromMemory", {
                    programs: storage.programs.length
                });
            }
            _.each(storage.programs, program => {
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

transferProgramFromMemoryScene.on("text", ctx =>
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
            let program = _.find(storage.programs, storageProgram => {
                return translate(state, `texts.${storageProgram.key}`) === splitted[0] && storageProgram.level === parseInt(splitted[1]);
            });
            let element = _.indexOf(storage.programs, program);
            if (~element) {
                storage.programs.splice(element, 1);
                data.programsInMemory.push(program);
                enterScene(ctx, "transferProgramFromMemoryScene", state);
            }
        }
    })
);

module.exports = transferProgramFromMemoryScene;
