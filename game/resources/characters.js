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
        description: "",
        baseStrength: 7,
        baseDexterity: 5,
        baseIntelligence: 6,
        baseWisdom: 3,
        baseVitality: 4,
        name: "",
        nickname: "",
        age: 0,
        belt: ["heal", "heal", "stamina"],
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
        description: "",
        baseStrength: 4,
        baseDexterity: 7,
        baseIntelligence: 5,
        baseWisdom: 6,
        baseVitality: 3,
        name: "",
        nickname: "",
        age: 0,
        belt: ["stamina", "mana", "knife", "knife", "knife"],
        inventory: [combineWeapon(1, weapons_bodies.longbow)],
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
        description: "",
        baseStrength: 5,
        baseDexterity: 3,
        baseIntelligence: 7,
        baseWisdom: 4,
        baseVitality: 6,
        name: "",
        nickname: "",
        age: 0,
        belt: ["heal", "mana", "dart"],
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
        description: "",
        baseStrength: 3,
        baseDexterity: 6,
        baseIntelligence: 4,
        baseWisdom: 7,
        baseVitality: 5,
        name: "",
        nickname: "",
        age: 0,
        belt: ["stamina", "mana", "wave"],
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
        description: "",
        baseStrength: 6,
        baseDexterity: 4,
        baseIntelligence: 3,
        baseWisdom: 5,
        baseVitality: 7,
        name: "",
        nickname: "",
        age: 0,
        belt: ["heal", "mana", "web"],
        inventory: [combineWeapon(1, weapons_bodies.knuckle), combineWeapon(1, weapons_bodies.knuckle)],
        armor: combineArmor(1, armors_bodies.chain),
        rightHand: combineWeapon(1, weapons_bodies.rod),
        leftHand: combineShield(1, shields_bodies.heater)
    }
};
