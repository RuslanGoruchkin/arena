import _ from "lodash";

export let defaultPlayer = {
    data: {
        tick: 0,
        hungryTick: 0,
        thirstyTick: 0,
        sleepyTick: 0,
        trainTick: {
            strength: 0,
            dexterity: 0,
            intellect: 0,
            wisdom: 0,
            vitality: 0
        },
        hp: 1,
        max_hp: 1,
        sp: 1,
        max_sp: 1,
        mp: 1,
        max_mp: 1,
        poise: 1,
        max_poise: 1,
        timeoutStatus: false,
        activity: "",
        timeout: 0,
        gameSpeed: 1000,
        gameSpeedMultiplier: 1,
        gamePaused: true,
        coinsPerTick: 42,
        wallets: [],
        inventory: [],
        coins: 50,
        tokens: 0
    },
    sleepy: false,
    hungry: false,
    thirsty: false,
    thirstyTime: 200,
    hungryTime: 400,
    sleepyTime: 600,
    language: "ru",
    walletsCount: 0,
    balanceCoin: 50,
    balanceToken: 0,
    level: 1,
    infamousLevel: 0,
    XP: 0,
    nickname: "",
    selectedCharacter: {
        class: "default",
        baseStrength: 0,
        baseDexterity: 0,
        baseIntelligence: 0,
        baseWisdom: 0,
        baseVitality: 0,
        belt: [],
        equipment: [],
        inventory: [],
        fastEquipItem: {},
        rightHand: {},
        leftHand: {},
        armor: {}
    },
    strength: 1,
    dexterity: 1,
    intelligence: 1,
    wisdom: 1,
    vitality: 1,
    selectedComics: "characterHistory",
    comics: ["worldHistory"]
};

export const getDefaultPlayer = () => {
    return _.cloneDeep(defaultPlayer);
};
