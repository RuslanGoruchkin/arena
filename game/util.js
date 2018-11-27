/* eslint-disable destructuring/no-rename */
import _ from "lodash";
import { createServerFromInventory, createServerFromTemplate } from "./server";
import { characters } from "./resources/characters";
import { getDefaultPlayer } from "./defaultPlayer";
import { addPlayerToFloor, createFogOfWar } from "./map";
import { gameModules } from "./gameModules";
import { basementServers } from "./resources/templates/basementServers";
import { programs } from "./resources/programs";
import execPromise from "@chmontgomery/exec-promise";
import { getModule, getPlayer, isPlayerHaveAccess, setModule, t } from "./helpers/ctx";
import { questTemplate } from "./resources/templates/questTemplate";
import stateManager from "./stateManager";
import { replyWithMarkdown } from "./helpers/TelegramApiHelpers";

let uniqid = require("uniqid");
let debug = require("debug")("bot:util");

export let goods = [];
export let basements = ["dangerousProcessors", "valleyOfMoney", "programParadise", "miningFarm"];
export let widthOfScreen = 3;
export let heightOfScreen = 3;
export const NICKNAME_LENGTH = 8;
const { COUNT_OF_PLAYERS_BY_WIDTH, COUNT_OF_PLAYERS_BY_HEIGHT } = process.env;

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

    player.id = ctx.from.id;
    params = { ...params, playerId: player.id };
    ctx.session = {
        ...ctx.session,
        playerId: player.id
    };
    player.nickname = generatePlayerNickname();
    player.selectedCharacter = getItemByClassCaption(character, characters);
    player.telegramId = ctx.from.id;
    //player.userDonateLink = await userLink(player.id);
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
    return state;
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
    return state;
}
export function getOwnerModule(state, params) {
    let { floor, x, y } = params;
    let ownerId;
    const { access } = state;
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
    const { floor, playerId, xPos, yPos } = params;
    const serverSize = getServerSizeFromFloor(floor);
    const access = state.access;
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

export const generatePlayerNickname = () => {
    let result = "";
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < NICKNAME_LENGTH; i++) {
        result += _.sample(alphabet);
    }
    return result;
};

const getAdditionalInformation = (state, params) => {
    const { player } = state;
    const floor = player.currentFloor;
    const coordinates = player.coordinates;
    const x = coordinates.xPos;
    const y = coordinates.yPos;
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
    let owner = ownerId === player.id ? t(state, "texts.you") : t(state, "texts.system");
    let currentQuest = _.get(player, "currentQuest.name")
        ? t(state, `texts.quests.${player.currentQuest.name}.description`)
        : t(state, "texts.quests.finishedQuests");
    let information = {
        character: module.character,
        moduleName: t(state, `texts.modules.${module.name}`),
        owner: owner,
        hacked: module.isBroken ? t(state, "texts.yes") : t(state, "texts.no"),
        currentQuest: currentQuest
    };
    let isThisPlayerServer = isPlayerHaveAccess(state, { ...params, x, y }) || false;
    if (isNeedFog(state, { ...params, x, y }) && !isThisPlayerServer) {
        response += t(state, "texts.utils.infoEnemyModule", information);
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
            response += t(state, "texts.utils.infoStorage", information);
        } else {
            response += t(state, "texts.utils.info", information);
        }
    }
    return response;
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
        let levelUpText = t(state, "texts.utils.levelUp", { level: player.level }, params);
        replyWithMarkdown(levelUpText, params, state);
    }
    return state;
};

export const calculateProgramCount = playerMemory => {
    return 10 + (playerMemory * (playerMemory + 1)) / 2;
};

export const addMenuButtons = buttons => {
    buttons.push([t(state, "menu.character"), t(state, "menu.inventory"), t(state, "menu.menu")]);
    return buttons;
};
