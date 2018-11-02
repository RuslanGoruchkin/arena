import { gameModules } from "../gameModules";
import { programs } from "./programs";

export const characters = {
    defaultCharacter: {
        character: "😎",
        class: "defaultCharacter",
        processing: 5,
        speed: 5,
        logic: 5,
        memory: 5,
        attention: 5,
        server: [
            [gameModules.availableSpace, gameModules.availableSpace, gameModules.availableSpace, gameModules.availableSpace],
            [gameModules.availableSpace, gameModules.availableSpace, gameModules.availableSpace, gameModules.availableSpace],
            [gameModules.availableSpace, gameModules.availableSpace, gameModules.availableSpace, gameModules.availableSpace],
            [gameModules.availableSpace, gameModules.availableSpace, gameModules.availableSpace, gameModules.availableSpace]
        ]
    },
    cyberWarrior: {
        onTick: (state, params) => {
            return state;
        },
        character: "👨‍🚒",
        class: "cyberWarrior",
        description: "",
        processing: 7,
        speed: 5,
        logic: 6,
        memory: 3,
        attention: 4,
        name: "",
        nickname: "",
        age: 0,
        specialProgram: programs.warriorHack,
        server: [
            [gameModules.availableSpace, gameModules.miner, gameModules.processor, gameModules.availableSpace],
            [gameModules.miner, gameModules.wallet, gameModules.wallet, gameModules.processor],
            [gameModules.processor, gameModules.storage, gameModules.wallet, gameModules.miner],
            [gameModules.availableSpace, gameModules.processor, gameModules.miner, gameModules.availableSpace]
        ]
    },
    techMage: {
        onTick: (state, params) => {
            return state;
        },
        character: "👩‍🔧",
        class: "techMage",
        description: "",
        processing: 4,
        speed: 7,
        logic: 5,
        memory: 6,
        attention: 3,
        name: "",
        nickname: "",
        age: 0,
        specialProgram: programs.mageHack,
        server: [
            [gameModules.availableSpace, gameModules.firewall, gameModules.miner, gameModules.availableSpace],
            [gameModules.processor, gameModules.storage, gameModules.antivirus, gameModules.processor],
            [gameModules.processor, gameModules.storage, gameModules.wallet, gameModules.processor],
            [gameModules.availableSpace, gameModules.miner, gameModules.firewall, gameModules.availableSpace]
        ]
    },
    cryptoEvangelist: {
        onTick: (state, params) => {
            return state;
        },
        character: "🕵️",
        class: "cryptoEvangelist",
        description: "",
        processing: 5,
        speed: 3,
        logic: 7,
        memory: 4,
        attention: 6,
        name: "",
        nickname: "",
        age: 0,
        specialProgram: programs.evangelistVirus,
        server: [
            [gameModules.availableSpace, gameModules.miner, gameModules.miner, gameModules.availableSpace],
            [gameModules.miner, gameModules.antivirus, gameModules.storage, gameModules.processor],
            [gameModules.firewall, gameModules.wallet, gameModules.antivirus, gameModules.miner],
            [gameModules.availableSpace, gameModules.firewall, gameModules.miner, gameModules.availableSpace]
        ]
    },
    singularityProphet: {
        onTick: (state, params) => {
            return state;
        },
        character: "👩‍🔬",
        class: "singularityProphet",
        description: "",
        processing: 3,
        speed: 6,
        logic: 4,
        memory: 7,
        attention: 5,
        name: "",
        nickname: "",
        age: 0,
        specialProgram: programs.prophetScan,
        server: [
            [gameModules.availableSpace, gameModules.miner, gameModules.firewall, gameModules.availableSpace],
            [gameModules.processor, gameModules.antivirus, gameModules.wallet, gameModules.antivirus],
            [gameModules.processor, gameModules.storage, gameModules.firewall, gameModules.processor],
            [gameModules.availableSpace, gameModules.miner, gameModules.miner, gameModules.availableSpace]
        ]
    },
    digitalNomad: {
        onTick: (state, params) => {
            return state;
        },
        character: "👨‍🎤",
        class: "digitalNomad",
        description: "",
        processing: 6,
        speed: 4,
        logic: 3,
        memory: 5,
        attention: 7,
        name: "",
        nickname: "",
        age: 0,
        specialProgram: programs.nomadHack,
        server: [
            [gameModules.availableSpace, gameModules.processor, gameModules.firewall, gameModules.availableSpace],
            [gameModules.miner, gameModules.antivirus, gameModules.wallet, gameModules.firewall],
            [gameModules.firewall, gameModules.storage, gameModules.antivirus, gameModules.miner],
            [gameModules.availableSpace, gameModules.firewall, gameModules.processor, gameModules.availableSpace]
        ]
    }
};
