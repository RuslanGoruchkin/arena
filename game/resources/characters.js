import { combineWeapon, weapons_bodies, free_hand } from "./weapons";
import { combineShield, shields_bodies } from "./shields";
import { combineArmor, armors_bodies } from "./armors";

export const characters = {
    defaultCharacter: {
        character: "😎",
        class: "defaultCharacter",
        strength: 0,
        dexterity: 0,
        intelligence: 0,
        wisdom: 0,
        vitality: 0
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
        strength: 7,
        dexterity: 5,
        intelligence: 6,
        wisdom: 3,
        vitality: 4,
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
        strength: 4,
        dexterity: 7,
        intelligence: 5,
        wisdom: 6,
        vitality: 3,
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
        strength: 5,
        dexterity: 3,
        intelligence: 7,
        wisdom: 4,
        vitality: 6,
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
        strength: 3,
        dexterity: 6,
        intelligence: 4,
        wisdom: 7,
        vitality: 5,
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
        strength: 6,
        dexterity: 4,
        intelligence: 3,
        wisdom: 5,
        vitality: 7,
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
