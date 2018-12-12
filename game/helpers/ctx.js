import _ from "lodash";
import stateManager from "../stateManager";
import { errorHandler } from "./loggers";

let debug = require("debug")("bot:ctx-helpers");

export let stateWrapper = async (ctx, fn) => {
    let state = stateManager.getState({ playerId: _.get(ctx, "from.id") });
    try {
        await fn.call(this, ctx, state);
        return stateManager.sync();
        //return fn.call(this, ctx, state).catch(e => errorHandler(e, ctx, state));
    } catch (e) {
        errorHandler(e, ctx, state);
    }
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
export let getCurrentScene = ctx => _.get(ctx, "session.__scenes.current");
