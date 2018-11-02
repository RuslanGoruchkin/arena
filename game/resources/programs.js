import _ from "lodash";
import { addXPToPlayerByProgramLevel, detect, hackModule } from "../util";
import { gameModules } from "../gameModules";
import { getModule, getPlayer, setModule, translate } from "../helpers/ctx";
import { enterScene, replyWithMarkdown } from "../helpers/TelegramApiHelpers";

let hack = function(state, params) {
    let { player, program, module, data } = params;
    let attack = data.baseHack + (program.level - 1) * 10 + player.selectedCharacter.processing * 10;
    let defence = module.defence;
    let multiplier = 0;
    for (let x = program.module.x - 1; x < program.module.x + 2; x++) {
        for (let y = program.module.y - 1; y < program.module.y + 2; y++) {
            let areaModule = getModule(state, { ...params, floor: program.module.currentFloor, x, y });
            if (
                (x === program.module.x && y === program.module.y) ||
                areaModule.character === gameModules.space.character ||
                areaModule.character === gameModules.denied.character
            ) {
                continue;
            }
            if (!areaModule.isBroken) {
                multiplier += 12.5;
            }
        }
    }
    defence *= multiplier / 100;
    if (_.random(0, attack) > _.random(0, defence)) {
        state = hackModule(state, { ...params, program });
        state = detect(state, ...params, program);
        let hackedModuleText = translate(state, "texts.programs.hackedModule");
        replyWithMarkdown(hackedModuleText, params);
    } else {
        let chance = (attack / (attack + defence)) * 100;
        let failAttemptText = translate(state, "texts.programs.failAttempt", {
            ...params,
            chance: chance.toFixed(2)
        });
        replyWithMarkdown(failAttemptText, params);
    }
};

