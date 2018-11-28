import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { consumables } from "../../resources/consumables";
import { enterScene, keyboard, replyWithMarkdown, stateWrapper, redirectToOopsScene, t } from "../../helpers";

const buyProjectileScene = new Scene("buyProjectileScene");

buyProjectileScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let selectedCharacter = state.player.selectedCharacter;
        let message = "Items you have in your belt are:\n";
        _.each(selectedCharacter.belt, item => {
            message += item + " ";
        });
        message += "\nYou can carry 6 items in your belt.\n\nWhat projectile do you want to buy?";
        let buttons = [];
        //Add translates
        _.each(consumables, key => {
            if (key.type === "projectiles") {
                message += key.name + "\tPrice: " + key.cost + " coins" + "\tWheight: " + key.load + " pounds\n" + key.text + "\n";
                buttons += key.name;
            }
        });
        buttons += t(state, "texts.back");
        return keyboard(
            message,
            [["Knife", "Dart Spear"], ["Poison Bomb", "Web Net"], [t(state, "texts.back")]],
            {
                playerId: state.player.id
            },
            state
        );
    })
);

buyProjectileScene.on("text", ctx =>
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
                enterScene(ctx, "vendorScene", state);
                break;
            case item.name:
                let data = player.data;
                if (data.coins - item.cost >= 0) {
                    if (selectedCharacter.belt.length <= 6) {
                        selectedCharacter.belt += item.name;
                        data.coins -= item.cost;
                        return replyWithMarkdown("Purchase success", { playerId: state.player.id }).then(
                            enterScene(ctx, "vendorScene", state)
                        );
                    } else {
                        return replyWithMarkdown("You can't carry any more items", { playerId: state.player.id }).then(
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

module.exports = buyProjectileScene;
