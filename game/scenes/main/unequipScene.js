import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { stateWrapper, t } from "../../helpers/ctx";
import { enterScene, keyboard } from "../../helpers/TelegramApiHelpers";

const unequipScene = new Scene("unequipScene");

//Add filter by level

unequipScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let options = [];
        options[0] = [];
        let player = state.player.selectedCharacter;
        if (player.rightHand.name) {
            options[0].push(player.rightHand.name);
        }
        if (player.leftHand.name) {
            options[0].push(player.leftHand.name);
        }
        if (player.armor.name) {
            options[0].push(player.armor.name);
        }
        console.log(options);
        options.push([t(state, "texts.back")]);
        console.log(options);
        return keyboard("Which item do you want to unequip?", options, {
            playerId: state.player.id
        });
    })
);

unequipScene.on("text", ctx => {
    return stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        let player = state.player.selectedCharacter;
        switch (text) {
            case player.rightHand.name: {
                player.inventory.push(_.cloneDeep(player.rightHand));
                player.rightHand = {};
                break;
            }
            case player.leftHand.name: {
                player.inventory.push(_.cloneDeep(player.leftHand));
                player.leftHand = {};
                break;
            }
            case player.armor.name: {
                player.inventory.push(_.cloneDeep(player.armor));
                player.armor = {};
                break;
            }
        }
        return enterScene(ctx, "inventoryScene", state);
    });
});

module.exports = unequipScene;
