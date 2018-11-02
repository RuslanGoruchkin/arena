import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { keyboard } from "../../../helpers/TelegramApiHelpers";
import { stateWrapper, translate } from "../../../helpers/ctx";
import { enterScene, redirectToOopsScene } from "../../../helpers/TelegramApiHelpers";

const storageDefeatedActionScene = new Scene("storageDefeatedActionScene");

storageDefeatedActionScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let coordinates = player.coordinates;
        let storage = map[player.currentFloor][coordinates.xPos][coordinates.yPos];
        let options = [];
        let message = "";
        if (storage.programs.length === 0) {
            message = translate(state, "texts.versusScenes.storageDefeatedActionScene.emptyStorage");
        } else {
            _.each(storage.programs, program => {
                options.push(`${program.name} ${program.level} level`);
            });
            message = translate(state, "texts.versusScenes.storageDefeatedActionScene.canSteal");
        }
        options.push(translate(state, "texts.back"));
        return keyboard(message, [options], { playerId: state.player.id });
    })
);

storageDefeatedActionScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let data = player.data;
        let text = ctx.update.message.text;
        if (text === translate(state, "texts.back")) {
            enterScene(ctx, "mainScene", state);
        } else {
            let split = text.split(" ");
            let coordinates = player.coordinates;
            let module = map[player.currentFloor][coordinates.xPos][coordinates.yPos];
            let program = _.find(module.programs, programInMemory => {
                return programInMemory.name === split[0] && programInMemory.level === parseInt(split[1]);
            });
            let element = _.indexOf(module.programs, program);
            if (~element) {
                module.programs.splice(element, 1);
                data.programsInMemory.push(program);
                enterScene(ctx, "storageDefeatedActionScene", state);
            } else {
                redirectToOopsScene(ctx);
            }
        }
    })
);

module.exports = storageDefeatedActionScene;
