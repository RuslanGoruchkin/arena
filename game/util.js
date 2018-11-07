import _ from "lodash";
import { createServerFromInventory, createServerFromTemplate } from "./server";
import { characters } from "./resources/characters";
import { getDefaultPlayer } from "./defaultPlayer";
import { addPlayerToFloor, createFogOfWar } from "./map";
import { gameModules } from "./gameModules";
import { basementServers } from "./resources/templates/basementServers";
import { programs } from "./resources/programs";
import execPromise from "@chmontgomery/exec-promise";
import { getModule, getPlayer, isPlayerHaveAccess, setModule, translate } from "./helpers/ctx";
import { questTemplate } from "./resources/templates/questTemplate";
import stateManager from "./stateManager";
import { enterScene, replyWithMarkdown } from "./helpers/TelegramApiHelpers";

let uniqid = require("uniqid");
let debug = require("debug")("bot:util");

export let goods = [];
export let basements = ["dangerousProcessors", "valleyOfMoney", "programParadise", "miningFarm"];
export let widthOfScreen = 3;
export let heightOfScreen = 3;
export const NICKNAME_LENGTH = 8;
const COUNT_OF_PLAYERS_BY_WIDTH = process.env.COUNT_OF_PLAYERS_BY_WIDTH;
const COUNT_OF_PLAYERS_BY_HEIGHT = process.env.COUNT_OF_PLAYERS_BY_HEIGHT;

export const getData = () => {
    return {};
};

export const getItemByClassCaption = (itemCaption, collection) => _.find(collection, { class: itemCaption });

export let getServerSizeFromFloor = floor => {
    let serverSize = floor.match(/_quest/gi) !== null || floor === "fight" ? 4 : floor.match(/(.*)x/)[1];
    serverSize = parseInt(serverSize);
    return serverSize;
};

const userLink = user => {
    let time = process.hrtime();
    let curl =
        `curl -v https://api.xsolla.com/merchant/v2/merchants/64159/token -X POST -u 64159:f9061740cfebc998cdc74b2175e22130 -H 'Content-Type:application/json' -H 'Accept: application/json' -d '{"user": {"id": {"value": "` +
        user +
        `"},"email": {"value": "black.deck.crew@gmail.com"}},"settings": {"project_id": 34501, "mode": "sandbox"}}'`;

    return execPromise(curl)
        .then((stdout, stderr) => {
            if (stderr) {
                return debug("exec error: " + stderr);
            }
            let result = JSON.parse(stdout);
            let diff = process.hrtime(time);
            let resultLink = "https://sandbox-secure.xsolla.com/paystation3/desktop/pricepoint/?access_token=" + result.token;
            debug(`Get User link - ${resultLink} in  ${diff}ms`);
            return resultLink;
        })
        .catch(err => {
            throw err;
        });
};

export const startNewGame = async (state, params) => {
    let { ctx } = params;
    if (!ctx.from.id) {
        return false;
    }
    let character = ctx.session.character || characters.defaultCharacter.class;
    state = { ...state, player: getDefaultPlayer() };
    let player = state.player;
    let serverSize = 4;

    player.id = ctx.from.id;
    params = { ...params, playerId: player.id };
    ctx.session = {
        ...ctx.session,
        playerId: player.id
    };
    player.nickname = generatePlayerNickname();
    player.selectedCharacter = getItemByClassCaption(character, characters);
    player.server = createServerFromTemplate(player.selectedCharacter.server);
    player.currentFloor = "4x4";
    player.telegramId = ctx.from.id;

    if (_.get(player, "data.inventory") && _.get(player, "data.inventory").length !== 0) {
        player.server = createServerFromInventory(player.data.inventory);
    }
    player.basement = {};
    player.basement.archetype = getItemByClassCaption(_.sample(basements), basementServers);
    player.basement.server = createServerFromTemplate(player.basement.archetype.server);
    let { coordinates, position } = defineStartCoordinates(state, { playerId: player.id, serverSize });
    player.startX = position.x;
    player.startY = position.y;

    player.personalCoordinates = coordinates;
    player.personalCoordinates.floor = `${serverSize}x${serverSize}`;

    player.coordinates = {
        xPos: player.personalCoordinates.xPos,
        yPos: player.personalCoordinates.yPos
    };
    params = {
        ...params,
        x: player.personalCoordinates.xPos,
        y: player.personalCoordinates.yPoss,
        floor: player.currentFloor
    };
    player.userDonateLink = await userLink(player.id);
    state = grantAccess(state, params);
    state = grantAccess(state, { ...params, floor: "4x4_tech", playerId: uniqid(`basement-${player.id}`) });
    state = addPlayerToFloor(state, { ...params });
    state = addPlayerToFloor(state, { ...params, floor: "4x4_tech" });
    return state;
};

