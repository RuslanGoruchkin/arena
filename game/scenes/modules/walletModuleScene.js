import { placeModuleToInventory } from "../../util";
import Scene from "telegraf/scenes/base";
import { stateWrapper, translate } from "../../helpers/ctx";
import { enterScene, keyboard, redirectToOopsScene } from "../../helpers/TelegramApiHelpers";

const walletModuleScene = new Scene("walletModuleScene");

walletModuleScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let message = translate(state, "texts.modulesScenes.walletModuleScene.balanceInWallets", {
            balance: player.data.coins,
            wallets: player.data.wallets.length
        });
        return keyboard(
            message,
            [[translate(state, "texts.modulesScenes.manageModuleScene.placeModuleToInventory")], [translate(state, "texts.back")]],
            { playerId: state.player.id }
        );
    })
);

walletModuleScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        switch (ctx.update.message.text) {
            case translate(state, "texts.back"):
                enterScene(ctx, "mainScene", state);
                break;
            case translate(state, "texts.modulesScenes.manageModuleScene.placeModuleToInventory"):
                placeModuleToInventory(state, { ctx });
                break;
            default:
                redirectToOopsScene(ctx);
                break;
        }
    })
);

module.exports = walletModuleScene;
