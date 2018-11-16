import _ from "lodash";
import { gameModules } from "./gameModules";

const COUNT_OF_PLAYERS_BY_WIDTH = process.env.COUNT_OF_PLAYERS_BY_WIDTH;
const COUNT_OF_PLAYERS_BY_HEIGHT = process.env.COUNT_OF_PLAYERS_BY_HEIGHT;

let HUB_MODULES = [gameModules.relocationMaster, gameModules.moduleVendor, gameModules.programVendor, gameModules.elevator];

let generateTechFloorModule = (x, size, y) =>
    x % (size + 1) === 0 && y % (size + 1) === 0
        ? gameModules.stairs
        : x % (size + 1) === 0 || y % (size + 1) === 0
            ? gameModules.way
            : gameModules.space;

/*let generateQuestFloorModule = (x, size, y) =>
    x % ((size + 1) * 4) === (size + 1) * 2 + 1 && y % ((size + 1) * 4) === size
        ? gameModules.moduleVendor
        : x % ((size + 1) * 4) === (size + 1) * 2 + 1 && y % ((size + 1) * 4) === size - 1
            ? gameModules.programVendor
            : x % ((size + 1) * 4) === (size + 1) * 2 + 2 && y % ((size + 1) * 4) === size
                ? gameModules.elevator
                : x % ((size + 1) * 4) === (size + 1) * 2 + 2 && y % ((size + 1) * 4) === size - 1
                    ? gameModules.relocationMaster
                    : x % (size + 1) === 0 && y % (size + 1) === 0
                        ? gameModules.sewerHatch
                        : x % (size + 1) === 0 || y % (size + 1) === 0
                            ? gameModules.way
                            : gameModules.space;*/

let generateDefaultFloorModule = (x, size, y) =>
    x % ((size + 1) * 4) === (size + 1) * 2 + 1 && y % ((size + 1) * 4) === size
        ? gameModules.moduleVendor
        : x % (size + 1) === 0 || y % (size + 1) === 0
            ? gameModules.way
            : gameModules.space;

export function createFloor(floor, serverSize, isAccessAddToMapItem = false) {
    let mapItems = [];
    let accessItems = [];
    for (let x = 0; x < COUNT_OF_PLAYERS_BY_WIDTH * (serverSize + 1) + 1; x++) {
        for (let y = 0; y < COUNT_OF_PLAYERS_BY_HEIGHT * (serverSize + 1) + 1; y++) {
            let module = {};
            if (_.includes(floor, "tech")) {
                module = generateTechFloorModule(x, serverSize, y);
            } else {
                module = generateDefaultFloorModule(x, serverSize, y);
            }
            let accessItem = generateAccessItem({
                module,
                mapItemId: `${floor}--${x}--${y}`
            });
            let newMapItem = {
                id: `${floor}--${x}--${y}`,
                x,
                y,
                floor,
                data: JSON.stringify(module)
            };
            if (accessItem) {
                accessItems.push(accessItem);
                if (isAccessAddToMapItem) {
                    newMapItem["accesses.owner"] = accessItem.owner;
                    newMapItem["accesses.mapItemId"] = accessItem.mapItemId;
                }
            }
            mapItems.push(newMapItem);
        }
    }
    return { mapItems, accessItems };
}

function generateAccessItem({ module, mapItemId }) {
    if (!_.some(HUB_MODULES, module)) {
        return false;
    }
    return {
        mapItemId,
        owner: "hub"
    };
}
