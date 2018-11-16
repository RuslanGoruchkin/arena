import _ from "lodash";
import stateManager from "../stateManager";
import yaml from "js-yaml";
import fs from "fs";

const path = require("path");
let debug = require("debug")("bot:ctx-helpers");
export let getPlayer = (state, params) => _.get(state, `players.${params.playerId}`);

export let stateWrapper = (ctx, fn) => {
    let state = stateManager.getState({ playerId: _.get(ctx, "from.id") });
    return fn.call(this, ctx, state).then(() => {
        return stateManager.sync();
    });
};
export let generateUpdateFromState = (state, params) => ({
    update: {
        fake_update: true,
        update_id: state.currentTick,
        message: {
            message_id: state.currentTick,
            from: {
                id: params.playerId
            },
            chat: {
                id: params.playerId
            },
            text: "Actions",
            date: Date.now()
        }
    }
});
export let getPlayerState = (state, params) => _.get(getPlayer(state, params), "data");
export let getCurrentScene = ctx => _.get(ctx, "session.__scenes.current");
export let getCurrentFloorName = (state, params) => _.get(getPlayer(state, params), "currentFloor");
export let getCurrentFloor = (state, params) => _.get(state, getCurrentFloorName(state, params));
export let isPlayerHaveAccess = (state, params) => {
    let { floor, x, y, playerId } = params;
    floor = floor || getCurrentFloorName(state, params);
    return _.get(state.access, `${floor}.${playerId}[${x}][${y}]`);
};
export let getPlayerCoordinates = (state, params) => _.get(getPlayer(state, params), "coordinates");
export let getPlayerX = (state, params) => _.get(getPlayerCoordinates(state, params), "x");
export let getPlayerY = (state, params) => _.get(getPlayerCoordinates(state, params), "y");
export let getQuest = quest => _.omit(quest, ["goal", "fail"]);
export let getModule = (state, params = { x: null, y: null, floor: null }) => {
    let { x, y, floor } = params;
    // x = x || getPlayerX(ctx);
    // y = y || getPlayerY(ctx);
    // floor = floor || getCurrentFloorName(ctx);
    return _.get(state.map, `[${floor}][${x}][${y}]`) || {};
};
export let setModule = (state, module, params = { x: null, y: null, floor: null }) => {
    let { x, y, floor } = params;
    x = x || getPlayerX(state);
    y = y || getPlayerY(state);
    floor = floor || getCurrentFloorName(state);
    let oldModule = { ...getModule(state, { x, y, floor }) };
    if (_.isEqual(oldModule, module)) return state;
    state.map[floor][x][y] = module;
    return state;
};

function replaceStrings(inputString, options) {
    if (options) {
        _.forEach(options, function(value, key) {
            inputString = inputString.split("${" + key + "}").join(value);
        });
    }
    return inputString;
}

export let t = (state, yml_path, options) => {
    let resultString = "";
    try {
        let lang = _.get(state, "language") || "en";
        let filename = path.resolve(__dirname, `../resources/locales/${lang}.yaml`);
        let doc = fs.readFileSync(filename, "utf8");
        let result = yaml.safeLoad(doc);
        resultString = replaceStrings(eval("result." + yml_path), options);
    } catch (e) {
        debug(e);
    }
    return resultString;
};
