import debug0 from "debug";
import { tick } from "../tick";
import stateManager from "../stateManager";

const debug = debug0("bot:middleware:tick");

const TICK_INTERVAL = parseInt(process.env.TICK_INTERVAL) || 1000;

class TickMiddleware {
    constructor() {
        this.startTick();
    }
    tick() {
        let state = stateManager.getState();
        state = tick(state);
        return stateManager.setState(state);
    }

    startTick() {
        return stateManager.getStateFromDb().then(state => {
            this.timerID = setInterval(() => this.tick(), TICK_INTERVAL);
        });
    }

    middleware() {
        return (ctx, next) => {
            return stateManager.getStateFromDb().then(state => {
                Object.defineProperty(ctx, "state", {
                    get: () => stateManager.getState(),
                    set: newValue => {
                        stateManager.setState(newValue);
                    }
                });
                return next().then(state => {
                    stateManager.sync();
                });
            });
        };
    }
}

export default TickMiddleware;
