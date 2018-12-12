import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { enterScene, keyboard, replyWithMarkdown, stateWrapper, t } from "../../helpers";
import { items } from "../../resources/items";

const unequipScene = new Scene("unequipScene");

//Add filter by level

unequipScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let options = [];
        options[0] = [];
        let player = state.player.selectedCharacter;
        if (player.rightHand !== "fist") {
            options[0].push(items[player.rightHand].name);
        }
        if (player.leftHand !== "fist") {
            if (items[player.leftHand] !== 2) {
                options[0].push(items[player.leftHand].name);
            }
        }
        if (player.armor !== "naked") {
            options[0].push(items[player.armor].name);
        }
        options.push([t(state, "texts.back")]);
        return keyboard(
            "Which item do you want to unequip?",
            options,
            {
                playerId: state.player.id
            },
            state
        );
    })
);

unequipScene.on("text", ctx => {
    return stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        let player = state.player.selectedCharacter;
        let itemId = _.findKey(items, { name: text });
        if (text === t(state, "texts.back")) {
            return enterScene(ctx, "inventoryScene", state);
        } else {
            switch (itemId) {
                case player.rightHand: {
                    if (items[itemId].hands === 2) {
                        player.leftHand = "fist";
                    }
                    player.inventory.push(player.rightHand);
                    player.rightHand = "fist";
                    break;
                }
                case player.leftHand: {
                    player.inventory.push(player.leftHand);
                    player.leftHand = "fist";
                    break;
                }
                case player.armor: {
                    player.inventory.push(player.armor);
                    player.armor = "naked";
                    break;
                }
            }
            return enterScene(ctx, "unequipScene", state);
        }
    });
});

module.exports = unequipScene;
