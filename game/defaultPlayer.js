import _ from "lodash";

export let defaultPlayer = {
    data: {
        tick: 0,
        hungerTick: 0,
        thirstTick: 0,
        sleepyTick: 0,
        trainTick:{
            strength: 0,
            dexterity: 0,
            intellect: 0,
            wisdom: 0,
            vitality:0
        },
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
        //introPlayed: false,
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
    language: "ru",
    walletsCount: 0,
    balanceCoin: 0,
    balanceToken: 0,
    level: 1,
    infamousLevel: 0,
    XP: 0,
    nickname: "",
    selectedCharacter: "",
    selectedComics: "characterHistory",
    comics: ["worldHistory"]
};

export const getDefaultPlayer = () => {
    return _.cloneDeep(defaultPlayer);
};
