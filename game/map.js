import _ from "lodash";
import { getServerSizeFromFloor, isNeedFog } from "./util";
import { getPlayer, setModule } from "./helpers/ctx";

export function addPlayerToFloor(state, params) {
    let player = state.player || {};
    let { floor } = params;
    params = { ...params, x: player.coordinates.xPos, y: player.coordinates.yPos };
    let { xPos, yPos } = player.personalCoordinates;
    let serverSize = getServerSizeFromFloor(floor);
    for (let x = 0; x < serverSize; x++) {
        for (let y = 0; y < serverSize; y++) {
            let module;
            if (floor === "4x4" || floor.match(/quest/gi) !== null) {
                module = player.server[x][y];
            } else if (floor.match(/tech/gi) !== null) {
                module = player.basement.server[x][y];
            }
            state = setModule(state, { ...module }, { ...params, x: x + xPos, y: y + yPos });
        }
    }
    return state;
}

export const createFogOfWar = (state, params) => {
    let player = getPlayer(state, params);
    let map = state.map;
    let floor = player.currentFloor;
    let access = state.access;
    // TODO we changes global map for one user?
    for (let x = 1; x < map[floor].length - 1; x++) {
        for (let y = 1; y < map[floor][x].length - 1; y++) {
            if (floor === "4x4") {
                if (!_.get(access, `[${floor}][${player.id}][${x}][${y}]`)) {
                    map[floor][x][y].isVisible = !isNeedFog(state, { floor, x, y });
                }
            } else if (floor === "4x4_tech" || _.includes(floor, "fight")) {
                map[floor][x][y].isVisible = !isNeedFog(state, { floor, x, y });
            }
        }
    }
    return state;
};
