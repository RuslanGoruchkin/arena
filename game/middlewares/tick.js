import { tick } from "../tick";
import stateManager from "../stateManager";

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
        return (ctx, next) => {

            return stateManager.getStateFromDb().then(state => {
                return next();
            });
        };
    }
}

export default TickMiddleware;
