import { errorHandler, redirectToOopsScene } from "../helpers";
import stateManager from "../stateManager";
import { tick } from "../tick";

const TICK_INTERVAL = parseInt(process.env.TICK_INTERVAL) || 1000;

class TickMiddleware {
    constructor() {
        this.startTick();
    }
    tick() {
        let state = stateManager.getState();
        tick(state);
        return stateManager.sync();
    }

    startTick() {
        return stateManager.getStateFromDb().then(state => {
            return (this.timerID = setInterval(() => this.tick(), TICK_INTERVAL));
        });
    }

    middleware() {
        return async (ctx, next) => {
            try {
                await stateManager.getStateFromDb();
                await next();
            } catch (e) {
                errorHandler(e);
            }
        };
    }
}

export default TickMiddleware;
