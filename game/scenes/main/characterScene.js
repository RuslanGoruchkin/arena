import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { enterScene, keyboard, redirectToOopsScene, replyWithMarkdown, stateWrapper, t } from "../../helpers";
import { consumables } from "../../resources/consumables";
import { items } from "../../resources/items";
import stateManager from "../../stateManager";

const characterScene = new Scene("characterScene");

characterScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let selectedCharacter = player.selectedCharacter;
        let message = "";
        let belt = "";
        let rightHand = items[selectedCharacter.rightHand].name || "Fist";
        let leftHand = items[selectedCharacter.leftHand].name || "Fist";
        _.each(selectedCharacter.belt, item => {
            let consumable = consumables[item];
            belt += consumable.name + " ";
        });
        let charClass = "";
        _.forEach(selectedCharacter.classes, function(classLvl, key) {
            if (classLvl > 0) {
                charClass += "\n" + t(state, `menu.characters.${key}`) + " " + classLvl + " lvl";
            }
        });
        message += t(state, "texts.mainScenes.characterScene.descriptionCharacter", {
            charClass: charClass,
            nickname: player.nickname,
            level: player.level,
            xp: player.XP,
            coins: player.data.coins,
            tokens: player.data.tokens,
            strength: player.selectedCharacter.strength,
            dexterity: player.selectedCharacter.dexterity,
            intelligence: player.selectedCharacter.intelligence,
            wisdom: player.selectedCharacter.wisdom,
            vitality: player.selectedCharacter.vitality,
            rightHandName: rightHand,
            leftHandName: leftHand,
            hp: player.data.hp,
            mp: player.data.mp,
            belt: belt
        });
        let buttons = [[t(state, "texts.back")]];
        if (player.data.classPoints > 0 || player.data.statPoints > 0) {
            buttons.push([t(state, "menu.levelUp")]);
        }
        return keyboard(message, buttons, { playerId: state.player.id }, state);
    })
);

characterScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        switch (text) {
            case t(state, "texts.back"):
                return enterScene(ctx, "mainScene", state);
            case t(state, "menu.levelUp"):
                if (state.player.data.statPoints) {
                    state.player.data.activity = "leveling1";
                } else if (!state.player.data.statPoints && state.player.data.classPoints) {
                    state.player.data.activity = "leveling2";
                }
                return enterScene(ctx, "mainScene", state);
            default:
                return redirectToOopsScene(ctx, state);
        }
    })
);

module.exports = characterScene;
