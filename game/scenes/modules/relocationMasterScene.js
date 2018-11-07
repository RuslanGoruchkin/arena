import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { assembleServerToInventory, defineStartCoordinates, grantAccess } from "../../util";
import { gameModules } from "../../gameModules";
import { stateWrapper, translate } from "../../helpers/ctx";
import * as uniqid from "uniqid";
import { enterScene, keyboard } from "../../helpers/TelegramApiHelpers";

const relocationMasterScene = new Scene("relocationMasterScene");

relocationMasterScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let playerCurrentFloor = player.currentFloor;
        let floor = parseInt(playerCurrentFloor.match(/(.*)x/)[1]);
        let price = Math.pow(floor, 3) * 10;
        let message;
        let options = [];
        if (player.personalCoordinates.floor === playerCurrentFloor) {
            message = translate(state, "texts.modulesScenes.relocationMasterScene.cost", { price: price });
            options.push(translate(state, "texts.modulesScenes.relocationMasterScene.relocateOnThisFloor"));
        } else {
            message = translate(state, "texts.modulesScenes.relocationMasterScene.cost", { price: price });
            options.push(
                translate(state, "texts.modulesScenes.relocationMasterScene.relocate", {
                    numberOfFloor: playerCurrentFloor.match(/(.*)x/)[1]
                })
            );
        }
        options.push(translate(state, "texts.back"));
        return keyboard(message, [options], { playerId: state.player.id });
    })
);

relocationMasterScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        let player = state.player;
        if (text === translate(state, "texts.back")) {
            enterScene(ctx, "mainScene", state);
        } else if (
            text === translate(state, "texts.modulesScenes.relocationMasterScene.relocateOnThisFloor") ||
            text ===
                translate(state, "texts.modulesScenes.relocationMasterScene.relocate", {
                    numberOfFloor: player.currentFloor.match(/(.*)x/)[1]
                })
        ) {
            let numberOfFloor = parseInt(player.personalCoordinates.floor.match(/(.*)x/)[1]);
            let price = Math.pow(numberOfFloor, 4) * 10;
            if (player.data.coins - price > 0) {
                assembleServerToInventory(state, { ctx });
                if (
                    text ===
                    translate(state, "texts.modulesScenes.relocationMasterScene.relocate", {
                        numberOfFloor: player.currentFloor.match(/(.*)x/)[1]
                    })
                ) {
                    numberOfFloor++;
                }
                player.personalCoordinates = defineStartCoordinates(ctx, player.id, numberOfFloor);
                player.personalCoordinates.floor = `${numberOfFloor}x${numberOfFloor}`;
                player.coordinates = { xPos: player.personalCoordinates.xPos, yPos: player.personalCoordinates.yPos };
                let personalCoordinates = player.personalCoordinates;
                for (let x = personalCoordinates.xPos; x < personalCoordinates.xPos + numberOfFloor; x++) {
                    for (let y = personalCoordinates.yPos; y < personalCoordinates.yPos + numberOfFloor; y++) {
                        map[personalCoordinates.floor][x][y] = _.cloneDeep(gameModules.availableSpace);
                    }
                }
                state = grantAccess(state, { floor: `${numberOfFloor}x${numberOfFloor}`, playerId: player.id, ...player.coordinates });
                state = grantAccess(
                    `${numberOfFloor}x${numberOfFloor}_tech`,
                    uniqid(`basement-${player.id}`),
                    ...player.personalCoordinates
                );
                player.data.coins -= price;
                enterScene(ctx, "mainScene", state);
            } else {
                enterScene(ctx, "relocationMasterScene", state);
                return keyboard(
                    translate(state, "texts.modulesScenes.relocationMasterScene.notEnoughFunds"),
                    [[translate(state, "texts.back")]],
                    params
                );
            }
        }
    })
);

module.exports = relocationMasterScene;
