import { getPlayer } from "../helpers";

export let conditions = {
    TBStrength: {
        name: "Strength training +20%",
        transformation: (state, params) => {
            let player = getPlayer(state, params);
            player.selectedCharacter.strength = Math.round(player.selectedCharacter.strength * 1.2);
            return player;
        }
    },
    TBDexterity: {
        name: "Dexterity training +20%",
        transformation: (state, params) => {
            let player = getPlayer(state, params);
            player.selectedCharacter.dexterity = Math.round(player.selectedCharacter.dexterity * 1.2);
            return player;
        }
    },
    TBWisdom: {
        name: "Wisdom training +20%",
        transformation: (state, params) => {
            let player = getPlayer(state, params);
            player.selectedCharacter.wisdom = Math.round(player.selectedCharacter.wisdom * 1.2);
            return player;
        }
    },
    TBIntelligence: {
        name: "Intelligence training +20%",
        transformation: (state, params) => {
            let player = getPlayer(state, params);
            player.selectedCharacter.intelligence = Math.round(player.selectedCharacter.intelligence * 1.2);
            return player;
        }
    },
    TBVitality: {
        name: "Vitality training +20%",
        transformation: (state, params) => {
            let player = getPlayer(state, params);
            player.selectedCharacter.vitality = Math.round(player.selectedCharacter.vitality * 1.2);
            return player;
        }
    }
};
