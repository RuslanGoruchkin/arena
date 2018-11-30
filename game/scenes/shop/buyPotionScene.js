import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { consumables } from "../../resources/consumables";
import { enterScene, keyboard, replyWithMarkdown, stateWrapper, redirectToOopsScene, t } from "../../helpers";

const buyPotionScene = new Scene("buyPotionScene");

buyPotionScene.enter(ctx =>
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
        //Add translates
        _.each(consumables, key => {
            if (key.type === "potions") {
                message += key.name + "\nPrice: " + key.cost + " coins" + "\tWheight: " + key.load + " pounds\n" + key.text + "\n";
                buttons.push(key.name);
            }
        });
        buttons.push(t(state, "texts.back"));
        console.log(toString(buttons));
        return keyboard(message, [["HP Pot", "MP Pot", "SP Pot"], [t(state, "texts.back")]], { playerId: state.player.id }, state);
    })
);

buyPotionScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let selectedCharacter = state.player.selectedCharacter;
        let text = ctx.update.message.text;
        let item = _.find(consumables, { name: text });
        //let module = _.find(consumables, module => {
        //    return t(state, `texts.modules.${module.name}`) === ctx.session.player.moduleForBuy.name;
        //});
        switch (text) {
            case t(state, "texts.back"):
                return enterScene(ctx, "vendorScene", state);
            case item.name:
                let data = player.data;
                console.log(selectedCharacter.belt.length);
                if (data.coins - item.cost >= 0) {
                    if (selectedCharacter.belt.length < 6) {
                        selectedCharacter.belt.push(item.id);
                        data.coins -= item.cost;
                        return replyWithMarkdown("Purchase success", { playerId: state.player.id }, state).then(
                            enterScene(ctx, "vendorScene", state)
                        );
                    } else {
                        return replyWithMarkdown("You can't carry any more items", { playerId: state.player.id }, state).then(
                            enterScene(ctx, "vendorScene", state)
                        );
                    }
                } else {
                    return replyWithMarkdown("You don't have enough money", { playerId: state.player.id }).then(
                        enterScene(ctx, "vendorScene", state)
                    );
                }
            default:
                return redirectToOopsScene(ctx, state);
        }
    })
);

module.exports = buyPotionScene;
