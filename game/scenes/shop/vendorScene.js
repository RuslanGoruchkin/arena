import Scene from "telegraf/scenes/base";
import { keyboard } from "../../helpers/TelegramApiHelpers";
import { stateWrapper, t } from "../../helpers/ctx";
import { enterScene, redirectToOopsScene } from "../../helpers/TelegramApiHelpers";

const vendorScene = new Scene("vendorScene");

vendorScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        return keyboard(
            t(state, "texts.selectAction"),
            [
                [t(state, "texts.shopScenes.vendorScene.potions"), t(state, "texts.shopScenes.vendorScene.buffs")],
                [t(state, "texts.shopScenes.vendorScene.scrolls"), t(state, "texts.shopScenes.vendorScene.projectiles")],
                [t(state, "texts.back")]
            ],
            { playerId: state.player.id }
        );
    })
);

vendorScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        switch (ctx.update.message.text) {
            case t(state, "texts.shopScenes.vendorScene.potions"):
                return enterScene(ctx, "buyPotionScene", state);
                break;
            case t(state, "texts.shopScenes.vendorScene.buffs"):
                return enterScene(ctx, "buyBuffScene", state);
                break;
            case t(state, "texts.shopScenes.vendorScene.scrolls"):
                return enterScene(ctx, "buyScrollScene", state);
                break;
            case t(state, "texts.shopScenes.vendorScene.projectiles"):
                return enterScene(ctx, "buyProjectileScene", state);
                break;
            case t(state, "texts.back"):
                return enterScene(ctx, "marketRoomScene", state);
                break;
            default:
                return redirectToOopsScene(ctx);
                break;
        }
    })
);

module.exports = vendorScene;
