import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { keyboard } from "../../helpers/TelegramApiHelpers";
import { stateWrapper, translate } from "../../helpers/ctx";
import { enterScene, redirectToOopsScene } from "../../helpers/TelegramApiHelpers";

const elevatorModuleScene = new Scene("elevatorModuleScene");

elevatorModuleScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let currentFloor = state.player.currentFloor;
        let numberOfFloor = parseInt(currentFloor.match(/(.*)x/)[1]);
        if (numberOfFloor === 4) {
            return keyboard(
                translate(state, "texts.modulesScenes.elevatorModuleScene.selectFloor"),
                [
                    [translate(state, "texts.modulesScenes.elevatorModuleScene.upAction", { numberOfFloor: numberOfFloor + 1 })],
                    [translate(state, "texts.back")]
                ],
                { playerId: state.player.id }
            );
        } else if (numberOfFloor === 12) {
            return keyboard(
                translate(state, "texts.modulesScenes.elevatorModuleScene.selectFloor"),
                [
                    [translate(state, "texts.modulesScenes.elevatorModuleScene.downAction", { numberOfFloor: numberOfFloor - 1 })],
                    [translate(state, "texts.back")]
                ],
                { playerId: state.player.id }
            );
        } else {
            return keyboard(
                translate(state, "texts.modulesScenes.elevatorModuleScene.selectFloor"),
                [
                    [
                        translate(state, "texts.modulesScenes.elevatorModuleScene.downAction", { numberOfFloor: numberOfFloor - 1 }),
                        translate(state, "texts.modulesScenes.elevatorModuleScene.upAction", { numberOfFloor: numberOfFloor + 1 })
                    ],
                    [translate(state, "texts.back")]
                ],
                { playerId: state.player.id }
            );
        }
    })
);

elevatorModuleScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        let floor = text.substr(text.length - 2, text.length - 1);
        let numberOfFloor = parseInt(floor);
        if (text === translate(state, "texts.back")) {
            enterScene(ctx, "mainScene", state);
        } else if (_.isNumber(numberOfFloor)) {
            let player = state.player;
            player.currentFloor = `${numberOfFloor}x${numberOfFloor}`;

            player.coordinates = {
                xPos: (numberOfFloor + 1) * 2 + 2,
                yPos: numberOfFloor
            };
            enterScene(ctx, "mainScene", state);
        } else {
            redirectToOopsScene(ctx);
        }
    })
);

module.exports = elevatorModuleScene;
