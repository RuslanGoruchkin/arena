import { combineWeapon, weapons_bodies, free_hand } from "./weapons";
import { combineShield, shields_bodies } from "./shields";
import { combineArmor, armors_bodies } from "./armors";

export const characters = {
    defaultCharacter: {
        character: "😎",
        class: "defaultCharacter",
        baseStrength: 0,
        baseDexterity: 0,
        baseIntelligence: 0,
        baseWisdom: 0,
        baseVitality: 0
    },
    warrior: {
        onTick: (state, params) => {
            return state;
        },
        character: "👨‍🚒",
        class: "warrior",
        classes: {
            warrior: 1,
            mage: 0,
            evangelist: 0,
            prophet: 0,
            nomad: 0
        },
        baseStrength: 7,
        baseDexterity: 5,
        baseIntelligence: 6,
        baseWisdom: 3,
        baseVitality: 4,
        name: "",
        nickname: "",
        levelUp: 10,
        age: 0,
        belt: ["HP Pot", "HP Pot", "SP Pot"],
        inventory: [combineWeapon(1, weapons_bodies.crossbow)],
        armor: combineArmor(1, armors_bodies.plate),
        rightHand: combineWeapon(1, weapons_bodies.bastard),
        leftHand: combineWeapon(1, weapons_bodies.bastard)
    },
    mage: {
        onTick: (state, params) => {
            return state;
        },
        character: "👩‍🔧",
        class: "mage",
        classes: {
            warrior: 0,
            mage: 1,
            evangelist: 0,
            prophet: 0,
            nomad: 0
        },
        description: "",
        baseStrength: 4,
        baseDexterity: 7,
        baseIntelligence: 5,
        baseWisdom: 6,
        baseVitality: 3,
        name: "",
        nickname: "",
        levelUp: 8,
        age: 0,
        belt: ["SP Pot", "MP Pot", "Knife", "Knife", "Knife"],
        inventory: ["longbow"],
        armor: combineArmor(1, armors_bodies.jacket),
        rightHand: combineWeapon(1, weapons_bodies.wand),
        leftHand: combineWeapon(1, weapons_bodies.dagger)
    },
    evangelist: {
        onTick: (state, params) => {
            return state;
        },
        character: "🕵️",
        class: "evangelist",
        classes: {
            warrior: 0,
            mage: 0,
            evangelist: 1,
            prophet: 0,
            nomad: 0
        },
        description: "",
        baseStrength: 5,
        baseDexterity: 3,
        baseIntelligence: 7,
        baseWisdom: 4,
        baseVitality: 6,
        name: "",
        nickname: "",
        levelUp: 9,
        age: 0,
        belt: ["HP Pot", "MP Pot", "Dart Spear"],
        inventory: [combineWeapon(1, weapons_bodies.wand)],
        armor: combineArmor(1, armors_bodies.chest),
        rightHand: combineWeapon(1, weapons_bodies.axe),
        leftHand: combineShield(1, shields_bodies.buckler)
    },
    prophet: {
        onTick: (state, params) => {
            return state;
        },
        character: "👩‍🔬",
        class: "prophet",
        classes: {
            warrior: 0,
            mage: 0,
            evangelist: 0,
            prophet: 1,
            nomad: 0
        },
        description: "",
        baseStrength: 3,
        baseDexterity: 6,
        baseIntelligence: 4,
        baseWisdom: 7,
        baseVitality: 5,
        name: "",
        nickname: "",
        levelUp: 8,
        age: 0,
        belt: ["SP Pot", "HP Pot", "Wave Scroll"],
        inventory: [combineWeapon(1, weapons_bodies.whip)],
        armor: combineArmor(1, armors_bodies.robe),
        rightHand: combineWeapon(1, weapons_bodies.rapier),
        leftHand: combineShield(1, shields_bodies.parma)
    },
    nomad: {
        onTick: (state, params) => {
            return state;
        },
        character: "👨‍🎤",
        class: "nomad",
        classes: {
            warrior: 0,
            mage: 0,
            evangelist: 0,
            prophet: 0,
            nomad: 1
        },
        description: "",
        baseStrength: 6,
        baseDexterity: 4,
        baseIntelligence: 3,
        baseWisdom: 5,
        baseVitality: 7,
        name: "",
        nickname: "",
        age: 0,
        levelUp: 10,
        belt: ["heal", "manna", "web"],
        inventory: ["knuckle", "knuckle"],
        armor: "chain",
        rightHand: "rod",
        leftHand: "heater"
    }
};