export function defineStartCoordinates(state, params) {
    let { serverSize } = params;
    let coordinates;
    let position;
    do {
        position = defineStartPosition(state, params);
        coordinates = {
            xPos: (serverSize + 1) * position.x + 1 + 2,
            yPos: (serverSize + 1) * position.y + 1 + 2
        };
    } while (
        getOwnerModule(state, {
            ...params,
            floor: "4x4",
            x: coordinates.xPos,
            y: coordinates.yPos + serverSize - 2
        }) === "hub"
    );
    return { coordinates, position };
}

export const placeModuleToInventory = (state, params) => {
    let data = state;
    let { ctx } = params;
    let player = state.player || getPlayer(state, params);
    if (player && player.data) {
        let module = getModule(state, { floor: player.currentFloor });
        module.id = uniqid("module-");
        data.inventory.push(_.cloneDeep(module));
        setModule(state, _.cloneDeep(gameModules.availableSpace), null);
    }
    enterScene(ctx, "mainScene", state);
};

export function setupStartQuest(state, params) {
    let player = getPlayer(state, params);
    let { ctx } = params;
    player.currentFloor = `${player.id}_quest`;
    player.personalCoordinates = { xPos: 3, yPos: 3 };
    player.personalCoordinates.floor = player.currentFloor;
    player.coordinates = {
        xPos: player.personalCoordinates.xPos,
        yPos: player.personalCoordinates.yPos
    };
    params = { ...params, floor: player.currentFloor };
    state = { ...createQuestFromTemplate(state, { ...params, questTemplate: questTemplate, fog: true, coins: 100 }) };
    // state = addPlayerToFloor(state, params);
    let quest = {};
    quest.server = createServerFromTemplate(player.server);
    player.quest = quest;
    state = grantAccess(state, { ...params, ...player.coordinates });
    enterScene(ctx, "mainScene", state);
    return state;
}
export function getOwnerModule(state, params) {
    let { floor, x, y } = params;
    let ownerId;
    const access = state.access;
    _.forOwn(access[floor], (value, playerId) => {
        if (_.get(access, `${floor}[${playerId}][${x}][${y}]`)) {
            ownerId = playerId;
        }
    });
    return ownerId;
}

export let generateAvaiblePositions = (state, params) => {
    let availablePositions = [];
    for (let startX = 0; startX < COUNT_OF_PLAYERS_BY_WIDTH; startX++) {
        availablePositions[startX] = [];
        for (let startY = 0; startY < COUNT_OF_PLAYERS_BY_HEIGHT; startY++) {
            availablePositions[startX][startY] = _.get(
                _.find(_.values(state.players), {
                    startX: startX,
                    startY: startY
                }),
                "id",
                ""
            );
        }
    }
    return availablePositions;
};

