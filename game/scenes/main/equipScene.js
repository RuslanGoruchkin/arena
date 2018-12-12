import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { enterScene, keyboard, stateWrapper, t, replyWithMarkdown } from "../../helpers";
import { items } from "../../resources/items";

const equipScene = new Scene("equipScene");

//Add filter by level

equipScene.enter(ctx => {
    return stateWrapper(ctx, (ctx, state) => {
        let options = [];
        options[0] = [];
        let player = state.player;
        _.each(player.selectedCharacter.inventory, item => {
            options[0].push(items[item].name);
        });
        options.push([t(state, "texts.back")]);
        return keyboard(
            "Which item do you want to equip?",
            options,
            {
                playerId: state.player.id
            },
            state
        );
    });
});

equipScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        let selectedCharacter = state.player.selectedCharacter;
        let itemId = _.findKey(items, { name: text });
        if (_.includes(selectedCharacter.inventory, itemId)) {
            let index = _.indexOf(selectedCharacter.inventory, itemId);
            console.log(
                "TYpe: " +
                    items[itemId].type +
                    "\nId: " +
                    items[itemId].name +
                    "\nHands:" +
                    items[itemId].hands +
                    "\nIndex: " +
                    index +
                    "\nInventory: " +
                    selectedCharacter.inventory[index]
            );
            if (items[itemId].type === "weapon" && selectedCharacter.rightHand === "fist" && items[itemId].hands === 2) {
                selectedCharacter.leftHand = _.cloneDeep(itemId);
                selectedCharacter.rightHand = _.cloneDeep(itemId);
                selectedCharacter.inventory.splice(index, 1);
            } else if (items[itemId].type === "weapon" && selectedCharacter.rightHand === "fist" && items[itemId].hands === 1) {
                selectedCharacter.rightHand = _.cloneDeep(itemId);
                selectedCharacter.inventory.splice(index, 1);
            } else if (items[itemId].type === "weapon" && selectedCharacter.leftHand === "fist" && items[itemId].hands === 1) {
                selectedCharacter.leftHand = _.cloneDeep(itemId);
                selectedCharacter.inventory.splice(index, 1);
            } else if (items[itemId].type === "armor" && selectedCharacter.armor === "naked") {
                selectedCharacter.armor = _.cloneDeep(itemId);
                selectedCharacter.inventory.splice(index, 1);
            } else {
                replyWithMarkdown("Your hands are already busy", { playerId: state.player.id }, state);
            }
        }
        return enterScene(ctx, "inventoryScene", state);
    })
);

module.exports = equipScene;
