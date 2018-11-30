import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { enterScene, keyboard, redirectToOopsScene, stateWrapper, t } from "../../helpers";
import { consumables } from "../../resources/consumables";

const characterScene = new Scene("characterScene");

characterScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let selectedCharacter = player.selectedCharacter;
        let message = "";
        let belt = "";
        _.each(selectedCharacter.belt, item => {
            let consumable = consumables[item];
            belt += consumable.name + " ";
        });
        message += t(state, "texts.mainScenes.characterScene.descriptionCharacter", {
            charClass: t(state, `menu.characters.${selectedCharacter.class}`),
            nickname: player.nickname,
            level: player.level,
            xp: player.XP,
            coins: player.data.coins,
            tokens: player.data.tokens,
            strength: player.selectedCharacter.baseStrength,
            dexterity: player.selectedCharacter.baseDexterity,
            intelligence: player.selectedCharacter.baseIntelligence,
            wisdom: player.selectedCharacter.baseWisdom,
            vitality: player.selectedCharacter.baseVitality,
            rightHandName: player.selectedCharacter.rightHand.name,
            hp: player.data.hp,
            mp: player.data.mp,
            belt: belt
        });
        return keyboard(message, [[t(state, "texts.back")]], { playerId: state.player.id }, state);
    })
);

characterScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        switch (text) {
            case t(state, "texts.back"):
                return enterScene(ctx, "mainMenuScene", state);
            default:
                return redirectToOopsScene(ctx, state);
        }
    })
);

module.exports = characterScene;
