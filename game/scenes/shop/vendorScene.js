import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { consumables } from "../../resources/consumables";
import { enterScene, keyboard, stateWrapper, redirectToOopsScene, t } from "../../helpers";

const vendorScene = new Scene("vendorScene");

vendorScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let selectedCharacter = state.player.selectedCharacter;
        let belt ="You have " + state.player.data.coins + " coins.\n\nYour belt cosists of:\n";
        _.each(selectedCharacter.belt, item => {
            let consumable = consumables[item];
            belt += consumable.name + " ";
        });
        return keyboard(
            belt + "\n" + t(state, "texts.selectAction"),
            [
                [t(state, "texts.shopScenes.vendorScene.potions"), t(state, "texts.shopScenes.vendorScene.buffs")],
                [t(state, "texts.shopScenes.vendorScene.scrolls"), t(state, "texts.shopScenes.vendorScene.projectiles")],
                [t(state, "texts.back")]
            ],
            { playerId: state.player.id },
            state
        );
    })
);

vendorScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        switch (ctx.update.message.text) {
            case t(state, "texts.shopScenes.vendorScene.potions"):
                return enterScene(ctx, "buyPotionScene", state);

            case t(state, "texts.shopScenes.vendorScene.buffs"):
                return enterScene(ctx, "buyBuffScene", state);

            case t(state, "texts.shopScenes.vendorScene.scrolls"):
                return enterScene(ctx, "buyScrollScene", state);

            case t(state, "texts.shopScenes.vendorScene.projectiles"):
                return enterScene(ctx, "buyProjectileScene", state);

            case t(state, "texts.back"):
                return enterScene(ctx, "marketRoomScene", state);

            default:
                return redirectToOopsScene(ctx, state);
        }
    })
);

module.exports = vendorScene;
