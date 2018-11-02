import _ from "lodash";
import { gameModules } from "../gameModules";
import { getModule, getPlayer } from "../helpers/ctx";

export let quests = {
    usePrograms: {
        name: "usePrograms",
        nextQuest: "buyProcessor",
        introScene: "useProgramsQuestIntro",
        award:{
            coins: 300,
            XP: 20
        },
        goal: (state, params) => {
            let player = getPlayer(state, params);
            return !!(_.isEmpty(player.data.programsInMemory) && player.data.coins > 50);
        },
        fail: (state, params) => {
            return false;
        }
    },
    buyProcessor: {
        name: "buyProcessor",
        nextQuest: "placeProcessor",
        introScene: "buyProcessorQuestIntro",
        award:{
            coins: 100,
            XP: 20
        },
        goal: (state, params) => {
            let player = getPlayer(state, params);
            _.each(player.data.inventory, module => {
                if (module.character === gameModules.processor.character) {
                    return quests.placeProcessor.goal(state, params);
                }
            });
            return false;
        },
        fail: (state, params) => {
            return false;
        }
    },
    placeProcessor: {
        name: "placeProcessor",
        nextQuest: "craftProgram",
        award:{
            coins: 0,
            XP: 20
        },
        goal: (state, params) => {
            let player = getPlayer(state, params);
            if (!player || !player.personalCoordinates) return false;
            let xPos = player.personalCoordinates.xPos;
            let yPos = player.personalCoordinates.yPos;
            for (let x = xPos; x < xPos + 4; x++) {
                for (let y = yPos; y < yPos + 4; y++) {
                    let module = getModule(state, { ...params, floor: player.currentFloor, x, y });
                    if (module.character === gameModules.processor.character) {
                        return true;
                    }
                }
            }
            return false;
        },
        fail: (state, params) => {
            return false;
        }
    },
    craftProgram: {
        name: "craftProgram",
        nextQuest: "putProgram",
        award:{
            coins: 100,
            XP: 20
        },
        goal: (state, params) => {
            let player = getPlayer(state, params);
            return !!_.get(player, "data.programsInMemory[0]");
        },
        fail: (state, params) => {
            return false;
        }
    },
    putProgram: {
        name: "putProgram",
        nextQuest: "buyMiner",
        award:{
            coins: 100,
            XP: 20
        },
        goal: (state, params) => {
            let player = getPlayer(state, params);
            if (!player || !player.personalCoordinates) return false;
            let xPos = player.personalCoordinates.xPos;
            let yPos = player.personalCoordinates.yPos;
            for (let x = xPos; x < xPos + 4; x++) {
                for (let y = yPos; y < yPos + 4; y++) {
                    if (getModule(state, { ...params, floor: player.currentFloor, x, y }).character === gameModules.storage.character) {
                        if (getModule(state, { ...params, floor: player.currentFloor, x, y }).programs.length > 0) {
                            return true;
                        }
                    }
                }
            }
        },
        fail: (state, params) => {
            return false;
        }
    },
    buyMiner: {
        name: "buyMiner",
        nextQuest: "placeMiner",
        award:{
            coins: 100,
            XP: 20
        },
        goal: (state, params) => {
            let player = getPlayer(state, params);
            _.each(player.data.inventory, module => {
                if (module.character === gameModules.miner.character) {
                    return quests.placeMiner.goal(state, params);
                }
            });
        },
        fail: (state, params) => {
            return false;
        }
    },
    placeMiner: {
        name: "placeMiner",
        nextQuest: "mineCurrency",
        award:{
            XP: 20
        },
        goal: (state, params) => {
            let player = getPlayer(state, params);
            if (!player || !player.personalCoordinates) return false;
            let xPos = player.personalCoordinates.xPos;
            let yPos = player.personalCoordinates.yPos;
            for (let x = xPos; x < xPos + 4; x++) {
                for (let y = yPos; y < yPos + 4; y++) {
                    if (getModule(state, { ...params, floor: player.currentFloor, x, y }).character === gameModules.miner.character) {
                        return true;
                    }
                }
            }
        },
        fail: (state, params) => {
            return false;
        }
    },
    mineCurrency: {
        name: "mineCurrency",
        nextQuest: "finalFight",
        award:{
            XP: 20
        },
        goal: (state, params) => {
            let player = getPlayer(state, params);
            return _.get(player, "data.coins") > 350 && quests.placeMiner.goal(state, params);
        },
        fail: (state, params) => {
            return false;
        }
    },
    finalFight: {
        name: "finalFight",
        introScene: "finalFightQuestIntro",
        outroScene: "finalFightQuestOutro",
        award:{},
        coins: 0,
        XP: 20,
        goal: (state, params) => {
            let player = getPlayer(state, params);
            if (_.findIndex(player.data.programsInMemory, { key: "information" }).toString() !== "-1") {
                return true;
            }
        },
        fail: (state, params) => {
            let player = getPlayer(state, params);
            if (!!_.get(player, "data.programsInMemory[0]")) {
                if (_.findIndex(player.data.programsInMemory, { key: "information" }).toString() !== "-1") {
                    return true;
                }
            }
        }
    },
    placeFirewallAntivirus: {
        name: "placeFirewallAntivirus",
        nextQuest: "hackSomething",
        award:{
            coins: 100,
            XP: 20
        },
        goal: (state, params) => {
            let player = getPlayer(state, params);
            if (!player || !player.personalCoordinates) return false;
            let xPos = player.personalCoordinates.xPos;
            let yPos = player.personalCoordinates.yPos;
            for (let x = xPos; x < xPos + 4; x++) {
                for (let y = yPos; y < yPos + 4; y++) {
                    if (getModule(state, { ...params, floor: player.currentFloor, x, y }).character === gameModules.firewall.character) {
                        for (let x = xPos; x < xPos + 4; x++) {
                            for (let y = yPos; y < yPos + 4; y++) {
                                if (
                                    getModule(state, { ...params, floor: player.currentFloor, x, y }).character ===
                                    gameModules.antivirus.character
                                ) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        },
        fail: (state, params) => {
            return false;
        }
    },
    hackSomething: {
        name: "hackSomething",
        award:{
            coins: 100,
            XP: 20
        },
        goal: (state, params) => {
            let player = getPlayer(state, params);
            if (!player || !player.coordinates) return false;
            let currentFloor = player.currentFloor;
            let coordinates = player.coordinates;
            let xPos = coordinates.xPos;
            let yPos = coordinates.yPos;
            let module = getModule(state, { ...params, floor: currentFloor, x: xPos, y: yPos });
            return !!(currentFloor.match(/tech/gi) && module.isBroken);
        },
        fail: (state, params) => {
            return false;
        }
    },
    daily1: {
        name: "daily1",
        introScene: "daily1Scene",
        award:{
            coins: 1000,
            XP: 20
        },
        award2:{
            tokens: 10,
            XP: 20
        },
        goal: (state, params) => {
            let player = getPlayer(state, params);
            return _.get(player, "data.hackStatus") > 0;
        },
        fail: (state, params) => {
            return false;
        }
    },
    daily2:{
        name:"daily2",
        introScene:'dailyIntroScene',
        outroScene:'dailyOutroScene',
        award:{
            coins: 1000,
            XP: 20
        },
        award2:{
            tokens: 10,
            XP: 20
        },
        goal: ctx => {
            let success = false;
            if ((_.findIndex(ctx.session.player.state.data.programsInMemory, {key: 'daily2'})).toString() !== '-1'){
                success = true;
            }
            return success;
        },
        fail: ctx => {
            let fail = false;
            return fail ;
        }
    },
    daily3:{
        name:"daily3",
        introScene:'dailyIntroScene',
        outroScene:'dailyOutroScene',
        award:{
            coins: 1000,
            XP: 20
        },
        award2:{
            tokens: 10,
            XP: 20
        },
        goal: ctx => {
            let success = false;
            if ((_.findIndex(ctx.session.player.state.data.programsInMemory, {key: 'daily3'})).toString() !== '-1'){
                success = true;
            }
            return success;
        },
        fail: ctx => {
            let fail = false;
            return fail ;
        }
    }
};
