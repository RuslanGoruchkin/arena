import _ from "lodash";

export let defaultPlayer = {
    data: {
        tick: 0,
        dailyTick: 0,
        gameSpeed: 1000,
        gameSpeedMultiplier: 1,
        gamePaused: true,
        coinsPerTick: 42,
        wallets: [],
        programsInMemory: [],
        hackStatus: false,
        inventory: [],
        baseHack: 100,
        coins: 50,
        tokens: 0,
        electricityTotalPrice: 0,
        isOrderPaid: true,
        antivirusQuest: false,
        totalInfluence: 0,
        completedQuests: {},
        droppedQuests: {}
    },
    currentFloor: {},
    personalCoordinates: {
        floor: "",
        xPos: "",
        yPos: ""
    },
    currentQuest: {
        //introPlayed: false,
        name: "",
        introScene: "",
        outroScene: "",
        failed: false,
        award: {
            XP: 0,
            coins: 0,
            tokens: 0,
            programs: [],
            modules: [],
            drugs: []
        },
        award2: {
            XP: 0,
            coins: 0,
            tokens: 0,
            programs: [],
            modules: [],
            drugs: []
        }
    },
    language: "ru",
    walletsCount: 0,
    balanceCoin: 0,
    balanceToken: 0,
    level: 1,
    infamousLevel: 0,
    XP: 0,
    moduleForBuy: {
        name: {},
        level: 0,
        price: 0
    },
    attackPrograms: [],
    attackProgram: {
        isCasting: false,
        name: ""
    },

    nickname: "",
    selectedCharacter: "",
    selectedComics: "characterHistory",
    corporation: "Resistance",
    finalFightWasStarted: false,
    alreadyStolen: false,
    comics: ["worldHistory"]
};

export const getDefaultPlayer = () => {
    return _.cloneDeep(defaultPlayer);
};
