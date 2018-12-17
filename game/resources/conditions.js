export const conditions = {
    TBonusStrength: player => {
        player.selectedCharacter.strength *= 1.2;
        return player;
    },
    TBonusDexterity: player => {
        player.selectedCharacter.dexterity *= 1.2;
        return player;
    },
    TBonusWisdom: player => {
        player.selectedCharacter.wisdom *= 1.2;
        return player;
    },
    TBonusIntelligence: player => {
        player.selectedCharacter.intelligence *= 1.2;
        return player;
    },
    TBonusVitality: player => {
        player.selectedCharacter.vitality *= 1.2;
        return player;
    }
};
