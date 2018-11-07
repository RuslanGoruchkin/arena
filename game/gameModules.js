import _ from "lodash";
import { getCurrentFloor, getModule, getPlayer, isPlayerHaveAccess, setModule } from "./helpers/ctx";

export const gameModules = {
    processor: {
        name: "processor",
        character: "🎛",
        characterOfBroken: "⚙️",
        isBroken: false,
        isStolen: false,
        defence: 25,
        resurrection: 1920,
        cycle: 120,
        viruses: [],
        isWorked: false,
        electricityPrice: 10,
        onTick: (state, params) => {
            let player = getPlayer(state, params);
            if (!player || !player.personalCoordinates) return state;
            let data = player.data;
            let currentTick = state.currentTick;
            let personalCoordinates = player.personalCoordinates;
            for (let x = personalCoordinates.xPos; x < personalCoordinates.xPos + 5; x++) {
                for (let y = personalCoordinates.yPos; y < personalCoordinates.yPos + 5; y++) {
                    let processor = getModule(state, { ...params, floor: player.currentFloor, x, y });
                    if (processor.character === gameModules.processor.character) {
                        if (data.isOrderPaid) {
                            if (processor.programToCreate) {
                                processor.isWorked = true;
                                if (!processor.startTimer) {
                                    processor.startTimer = true;
                                    processor.finishTick = currentTick + processor.cycle;
                                }
                            }
                            if (processor.finishTick === currentTick) {
                                processor.isWorked = false;
                                processor.complete = true;
                                processor.completeProgram = processor.programToCreate;
                                processor.programToCreate = undefined;
                                processor.startTimer = false;
                            }
                            if (processor.isBroken) {
                                if (!processor.startBrokenTimer) {
                                    processor.startBrokenTimer = true;
                                    processor.finishBrokenTick = currentTick + gameModules.processor.resurrection * 60;
                                }
                            }
                            if (processor.finishBrokenTick === currentTick) {
                                processor.isBroken = false;
                                processor.isVisible = false;
                            }
                        } else {
                            processor.isWorked = false;
                        }
                        state = setModule(state, processor, { ...params, floor: player.currentFloor, x, y });
                    }
                }
            }
            return state;
        }
    },
    storage: {
        name: "storage",
        character: "🗄",
        characterOfBroken: "🤖️",
        isBroken: false,
        isStolen: false,
        defence: 75,
        resurrection: 480,
        size: 25,
        programs: [],
        onTick: (state, params) => {
            let player = getPlayer(state, params);
            if (!player || !player.personalCoordinates) return state;
            let currentTick = state.currentTick;
            let personalCoordinates = player.personalCoordinates;
            for (let x = personalCoordinates.xPos; x < personalCoordinates.xPos + 5; x++) {
                for (let y = personalCoordinates.yPos; y < personalCoordinates.yPos + 5; y++) {
                    let storage = getModule(state, { ...params, floor: player.currentFloor, x, y });
                    if (storage.character === gameModules.storage.character) {
                        if (storage.isBroken) {
                            if (!storage.startBrokenTimer) {
                                storage.startBrokenTimer = true;
                                storage.finishBrokenTick = currentTick + gameModules.storage.resurrection * 60;
                            }
                        }
                        if (storage.finishBrokenTick === currentTick) {
                            storage.isBroken = false;
                            storage.isVisible = false;
                            //ctx.map[ctx.session.player.currentFloor][x][y].startBrokenTimer = false;
                        }
                    }
                    state = setModule(state, storage, { ...params, floor: player.currentFloor, x, y });
                }
            }
            return state;
        }
    },
    miner: {
        name: "miner",
        character: "🌼",
        characterOfBroken: "🍄️",
        isBroken: false,
        isStolen: false,
        defence: 50,
        resurrection: 240,
        size: 25,
        influence: 100,
        viruses: [],
        volume: 0,
        isWorked: true,
        electricityPrice: 10,
        onTick: (state, params) => {
            let player = getPlayer(state, params);
            if (!player || !player.personalCoordinates) return state;
            let currentTick = state.currentTick;
            let data = player.data;
            data.totalInfluence = 0;
            let currentFloor = getCurrentFloor(state, params);

            _.forEach(currentFloor, (row, x) => {
                _.forEach(row, (miner, y) => {
                    if (miner && miner.character === gameModules.miner.character) {
                        if (isPlayerHaveAccess(state, { ...params, x, y })) {
                            data.totalInfluence += miner.influence;
                        }
                    }
                });
            });
            let totalInfluence = _.reduce(
                _.values(state.players),
                (sum, session) => {
                    return sum + _.get(session, "player.data.totalInfluence") || 0;
                },
                0
            );
            _.forEach(currentFloor, (row, x) => {
                _.forEach(row, (miner, y) => {
                    if (miner && miner.character === gameModules.miner.character) {
                        if (isPlayerHaveAccess(state, { ...params, x, y })) {
                            data.totalInfluence += miner.influence;
                        }
                        if (data.isOrderPaid) {
                            let isNotOverflow = miner.volume < gameModules.miner.size;
                            miner.isWorked = isNotOverflow;
                            if (isNotOverflow && currentTick % 60 === 0 && !miner.isBroken) {
                                miner.volume += Math.ceil(
                                    ((data.coinsPerTick * _.values(state.players).length) / totalInfluence) * miner.influence
                                );
                            }
                            if (miner.isBroken) {
                                if (!miner.startBrokenTimer) {
                                    miner.startBrokenTimer = true;
                                    miner.finishBrokenTick = currentTick + gameModules.miner.resurrection * 60;
                                }
                            }
                            if (miner.finishBrokenTick === currentTick) {
                                miner.isBroken = false;
                                miner.isVisible = false;
                            }
                        } else {
                            miner.isWorked = false;
                        }
                        state = setModule(state, miner, { ...params, floor: player.currentFloor, x, y });
                    }
                });
            });
            return state;
        }
    },
    wallet: {
        name: "wallet",
        character: "🍯",
        characterOfBroken: "👛️",
        isBroken: false,
        isStolen: false,
        defence: 150,
        resurrection: 120,
        onTick: (state, params) => {
            let player = getPlayer(state, params);
            if (!player || !player.personalCoordinates) return state;
            let data = player.data;
            let currentTick = state.currentTick;
            player.walletsCount = 0;
            let personalCoordinates = player.personalCoordinates;
            for (let x = personalCoordinates.xPos; x < personalCoordinates.xPos + 5; x++) {
                for (let y = personalCoordinates.yPos; y < personalCoordinates.yPos + 5; y++) {
                    let wallet = getModule(state, { ...params, floor: player.currentFloor, x, y });
                    if (wallet.character === gameModules.wallet.character) {
                        if (data.wallets.length <= player.walletsCount) {
                            data.wallets.push(wallet);
                        }
                        player.walletsCount++;
                        if (wallet.isBroken) {
                            if (!wallet.startBrokenTimer) {
                                wallet.startBrokenTimer = true;
                                wallet.finishBrokenTick = currentTick + gameModules.wallet.resurrection * 60;
                            }
                        }
                        if (wallet.finishBrokenTick === currentTick) {
                            wallet.isBroken = false;
                            wallet.isVisible = false;
                        }
                        state = setModule(state, wallet, { ...params, floor: player.currentFloor, x, y });
                    }
                }
            }
            return state;
        }
    },
    antivirus: {
        name: "antivirus",
        character: "🚨",
        characterOfBroken: "💥️",
        isBroken: false,
        isStolen: false,
        defence: 150,
        resurrection: 960,
        detecting: 100,
        isWorked: true,
        electricityPrice: 10,
        onTick: (state, params) => {
            let player = getPlayer(state, params);
            if (!player || !player.personalCoordinates) return state;
            let data = player.data;
            let currentTick = state.currentTick;
            let personalCoordinates = player.personalCoordinates;
            for (let x = personalCoordinates.xPos; x < personalCoordinates.xPos + 5; x++) {
                for (let y = personalCoordinates.yPos; y < personalCoordinates.yPos + 5; y++) {
                    let antivirus = getModule(state, { ...params, floor: player.currentFloor, x, y });
                    if (antivirus.character === gameModules.antivirus.character) {
                        if (data.isOrderPaid) {
                            if (antivirus.isBroken) {
                                if (!antivirus.startBrokenTimer) {
                                    antivirus.startBrokenTimer = true;
                                    antivirus.finishBrokenTick = currentTick + gameModules.antivirus.resurrection * 60;
                                }
                            }
                            if (antivirus.finishBrokenTick === currentTick) {
                                antivirus.isBroken = false;
                                antivirus.isVisible = false;
                            }
                            antivirus.isWorked = !antivirus.isBroken;
                        } else {
                            antivirus.isWorked = false;
                        }
                        state = setModule(state, antivirus, { ...params, floor: player.currentFloor, x, y });
                    }
                }
            }
            return state;
        }
    },
    firewall: {
        name: "firewall",
        character: "🛡",
        characterOfBroken: "🚧",
        isBroken: false,
        isStolen: false,
        defence: 200,
        resurrection: 60,
        isWorked: true,
        onTick: (state, params) => {
            let player = getPlayer(state, params);
            if (!player || !player.personalCoordinates) return state;
            let data = player.data;
            let currentTick = state.currentTick;
            let personalCoordinates = player.personalCoordinates;
            for (let x = personalCoordinates.xPos; x < personalCoordinates.xPos + 5; x++) {
                for (let y = personalCoordinates.yPos; y < personalCoordinates.yPos + 5; y++) {
                    let firewall = getModule(state, { ...params, floor: player.currentFloor, x, y });
                    if (firewall.character === gameModules.firewall.character) {
                        if (data.isOrderPaid) {
                            if (firewall.isBroken) {
                                if (!firewall.startBrokenTimer) {
                                    firewall.startBrokenTimer = true;
                                    firewall.finishBrokenTick = currentTick + gameModules.firewall.resurrection * 60;
                                }
                            }
                            if (firewall.finishBrokenTick === currentTick) {
                                firewall.isBroken = false;
                                firewall.isVisible = false;
                            }
                            firewall.isWorked = !firewall.isBroken;
                        } else {
                            firewall.isWorked = false;
                        }
                        state = setModule(state, firewall, { ...params, floor: player.currentFloor, x, y });
                    }
                }
            }
            /*data.electricityTotalPrice = 0;
            for (let x = personalCoordinates.xPos; x < personalCoordinates.xPos + 5; x++) {
                for (let y = personalCoordinates.yPos; y < personalCoordinates.yPos + 5; y++) {
                    if (ctx.map[player.currentFloor][x][y].electricityPrice) {
                        data.electricityTotalPrice += ctx.map[player.currentFloor][x][y].electricityPrice;
                    }
                }
            }
            if (currentTick % 60 === 0) {
                data.isOrderPaid = data.coins - data.electricityTotalPrice > 0;
                if (data.coins - data.electricityTotalPrice > 0) {
                    data.coins -= data.electricityTotalPrice;
                }
            }*/
            return state;
        }
    },
    way: {
        name: "way",
        character: "⬜️",
        isVisible: true
    },
    space: {
        name: "space",
        character: "⬛️",
        isVisible: true
    },
    dailyNPC: {
        name: "dailyNPC",
        character: "👨‍💼️",
        isVisible: true
    },
    fire: {
        name: "fire",
        character: "🔥",
        isVisible: true
    },
    availableSpace: {
        name: "availableSpace",
        character: "🔲",
        isVisible: true
    },
    yourFriend: {
        name: "yourFriend",
        character: "👨‍💻",
        characterOfBroken: "👨‍💻",
        isVisible: true
    },
    fogged: {
        character: "❓"
    },
    sewerHatch: {
        name: "sewerHatch",
        character: "🕳",
        isVisible: true
    },
    stairs: {
        name: "stairs",
        character: "💈",
        isVisible: true
    },
    programVendor: {
        name: "programVendor",
        character: "🛒",
        isVisible: true
    },
    moduleVendor: {
        name: "moduleVendor",
        character: "🎒",
        isVisible: true
    },
    denied: {
        character: "🛑",
        isVisible: true
    },
    elevator: {
        name: "elevator",
        character: "🌀",
        isVisible: true
    },
    relocationMaster: {
        name: "relocationMaster",
        character: "🤖",
        isVisible: true
    }
};
