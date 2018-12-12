import execPromise from "@chmontgomery/exec-promise";
import _ from "lodash";
import { characters } from "../resources/characters";
import { getDefaultPlayer } from "../resources/defaultPlayer";
import { errorHandler, replyWithMarkdown, t } from "./";
export const NICKNAME_LENGTH = 8;
let debug = require("debug")("bot:player-helpers");

export let getPlayer = (state, params) => _.get(state, `players.${params.playerId}`, {});
export let getPlayerState = (state, params) => _.get(getPlayer(state, params), "data", {});

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
        let levelUpText = t(state, "texts.utils.levelUp", { level: player.level }, params);
        replyWithMarkdown(levelUpText, params, state);
    }
    return state;
};
export const getItemByClassCaption = (itemCaption, collection) => _.find(collection, { class: itemCaption });
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
        .catch(errorHandler);
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
    player.language = params.language;
    player.nickname = generatePlayerNickname();
    player.selectedCharacter = getItemByClassCaption(character, characters);
    player.telegramId = ctx.from.id;

    player.userDonateLink = await userLink(player.id);
    return state;
};

export const generatePlayerNickname = () => {
    let result = "";
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < NICKNAME_LENGTH; i++) {
        result += _.sample(alphabet);
    }
    return result;
};
export const calculateProgramCount = playerMemory => {
    return 10 + (playerMemory * (playerMemory + 1)) / 2;
};

export const statusMessage = state => {
    let player = state.player;
    let hydration = "";
    let satiety = "";
    let awakeness = "";
    let levelUpExp = player.selectedCharacter.levelUp * 2 ** player.level - player.selectedCharacter.levelUp;
    let playerExp = player.XP + "/" + levelUpExp;
    if (player.hungry) {
        satiety = "Hungry";
    } else {
        let satietyCapacity = player.data.hungryTick + player.hungryTime - state.currentTick;
        satiety = "Satiety: " + "\t\t\t\t\t\t\t\t" + satietyCapacity + "/" + player.hungryTime;
    }
    if (player.sleepy) {
        awakeness = "Sleepy";
    } else {
        let awakenessCapacity = player.sleepyTime + player.data.sleepyTick - state.currentTick;
        awakeness = "Awakeness: " + awakenessCapacity + "/" + player.sleepyTime;
    }
    if (player.thirsty) {
        hydration = "Thirsty";
    } else {
        let hydrationCapacity = player.thirstyTime + player.data.thirstyTick - state.currentTick;
        hydration = "Hydration: " + "\t\t" + hydrationCapacity + "/" + player.thirstyTime;
    }

    let selectedCharacter = player.selectedCharacter;
    let charClass = "";
    _.forEach(selectedCharacter.classes, function(classLvl, key) {
        if (classLvl > 0) {
            charClass += "\n" + t(state, `menu.characters.${key}`) + " " + classLvl + " lvl";
        }
    });
    let status = t(state, "texts.status", {
        charClass: charClass,
        nickname: player.nickname,
        coins: player.data.coins,
        tokens: player.data.tokens,
        hp: player.data.hp,
        sp: player.data.sp,
        mp: player.data.mp,
        level: player.level,
        xp: playerExp,
        hydration: hydration,
        satiety: satiety,
        awakeness: awakeness
    });
    return replyWithMarkdown(status, { playerId: state.player.id }, state);
};
