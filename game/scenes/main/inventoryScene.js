import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { enterScene, keyboard, stateWrapper, t } from "../../helpers";
import { consumables } from "../../resources/consumables";

const inventoryScene = new Scene("inventoryScene");

inventoryScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let selectedCharacter = player.selectedCharacter;
        let rightHand = player.selectedCharacter.rightHand.name || "Fist";
        let leftHand = player.selectedCharacter.leftHand.name || "Fist";
        let inventory = "";
        let belt = "";
        _.each(player.selectedCharacter.inventory, item => {
            inventory += item.name + "\n";
        });
        _.each(selectedCharacter.belt, item => {
            let consumable = consumables[item];
            belt += consumable.name + " ";
        });
        let message = t(state, "texts.mainScenes.inventoryScene.descriptionCharacter", {
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
            armor: player.selectedCharacter.armor.name,
            rightHand: rightHand,
            leftHand: leftHand,
            inventory: inventory,
            belt: belt
        });
        return keyboard(
            message,
            [[t(state, "texts.back")], [t(state, "texts.equip")], [t(state, "texts.unequip")]],
            {
                playerId: state.player.id
            },
            state
        );
    })
);

inventoryScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        switch (text) {
            case t(state, "texts.back"):
                return enterScene(ctx, "mainScene", state);
            case t(state, "texts.equip"):
                return enterScene(ctx, "equipScene", state);
            case t(state, "texts.unequip"):
                return enterScene(ctx, "unequipScene", state);
            default:
                return redirectToOopsScene(ctx, state);
        }
    })
);

module.exports = inventoryScene;
