import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { stateWrapper, t } from "../../helpers/ctx";
import { enterScene, keyboard, redirectToOopsScene } from "../../helpers/TelegramApiHelpers";

const inventoryScene = new Scene("inventoryScene");

inventoryScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let selectedCharacter = player.selectedCharacter;
        let programs = "";
        let programsInMemory = _.cloneDeep(player.data.programsInMemory);
        programsInMemory = _.sortBy(programsInMemory, [
            program => {
                return t(state, `texts.${program.key}`);
            }
        ]);
        _.each(programsInMemory, program => {
            programs += `\n${t(state, `texts.${program.key}`)}`;
        });
        let rightHand = player.rightHand.name || "Fist";
        let leftHand = player.leftHand.name || "Fist";
        let inventory = "";
        _.each(player.inventory, item => {
            if (!item.equipped) {
                inventory += item.name + "\n";
            }
        });
        let message = t(state, "texts.mainScenes.inventoryScene.descriptionCharacter", {
            charClass: t(state, `menu.characters.${selectedCharacter.class}`),
            nickname: player.nickname,
            level: player.level,
            xp: player.XP,
            coins: player.data.coins,
            tokens: player.data.tokens,
            strength: player.strength,
            dexterity: player.dexterity,
            intelligence: player.intelligence,
            wisdom: player.wisdom,
            vitality: player.vitality,
            rightHand: rightHand,
            leftHand: leftHand,
            inventory: inventory
        });
        return keyboard(message, [[t(state, "texts.back")], [t(state, "texts.equip")], [t(state, "texts.unequip")]], {
            playerId: state.player.id
        });
    })
);

inventoryScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        switch (text) {
            case t(state, "texts.back"):
                return enterScene(ctx, "mainScene", state);
                break;
            case t(state, "texts.equip"):
                return enterScene(ctx, "equipScene", state);
                break;
            case t(state, "texts.unequip"):
                return enterScene(ctx, "unequipScene", state);
                break;
            default:
                return redirectToOopsScene(ctx);
                break;
        }
    })
);

module.exports = inventoryScene;