let expandModules = function(state, params) {
    let { program, player } = params;
    let potential = program.level + player.selectedCharacter.logic;
    let startX = program.module.x - 1;
    let startY = program.module.y - 1;
    let size = 2;
    while (potential > 0) {
        let isNeedExpand = true;
        for (let i = startX; i < startX + size + 1; i++) {
            for (let j = startY; j < startY + size + 1; j++) {
                let module = getModule(state, { ...params, floor: player.currentFloor, x: i, y: j });
                if (!module.isVisible) {
                    isNeedExpand = false;
                }
            }
        }
        if (isNeedExpand) {
            size += 2;
            startX--;
            startY--;
        }
        let x = _.random(startX, startX + size);
        let y = _.random(startY, startY + size);
        let module = getModule(state, { ...params, floor: player.currentFloor, x, y });
        if (!module.isVisible) {
            state = setModule(state, { ...module, isVisible: true }, { ...params, floor: player.currentFloor, x, y });
            potential--;
        }
    }
    return state;
};
export let programs = {
    cheatHack: {
        key: "hack",
        name: "Hack",
        level: 1,
        castingTime: 10,
        noise: 1,
        isCasting: false,
        onTick: (state, params) => {
            let player = getPlayer(state, params);
            let data = player.data;
            if (!(player && player.personalCoordinates)) return state;
            let currentTick = state.currentTick;
            if (!data) return state;
            for (let i = player.attackPrograms.length - 1; i >= 0; i--) {
                if (player.attackPrograms[i].name === programs.hack.name) {
                    let program = player.attackPrograms[i];
                    if (program.isCasting) {
                        program.startCastingTimer = true;
                    }
                    if (program.isCasting && !program.endCastingTime) {
                        program.endCastingTime = currentTick + program.castingTime;
                        program.module = {
                            currentFloor: player.currentFloor,
                            x: player.coordinates.xPos,
                            y: player.coordinates.yPos
                        };
                    }
                    if (program.endCastingTime === currentTick) {
                        let element = _.indexOf(player.attackPrograms, program);
                        if (~element) {
                            player.attackPrograms.splice(element, 1);
                        }
                        let module = getModule(state, {
                            ...params,
                            floor: program.module.currentFloor,
                            x: program.module.x,
                            y: program.module.y
                        });
                        if (!module.isBroken) {
                            state = hackModule(state, { ...params, program });
                            state = detect(state, { ...params, program });
                            player.data.hackStatus++;
                            let hackedModuleText = translate(state, "texts.programs.hackedModule", params);
                            replyWithMarkdown(hackedModuleText, params);
                        } else {
                            let moduleAlreadyHacked = translate(state, "texts.programs.moduleAlreadyHacked", params);
                            replyWithMarkdown(moduleAlreadyHacked, params);
                        }
                        program.isCasting = false;
                        program.endCastingTime = undefined;
                        enterScene(state, { ...params, scene: "mainScene" }, state);
                    }
                }
            }
            return state;
        }
    },
    hack: {
        key: "hack",
        name: "Hack",
        level: 1,
        castingTime: 10,
        noise: 200,
        isCasting: false,
        onTick: (state, params) => {
            let player = getPlayer(state, params);
            if (!(player && player.personalCoordinates)) return state;
            let data = player.data;
            let currentTick = state.currentTick;
            for (let i = player.attackPrograms.length - 1; i >= 0; i--) {
                if (player.attackPrograms[i].name === programs.hack.name) {
                    let program = player.attackPrograms[i];
                    if (program.isCasting) {
                        program.startCastingTimer = true;
                    }
                    if (program.isCasting && !program.endCastingTime) {
                        program.endCastingTime = currentTick + program.castingTime;
                        program.module = {
                            currentFloor: player.currentFloor,
                            x: player.coordinates.xPos,
                            y: player.coordinates.yPos
                        };
                    }
                    if (program.endCastingTime === currentTick) {
                        let element = _.indexOf(player.attackPrograms, program);
                        if (~element) {
                            player.attackPrograms.splice(element, 1);
                        }
                        let module = getModule(state, ...params, {
                            floor: program.module.currentFloor,
                            x: program.module.x,
                            y: program.module.y
                        });
                        if (!module.isBroken) {
                            state = hack(state, { ...params, player, program, module, data });
                        } else {
                            let moduleAlreadyHackedText = translate(state, "texts.programs.moduleAlreadyHacked", params);
                            replyWithMarkdown(moduleAlreadyHackedText, params);
                        }
                        program.isCasting = false;
                        program.endCastingTime = undefined;
                        enterScene(state, { ...params, scene: "mainScene" }, state);
                    }
                }
            }
            return state;
        }
    },
    scan: {
        key: "scan",
        name: "Scan",
        level: 1,
        castingTime: 10,
        noise: 50,
        isCasting: false,
        onTick: (state, params) => {
            let player = getPlayer(state, params);
            if (!(player && player.personalCoordinates)) return state;
            let currentTick = state.currentTick;
            for (let i = player.attackPrograms.length - 1; i >= 0; i--) {
                if (player.attackPrograms[i].name === programs.scan.name) {
                    let program = player.attackPrograms[i];
                    if (program.isCasting) {
                        program.startCastingTimer = true;
                    }
                    if (program.isCasting && !program.endCastingTime) {
                        program.endCastingTime = currentTick + program.castingTime;
                        program.module = {
                            currentFloor: player.currentFloor,
                            x: player.coordinates.xPos,
                            y: player.coordinates.yPos
                        };
                    }
                    if (program.endCastingTime === currentTick) {
                        let element = _.indexOf(player.attackPrograms, program);
                        if (~element) {
                            player.attackPrograms.splice(element, 1);
                        }
                        state = detect(state, { ...params, program });
                        state = expandModules(state, { ...params, program });
                        state = addXPToPlayerByProgramLevel(state, { ...params, program: player.attackProgram });
                        program.isCasting = false;
                        program.endCastingTime = undefined;
                        enterScene(state, { ...params, scene: "mainScene" }, state);
                    }
                }
            }
            return state;
        }
    },
    virus: {
        key: "virus",
        name: "Virus",
        level: 1,
        castingTime: 10,
        noise: 100,
        isCasting: false,
        onTick: (state, params) => {
            let player = getPlayer(state, params);
            if (!(player && player.personalCoordinates)) return state;
            let program;
            for (let i = player.attackPrograms.length - 1; i >= 0; i--) {
                if (player.attackPrograms[i].name === programs.virus.name) {
                    program = player.attackPrograms[i];
                }
            }
            if (_.isObject(program)) {
                state = detect(state, { program });
            }

            return state;
        }
    },
    warriorHack: {
        key: "warriorHack",
        name: "Warrior's Hack",
        level: 1,
        castingTime: 5,
        noise: 300,
        isCasting: false,
        onTick: (state, params) => {
            let player = getPlayer(state, params);
            if (!(player && player.personalCoordinates)) return state;
            let data = player.data;
            let currentTick = state.currentTick;
            for (let i = player.attackPrograms.length - 1; i >= 0; i--) {
                if (player.attackPrograms[i].name === programs.warriorHack.name) {
                    let program = player.attackPrograms[i];
                    if (program.isCasting) {
                        program.startCastingTimer = true;
                    }
                    if (program.isCasting && !program.endCastingTime) {
                        program.endCastingTime = currentTick + program.castingTime;
                        program.module = {
                            currentFloor: player.currentFloor,
                            x: player.coordinates.xPos,
                            y: player.coordinates.yPos
                        };
                    }
                    if (program.endCastingTime === currentTick) {
                        let element = _.indexOf(player.attackPrograms, program);
                        if (~element) {
                            player.attackPrograms.splice(element, 1);
                        }
                        let module = getModule(state, {
                            ...params,
                            floor: program.module.currentFloor,
                            x: program.module.x,
                            y: program.module.y
                        });
                        if (!module.isBroken) {
                            hack(state, { ...params, player, program, module, data });
                        } else {
                            let moduleAlreadyHackedText = translate(state, "texts.programs.moduleAlreadyHacked", params);
                            replyWithMarkdown(moduleAlreadyHackedText, params);
                        }
                        program.isCasting = false;
                        program.endCastingTime = undefined;
                        enterScene(state, { ...params, scene: "mainScene" }, state);
                    }
                }
            }
            return state;
        }
    },
    mageHack: {
        key: "mageHack",
        name: "Mage's Hack",
        level: 1,
        castingTime: 5,
        noise: 150,
        isCasting: false,
        onTick: (state, params) => {
            let player = getPlayer(state, params);
            if (!(player && player.personalCoordinates)) return state;
            let data = player.data;
            let currentTick = state.currentTick;
            for (let i = player.attackPrograms.length - 1; i >= 0; i--) {
                if (player.attackPrograms[i].name === programs.mageHack.name) {
                    let program = player.attackPrograms[i];
                    if (program.isCasting) {
                        program.startCastingTimer = true;
                    }
                    if (program.isCasting && !program.endCastingTime) {
                        program.endCastingTime = currentTick + program.castingTime;
                        program.module = {
                            currentFloor: player.currentFloor,
                            x: player.coordinates.xPos,
                            y: player.coordinates.yPos
                        };
                    }
                    if (program.endCastingTime === currentTick) {
                        let element = _.indexOf(player.attackPrograms, program);
                        if (~element) {
                            player.attackPrograms.splice(element, 1);
                        }
                        let module = getModule(state, {
                            ...params,
                            floor: program.module.currentFloor,
                            x: program.module.x,
                            y: program.module.y
                        });
                        if (!module.isBroken) {
                            hack(state, { ...params, player, program, module, data });
                        } else {
                            let moduleAlreadyHackedText = translate(state, "texts.programs.moduleAlreadyHacked", params);
                            replyWithMarkdown(moduleAlreadyHackedText, params);
                        }
                        program.isCasting = false;
                        program.endCastingTime = undefined;
                        enterScene(state, { ...params, scene: "mainScene" }, state);
                    }
                }
            }
            return state;
        }
    },
    evangelistVirus: {
        key: "evangelistVirus",
        name: "Evangelist's Virus",
        level: 1,
        castingTime: 10,
        isCasting: false,
        onTick: (state, params) => {
            state = programs.virus.onTick(state, params);
            return state;
        }
    },
    prophetScan: {
        key: "prophetScan",
        name: "Prophet's Scan",
        level: 1,
        castingTime: 20,
        isCasting: false,
        onTick: (state, params) => {
            let player = getPlayer(state, params);
            if (!(player && player.personalCoordinates)) return state;
            let currentTick = state.currentTick;
            for (let i = player.attackPrograms.length - 1; i >= 0; i--) {
                if (player.attackPrograms[i].name === programs.prophetScan.name) {
                    let program = player.attackPrograms[i];
                    if (program.isCasting) {
                        program.startCastingTimer = true;
                    }
                    if (program.isCasting && !program.endCastingTime) {
                        program.endCastingTime = currentTick + program.castingTime;
                        program.module = {
                            currentFloor: player.currentFloor,
                            x: player.coordinates.xPos,
                            y: player.coordinates.yPos
                        };
                    }
                    if (program.endCastingTime === currentTick) {
                        let element = _.indexOf(player.attackPrograms, program);
                        if (~element) {
                            player.attackPrograms.splice(element, 1);
                        }
                        state = detect(state, { ...params, program });
                        state = expandModules(state, { ...params, program, player });
                        state = addXPToPlayerByProgramLevel(state, { ...params, program: player.attackProgram });
                        program.isCasting = false;
                        program.endCastingTime = undefined;
                        enterScene(state, { ...params, scene: "mainScene" }, state);
                    }
                }
            }
            return state;
        }
    },
    nomadHack: {
        key: "nomadHack",
        name: "Nomad's Hack",
        level: 1,
        castingTime: 20,
        noise: 150,
        isCasting: false,
        onTick: (state, params) => {
            let player = getPlayer(state, params);
            if (!(player && player.personalCoordinates)) return state;
            let data = player.data;
            let currentTick = state.currentTick;

            for (let i = player.attackPrograms.length - 1; i >= 0; i--) {
                if (player.attackPrograms[i].name === programs.nomadHack.name) {
                    let program = player.attackPrograms[i];
                    if (program.isCasting) {
                        program.startCastingTimer = true;
                    }
                    if (program.isCasting && !program.endCastingTime) {
                        program.endCastingTime = currentTick + program.castingTime;
                        program.module = {
                            currentFloor: player.currentFloor,
                            x: player.coordinates.xPos,
                            y: player.coordinates.yPos
                        };
                    }
                    if (program.endCastingTime === currentTick) {
                        let element = _.indexOf(player.attackPrograms, program);
                        if (~element) {
                            player.attackPrograms.splice(element, 1);
                        }
                        let module = getModule(state, {
                            ...params,
                            floor: program.module.currentFloor,
                            x: program.module.x,
                            y: program.module.y
                        });
                        if (!module.isBroken) {
                            state = hack(state, { ...params, player, program, module, data });
                        } else {
                            let moduleAlreadyHackedText = translate(state, "texts.programs.moduleAlreadyHacked", params);
                            replyWithMarkdown(moduleAlreadyHackedText, params);
                        }
                        program.isCasting = false;
                        program.endCastingTime = undefined;
                        enterScene(state, { ...params, scene: "mainScene" }, state);
                    }
                }
            }
            return state;
        }
    }
};
