import _ from "lodash";
import { gameModules } from "./gameModules";

let server = {};

let rows = 4,
    cols = 4;

const initServer = characterServer => {
    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
            server[x][y] = _.cloneDeep(characterServer[x][y]);
        }
    }
};

export const createServerFromTemplate = characterServer => {
    server = Array.from({ length: rows }, () => Array.from({ length: cols }, () => gameModules.availableSpace));
    initServer(characterServer);
    return server;
};

export const createServerFromInventory = inventory => {
    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
            server[x][y] = _.cloneDeep(inventory[4 * x + y]);
        }
    }
    return server;
};
