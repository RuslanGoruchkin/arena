import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { consumables } from "../../resources/consumables";
import { enterScene, keyboard, replyWithMarkdown, stateWrapper, redirectToOopsScene, t } from "../../helpers";
const buyBuffScene = new Scene("buyBuffScene");

buyBuffScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let data = state.player.data;
        let selectedCharacter = state.player.selectedCharacter;
        let message = "You can carry 6 items in your belt. Items you have in your belt are:\n";
        _.each(selectedCharacter.belt, item => {
            let consumable = consumables[item];
            message += consumable.name + " ";
        });
        message += "\nYou have " + data.coins + " coins to spend";
        message += "\n\nWhat potion do you want to buy?\n";
        let buttons = [];
        buttons[0] = [];
        //Add translates
        _.each(consumables, key => {
            if (key.type === "buffs") {
                message += key.name + "\tPrice: " + key.cost + " coins" + "\tWheight: " + key.load + " pounds\n" + key.text + "\n";
                buttons[0].push(key.name);
            }
        });
        buttons.push(t(state, "texts.back"));
        return keyboard(
            message,
            [["Fire Resin", "Ice Resin"], ["Light Resin", "Dark Resin"], [t(state, "texts.back")]],
            {
                playerId: state.player.id
            },
            state
        );
    })
);

buyBuffScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let selectedCharacter = state.player.selectedCharacter;
        let text = ctx.update.message.text;
        let itemId = _.findKey(consumables, { name: text });

        switch (text) {
            case t(state, "texts.back"):
                return enterScene(ctx, "vendorScene", state);
            case consumables[itemId].name:
                let data = player.data;
                if (data.coins - consumables[itemId].cost >= 0) {
                    if (selectedCharacter.belt.length < 6) {
                        selectedCharacter.belt.push(itemId);
                        data.coins -= consumables[itemId].cost;
                        return replyWithMarkdown("Purchase success", { playerId: state.player.id }, state).then(
                            enterScene(ctx, "vendorScene", state)
                        );
                    } else {
                        return replyWithMarkdown("You can't carry any more items", { playerId: state.player.id }, state).then(
                            enterScene(ctx, "vendorScene", state)
                        );
                    }
                } else {
                    return replyWithMarkdown("You don't have enough money", { playerId: state.player.id }, state).then(
                        enterScene(ctx, "vendorScene", state)
                    );
                }
            default:
                redirectToOopsScene(ctx, state);
        }
    })
);

module.exports = buyBuffScene;
