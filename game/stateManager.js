import Promise from "bluebird";
import _ from "lodash";
import PQueue from "p-queue";
import db from "../models";
import { difference, errorHandler, getPlayer } from "./helpers";

const debug = require("debug")("bot:stateManager");
const defaultQueryOpt = {
    raw: true,
    logging: str => {
        debug(str);
    }
};
class StateManager {
    constructor() {
        this.client = db;
        this.loading = false;
        this.state = {};
        this.safePromises = [];
        this.queue = new PQueue({ concurrency: 1 });
    }
    getStateFromDb() {
        if (!this.loading && !_.isEmpty(this.state)) {
            return Promise.resolve({ ...this.state });
        }
        if (this.loading && this.loadPromise) {
            return this.loadPromise;
        }
        debug(`Load state from db`);
        this.loading = true;
        this.loadPromise = Promise.all(this.generateLoadPromise())
            .then(result => {
                debug(`State loaded succesfully `);
                return result;
            })
            .catch(errorHandler)
            .finally(() => {
                this.loading = false;
            });

        return this.loadPromise;
    }

    generateLoadPromise() {
        let promises = [];
        _.each(this.client.models, (value, key) => {
            let promise = this.loadPromiseFactory(key);
            switch (key) {
                case "player": {
                    promise
                        .then(result => {
                            this.state.players = _.keyBy(result, "id");
                            return this.state.players;
                        })
                        .catch(errorHandler);
                    break;
                }
                default: {
                    promise
                        .then(result => {
                            this.state[key] = result;
                            return result;
                        })
                        .catch(errorHandler);
                }
            }
            promises.push(promise);
        });
        return promises;
    }

    loadPromiseFactory(modelName, options = {}) {
        options = { ...defaultQueryOpt, ...options };
        if (!_.isFunction(_.get(this.client.models, `${modelName}.findAll`))) {
            return Promise.reject(`Model ${modelName} doesn't exist or don't have method 'findAll' `);
        }
        return this.client.models[modelName].findAll(options);
    }

    savePromiseFactory(modelName, dataArray, options = {}) {
        options = { ...defaultQueryOpt, ...options };
        if (!_.isFunction(_.get(this.client.models, `${modelName}.bulkCreate`))) {
            return Promise.reject(`Model ${modelName}  doesn't exist or don't have method 'bulkCreate' `);
        }
        return this.client.models[modelName].bulkCreate(dataArray, options);
    }

    getState(params) {
        let state = {
            ...this.state,
            players: _.cloneDeep(this.state.players),
            userHistory: _.cloneDeep(this.state.userHistory)
        };
        if (_.get(params, "playerId")) {
            let player = getPlayer(state, params);
            if (player) {
                state.player = player;
            }
        }
        return state;
    }

    setState(state) {
        let diff = difference(_.omit(state, ["currentTick"]), this.state);
        let player = _.get(state, "player");
        if (!_.isEmpty(diff)) {
            this.saveDiff(state, diff);
        }
        if (_.has(diff, "player") && player && player.id) {
            state = {
                ...state,
                players: {
                    ...state.players,
                    [player.id]: { ...player }
                }
            };
        }

        this.state = state;
    }

    saveDiff(state, diff) {
        _.each(diff, (value, key) => {
            switch (key) {
                case "player": {
                    let player = { ...state.player };
                    let data = _.merge({}, player, value);
                    let updateOnDuplicate = _.keys(data);
                    if (_.get(player, "id")) {
                        this.queue.add(() => this.savePromiseFactory("player", [{ id: player.id, ...data }], { updateOnDuplicate }));
                    }
                    break;
                }

                case "players": {
                    let dataArray = [];
                    let updateOnDuplicate;
                    _.each(value, (val, id) => {
                        let player = _.get(state.players, id);
                        let data = _.merge({}, player, val);
                        updateOnDuplicate = _.keys(data);
                        dataArray.push({ id, ...data });
                    });
                    this.queue.add(() => this.savePromiseFactory("player", dataArray, { updateOnDuplicate }));
                    break;
                }
                case "userHistory": {
                    let updateOnDuplicate = ["playerId", "action", "data"];
                    if (!value.playerId) {
                        break;
                    }
                    this.queue.add(() => this.savePromiseFactory("userHistory", _.compact(value), { updateOnDuplicate }));
                    break;
                }

                default: {
                    // this.queue.add(() => this.savePromiseFactory(key, [{ ...value }]));
                    break;
                }
            }
        });
        return this.safePromises;
    }

    sync(newState) {
        if (this.safePromises.length > 0) {
            // return Promise.mapSeries(this.safePromises, step => step()).then(data => {
            //     console.log(data);
            // });
            // return Promise.all(this.safePromises).finally(err => {
            //     this.safePromises = [];
            // });
        }
    }

    setMapItem(item) {
        let updateOnDuplicate = [`x`, `y`, `floor`, `data`];
        this.queue.add(() => this.savePromiseFactory("mapItem", [...item], { updateOnDuplicate }));
    }
}

export default new StateManager();
