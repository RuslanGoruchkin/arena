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
        tokens: 0,
        completedQuests: {},
        droppedQuests: {}
    },
    currentRoom: "cell",
    currentQuest: {
        name: "",
        introScene: "",
        outroScene: "",
        failed: false,
        award: {
            XP: 0,
            coins: 0,
            tokens: 0
        },
        award2: {
            XP: 0,
            coins: 0,
            tokens: 0
        }
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
        baseVitality: 0
    },
    strength: 1,
    dexterity: 1,
    intelligence: 1,
    wisdom: 1,
    vitality: 1,
    inventory: {
        bigNail: {
            key: "bigNail",
            name: "bigNail",
            type: "weapon",
            minLvl: 0,
            minDamage: 1,
            maxDamage: 3,
            bonus: {
                strength: 1
            },
            price: 20,
            shop: true,
            minSellLvl: 0,
            maxSellLvl: 5,
            equipped: true
        }
    },
    fastEquipItem: {},
    rightHand: {
        key: "bigNail",
        name: "bigNail",
        type: "weapon",
        minLvl: 0,
        minDamage: 1,
        maxDamage: 3,
        bonus: {
            strength: 1
        },
        price: 20,
        shop: true,
        minSellLvl: 0,
        maxSellLvl: 5,
        equipped: true
    },
    leftHand: {},
    armor: {},
    scrolls: {},
    potions: {},
    selectedComics: "characterHistory",
    comics: ["worldHistory"]
};

export const getDefaultPlayer = () => {
    return _.cloneDeep(defaultPlayer);
};
