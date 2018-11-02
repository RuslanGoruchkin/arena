import { accessMatrixToCollection, difference, mapCollectionToMatrixReducer, mapMatrixToCollection } from "./helpers/helpers";
import _ from "lodash";
import db from "../models";
import Promise from "bluebird";
import { getPlayer } from "./helpers/ctx";

const debug = require("debug")("bot:stateManager");

class StateManager {
    constructor() {
        this.client = db;
        this.loading = false;
        this.state = {};
        this.ctxState = null;
    }

    // static defineStartPosition() {
    //     if (!_availablePositions.length) {
    //         return { x: this.getStart(COUNT_OF_PLAYERS_BY_WIDTH), y: this.getStart(COUNT_OF_PLAYERS_BY_HEIGHT) };
    //     }
    //     let xStart = this.getStart(_availablePositions.length);
    //     let yStart = this.getStart(_availablePositions[0].length);
    //     let xLimit = xStart + 3;
    //     let yLimit = yStart + 3;
    //     for (let x = xStart; x < xLimit; x++) {
    //         for (let y = yStart; y < yLimit; y++) {
    //             if (_.get(_availablePositions, `[${x}][${y}]`) === "") {
    //                 return { x, y };
    //             }
    //             if (x === xLimit - 1 && y === yLimit - 1 && xLimit < _availablePositions.length && yLimit < _availablePositions[x].length) {
    //                 xLimit++;
    //                 yLimit++;
    //                 xStart--;
    //                 x = xStart;
    //                 yStart--;
    //                 y = yStart;
    //             }
    //         }
    //     }
    // }
    // static getStart(size) {
    //     return _.floor(size / 2);
    // }
    // generateAvaiblePositions(arrayOfPlayers = []) {
    //     let availablePositions = [];
    //     for (let startX = 0; startX < COUNT_OF_PLAYERS_BY_WIDTH; startX++) {
    //         availablePositions[startX] = [];
    //         for (let startY = 0; startY < COUNT_OF_PLAYERS_BY_HEIGHT; startY++) {
    //             let owner = _.get(_.find(arrayOfPlayers, { startX: startX, startY: startY }), "id", "");
    //             availablePositions[startX][startY] = owner;
    //         }
    //     }
    //     return availablePositions;
    // }
    // defineAvailablePositions() {
    //     Object.defineProperty(global._hackerpunk, "availablePositions", {
    //         get: () => {
    //             debug(`Get _avaiblePositions ${_availablePositions}`);
    //             return _availablePositions;
    //         }
    //         // set: newValue => {
    //         //   // let diff = difference(newValue, _players);
    //         //   // debug(`Changed map ${diff}`);
    //         //   // this.setMaps(diff);
    //         //   return newValue;
    //         // }
    //     });
    // }
    getCtxState(params) {
        this.ctxState = _.cloneDeep(this.state);
        if (_.get(params, "playerId")) {
            let player = getPlayer(this.ctxState, params);
            if (player) {
                this.ctxState.player = player;
            }
        }
        return this.ctxState;
    }

    getState(params) {
        let state = { ...this.state };
        if (_.get(params, "playerId")) {
            let player = getPlayer(state, params);
            if (player) {
                state = {
                    ...state,
                    player
                };
            }
        }
        return state;
    }

    setState(state) {
        let diff = difference(_.omit(state, ["currentTick"]), this.state);
        let player = _.get(state, "player");
        if (!_.isEmpty(diff)) {
            return this.saveDiff(state, diff);
        }
        if (player && player.id) {
            state = { ...state, players: { ...state.players, [player.id]: { ...player } } };
        }
        return (this.state = state);
    }

    saveDiff(state, diff) {
        let promises = [];
        _.each(diff, (value, key) => {
            switch (key) {
                case "map": {
                    promises.push(this.setMaps(value));
                    break;
                }
                case "access": {
                    promises.push(this.setAccess(value));
                    break;
                }
                case "player": {
                    let player = { ...state.player };
                    promises.push(this.setPlayers([{ ...player }]));
                    this.state = {
                        ...state,
                        players: {
                            ...state.players,
                            [player.id]: { ...player }
                        }
                    };
                    break;
                }

                case "players": {
                    promises.push(this.setPlayers(value));
                    break;
                }
                default: {
                }
            }
        });
        return Promise.all(promises).then(() => {
            debug("Changes saves", this.state.currentTick, diff);
        });
    }

    sync(newState) {
        let diff = difference(_.omit(newState || this.ctxState, ["currentTick"]), _.omit(this.state, ["currentTick"]));
        if (!_.isEmpty(diff)) {
            this.saveDiff(newState || this.ctxState, diff);
            this.state = _.merge(this.state, _.omit(this.ctxState, ["currentTick"]));
        }
        return diff;
    }

    getStateFromDb() {
        if (!this.loading && !_.isEmpty(this.state)) {
            return Promise.resolve({ ...this.state });
        }
        if (this.loading && this.promises) {
            return this.promises;
        }
        debug(`Load state from db`);
        this.loading = true;
        let promises = [this.getMaps(""), this.getPlayers(), this.getDonates()];
        this.promises = Promise.all(promises)
            .then(([mapsResult, playersResult, donatesResult]) => {
                let { map, access } = mapCollectionToMatrixReducer(mapsResult);
                let players = _.keyBy(playersResult, "id");
                let state = {
                    map,
                    access,
                    players
                };
                this.loading = false;
                this.state = state;
                debug(`State loaded succesfully `);
                // let donates = _.keyBy(donatesResult, "id");
                return state;
            })
            .catch(error => {
                this.loading = false;
                debug(error);
            });
        return this.promises;
    }

    getPlayers() {
        return this.client.player.findAll({
            raw: true
        });
    }

    getDonates() {
        return this.client.player.findAll({
            raw: true
        });
    }

    getMaps(floor) {
        return this.client.mapItem
            .findAll({
                where: {
                    // floor: floor
                },
                raw: true,
                include: [{ all: true }]
            })
            .catch(error => {
                debug(error);
            });
    }

    setPlayers(players) {
        return this.client.player
            .bulkCreate(players, {
                updateOnDuplicate: [
                    "nickname",
                    "startX",
                    "startY",
                    "balanceCoin",
                    "balanceToken",
                    "level",
                    "infamousLevel",
                    "userDonateLink",
                    "telegramId",
                    "data",
                    "server",
                    "attackPrograms",
                    "basement",
                    "coordinates",
                    "personalCoordinates",
                    "currentFloor",
                    "currentQuest",
                    "language",
                    "walletsCount",
                    "moduleForBuy",
                    "comics",
                    "hackStatus",
                    "finalFightWasStarted",
                    "alreadyStolen",
                    "selectedCharacter",
                    "selectedComics",
                    "corporation"
                ],
                raw: true
            })
            .catch(error => {
                debug(error);
            });
    }

    setMaps(map) {
        let newMap = mapMatrixToCollection(map);
        return this.client.mapItem
            .bulkCreate(newMap, {
                raw: true,
                updateOnDuplicate: ["data"]
            })
            .catch(error => {
                debug(error);
            });
    }

    setAccess(map) {
        let { newMap, newAccess } = accessMatrixToCollection(map);
        return this.client.mapItem
            .bulkCreate(newMap, {
                raw: true,
                updateOnDuplicate: ["owner"]
            })
            .then(() => {
                return this.client.access.bulkCreate(newAccess, {
                    raw: true
                });
            })
            .catch(error => {
                debug(error);
            });
    }
}

export default new StateManager();