export function defineStartPosition(state, params) {
    let getStart = size => {
        return _.floor(size / 2);
    };
    let positions = generateAvaiblePositions(state, params);
    if (!positions.length) {
        return { x: getStart(COUNT_OF_PLAYERS_BY_WIDTH), y: getStart(COUNT_OF_PLAYERS_BY_HEIGHT) };
    }
    let xStart = getStart(positions.length);
    let yStart = getStart(positions[0].length);
    let xLimit = xStart + 3;
    let yLimit = yStart + 3;
    for (let x = xStart; x < xLimit; x++) {
        for (let y = yStart; y < yLimit; y++) {
            if (_.get(positions, `[${x}][${y}]`) === "") {
                return { x, y };
            }
            if (x === xLimit - 1 && y === yLimit - 1 && xLimit < positions.length && yLimit < positions[x].length) {
                xLimit++;
                yLimit++;
                xStart--;
                x = xStart;
                yStart--;
                y = yStart;
            }
        }
    }
}

export function grantAccess(state, params) {
    let { floor, playerId, xPos, yPos } = params;
    let serverSize = getServerSizeFromFloor(floor);
    let access = state.access;
    if (!_.has(access, floor)) {
        access[floor] = {};
    }

    for (let x = xPos; x < xPos + serverSize; x++) {
        for (let y = yPos; y < yPos + serverSize; y++) {
            _.set(access, `[${floor}][${playerId}][${x}][${y}]`, true);
        }
    }
    return state;
}

export const assembleServerToInventory = (state, params) => {
    let player = state.player;
    let personalCoordinates = player.personalCoordinates;
    let data = player.data;
    let floor = personalCoordinates.floor;
    let numberOfFloor = floor.match(/(.*)x/) ? parseInt(floor.match(/(.*)x/)[1]) : 4;
    for (let x = personalCoordinates.xPos; x < personalCoordinates.xPos + numberOfFloor; x++) {
        for (let y = personalCoordinates.yPos; y < personalCoordinates.yPos + numberOfFloor; y++) {
            let module = getModule(state, { floor, x, y });
            if (personalCoordinates.floor.match(/_quest/gi) === null) {
                if (module.character !== gameModules.availableSpace.character) {
                    module.id = uniqid("module-");
                    data.inventory.push(_.cloneDeep(module));
                }
            } else {
                module.id = uniqid("module-");
                data.inventory.push(_.cloneDeep(module));
            }
            state = setModule(state, { ...gameModules.space }, { floor, x, y });
            state.access[floor][player.id][x][y] = undefined;
        }
    }
    stateManager.setState(state);
};

export const generatePlayerNickname = () => {
    let result = "";
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < NICKNAME_LENGTH; i++) {
        result += _.sample(alphabet);
    }
    return result;
};

export const getPlayerScreen = (state, params) => {
    let player = state.player;
    let coordinates = player.coordinates;
    let screen = "```\n";
    for (let x = coordinates.xPos - widthOfScreen; x <= coordinates.xPos + widthOfScreen; x++) {
        for (let y = coordinates.yPos - heightOfScreen; y <= coordinates.yPos + heightOfScreen; y++) {
            if (x === coordinates.xPos && y === coordinates.yPos) {
                screen += player.selectedCharacter.character;
            } else {
                let floor = player.currentFloor;
                params = { ...params, floor, x, y };
                let isThisPlayerServer = isPlayerHaveAccess(state, params);
                let module = getModule(state, params);
                if (module.isBroken) {
                    screen += module.characterOfBroken;
                } else if (!isThisPlayerServer) {
                    if (module.isVisible) {
                        screen += module.character;
                    } else if (isNeedFog(state, params)) {
                        screen += gameModules.fogged.character;
                        module.isVisible = false;
                    } else {
                        screen += module.character;
                        module.isVisible = true;
                    }
                } else {
                    screen += module.character;
                }
            }
        }
        screen += "\n";
    }
    screen += "```";
    screen += getAdditionalInformation(state, params);
    return screen;
};
export function generateBorders(enemyServer) {
    let mapLength = enemyServer[0].length + 10;
    let mapWidth = enemyServer.length + 10;
    let map = [];
    for (let i = 0; i < mapWidth; i++) {
        map[i] = [];
        for (let j = 0; j < mapLength; j++) {
            if (i >= 5 && i < mapWidth - 5 && j >= 5 && j < mapLength - 5) {
                map[i][j] = enemyServer[i - 5][j - 5];
            } else if (i >= 3 && i < mapWidth - 3 && j >= 3 && j < mapLength - 3) {
                map[i][j] = gameModules.way;
            } else if (i >= 2 && i < mapWidth - 2 && j >= 2 && j < mapLength - 2) {
                map[i][j] = gameModules.denied;
            } else map[i][j] = gameModules.space;
        }
    }
    return map;
}

const getAdditionalInformation = (state, params) => {
    let player = state.player;
    let floor = player.currentFloor;
    let coordinates = player.coordinates;
    let x = coordinates.xPos;
    let y = coordinates.yPos;
    params = { ...params, floor, x, y };

    let module = getModule(state, params);
    let availableCash;
    let ownerId;
    let response = "\n";

    ownerId = getOwnerModule(state, params);
    // getSessionByPlayerId("");
    if (_.includes(floor, "_quest")) {
        if (module.character === gameModules.wallet.character) {
            availableCash = player.currentQuest.coins;
        } else if (module.character === gameModules.miner.character) {
            availableCash = Math.floor(player.currentQuest.coins / 2) === 0 ? 0 : Math.floor(player.currentQuest.coins / 2);
        }
    } else if (!_.isNaN(ownerId)) {
        if (module.character === gameModules.wallet.character) {
            let playersArray = _.values(state.players);
            availableCash = playersArray[ownerId].data.coins;
        } else if (module.character === gameModules.miner.character) {
            availableCash = module.volume;
        }
    }
    let owner = ownerId === player.id ? translate(state, "texts.you") : translate(state, "texts.system");
    let currentQuest = _.get(player, "currentQuest.name")
        ? translate(state, `texts.quests.${player.currentQuest.name}.description`)
        : translate(state, "texts.quests.finishedQuests");
    let information = {
        character: module.character,
        moduleName: translate(state, `texts.modules.${module.name}`),
        owner: owner,
        hacked: module.isBroken ? translate(state, "texts.yes") : translate(state, "texts.no"),
        currentQuest: currentQuest
    };
    let isThisPlayerServer = isPlayerHaveAccess(state, { ...params, x, y }) || false;
    if (isNeedFog(state, { ...params, x, y }) && !isThisPlayerServer) {
        response += translate(state, "texts.utils.infoEnemyModule", information);
    } else {
        if (
            module.character === gameModules.wallet.character ||
            module.character === gameModules.storage.character ||
            module.character === gameModules.miner.character
        ) {
            if (module.character === gameModules.wallet.character || module.character === gameModules.miner.character) {
                information.storage = `${Math.floor(availableCash)} 💰`;
            } else {
                information.storage = `${module.programs.length} programs`;
            }
            response += translate(state, "texts.utils.infoStorage", information);
        } else {
            response += translate(state, "texts.utils.info", information);
        }
    }
    return response;
};

export const isNeedFog = (ctx, currentFloor, x, y) => {
    let ignoredModules = [gameModules.space, gameModules.way, gameModules.availableSpace, gameModules.denied];
    return !_.includes(ignoredModules, getModule(ctx, { floor: currentFloor, x, y }));
};

export const hackModule = (state, params) => {
    let { currentFloor: floor, x, y } = params.program.module;
    let module = getModule(state, { ...params, floor, x, y });
    state = setModule(state, { ...module, isBroken: true }, { ...params, floor, x, y });
    state = addXPToPlayerByProgramLevel(state, { ...params, ...params.program });
    return state;
};

export const addXPToPlayerByProgramLevel = (state, params) => {
    let player = getPlayer(state, params);
    let { level } = params.program;
    player.XP += player.level === level ? 10 : player.level > level ? 5 : 20;
    calculateLevelOfPlayer(state, params);
    return state;
};

export const addXPToPlayer = (state, params) => {
    let player = getPlayer(state, params);
    player.XP += params.XP;
    state = calculateLevelOfPlayer(state, params);
    return state;
};

export const calculateLevelOfPlayer = (state, params) => {
    let player = getPlayer(state, params);
    if (player.XP >= (2 ** player.level - 1) * 100) {
        player.level++;
        let levelUpText = translate(state, "texts.utils.levelUp", { level: player.level }, params);
        replyWithMarkdown(levelUpText, params);
    }
    return state;
};

export const detect = (state, params) => {
    //todo check is it work correctly
    if (!_.isObject(params, "program.module")) {
        return state;
    }
    let { currentFloor, x, y } = params.program.module;
    let owner;
    if (currentFloor === "4x4") {
        owner = getOwnerModule(state, { floor: currentFloor, x, y });
    } else if (_.includes(currentFloor, "fight")) {
        owner = getOwnerModule(state, { floor: currentFloor, x, y });
    } else {
        owner = getOwnerModule(state, { floor: currentFloor, x, y });
    }
    let detecting = 0;
    if (_.get(owner, "server")) {
        _.each(owner.server, serverRow => {
            _.each(serverRow, module => {
                if (translate(state, `texts.modules.${module.name}`).toUpperCase() === gameModules.antivirus.name.toUpperCase()) {
                    detecting += module.detecting;
                }
            });
        });
    }

    if (_.random(0, programs.hack.noise) < _.random(0, detecting)) {
        let discoveredText = translate(state, "texts.utils.discovered");
        replyWithMarkdown(discoveredText, params);
        if (currentFloor.match(/(.*)x/)) {
            // if (owner.telegramId) {
            //     ctx.telegram.sendMessage(owner.telegramId, translate(state, "texts.utils.serverUnderAttack"));
            // }
        } else if (_.includes(currentFloor, "fight")) {
            //todo replace this without settimeout
            // let coordinates = ctx.session.player.personalCoordinates;
            // let xPos = coordinates.xPos;
            // let yPos = coordinates.yPos;
            // let ignoredModules = [gameModules.space, gameModules.way, gameModules.availableSpace, gameModules.denied];
            // setTimeout(() => {
            //     for (let x = xPos; x < xPos + 4; x++) {
            //         for (let y = yPos; y < yPos + 4; y++) {
            //             let module = ctx.map[currentFloor][x][y];
            //             if (
            //                 !(
            //                     _.includes(ignoredModules, ctx.map[currentFloor][x - 1][y]) ||
            //                     _.includes(ignoredModules, ctx.map[currentFloor][x + 1][y]) ||
            //                     _.includes(ignoredModules, ctx.map[currentFloor][x][y - 1]) ||
            //                     _.includes(ignoredModules, ctx.map[currentFloor][x][y + 1])
            //                 )
            //             ) {
            //                 module.isVisible = false;
            //             }
            //             module.isBroken = false;
            //             module.isStolen = false;
            //         }
            //     }
            //     replyWithMarkdown(translate(state, "texts.utils.modulesRepaired"));
            // }, 60000);
        } else {
            state.player.infamousLevel++;
        }
    }
    return state;
};

export const calculateProgramCount = playerMemory => {
    return 10 + (playerMemory * (playerMemory + 1)) / 2;
};

export const showFloor = floor => {
    // let res = `${floor}:\n`;
    let res = "<p>";
    for (let i = 0; i < map[floor].length; i++) {
        for (let j = 0; j < map[floor][i].length; j++) {
            res += map[floor][i][j].character;
        }
        res += "<br>";
    }
    res += "</p>";
    return res;
};

export const createQuestFromTemplate = (state, params) => {
    let { questTemplate, fog, coins, playerId } = params;
    let player = getPlayer(state, params);

    player.quest = {};
    player.coordinates = {
        xPos: 3,
        yPos: 3
    };
    let floor = `${player.id}_quest`;
    _.set(player, "quest.server.coins", coins);
    player.currentFloor = floor;
    state.map[floor] = _.cloneDeep(questTemplate);
    state = grantAccess(state, { floor: player.currentFloor, playerId: player.id, ...player.coordinates });
    // idQuest++;
    if (fog) {
        state = createFogOfWar(state, params);
    }
    return state;
};
