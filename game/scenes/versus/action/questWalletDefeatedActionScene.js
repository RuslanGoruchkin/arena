import Scene from "telegraf/scenes/base";
import { keyboard } from "../../../helpers/TelegramApiHelpers";
import { stateWrapper, translate } from "../../../helpers/ctx";
import { enterScene, redirectToOopsScene } from "../../../helpers/TelegramApiHelpers";

const questWalletDefeatedActionScene = new Scene("questWalletDefeatedActionScene");

questWalletDefeatedActionScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        if (ctx.session.alreadyStolen) {
            return keyboard(
                translate(state, "texts.versusScenes.walletDefeatedActionScene.alreadyStolen"),
                [[translate(state, "texts.back")]],
                { playerId: state.player.id }
            );
        } else {
            let message = translate(state, "texts.versusScenes.walletDefeatedActionScene.canStealCash", {
                availableCash: player.quest.server.coins
            });
            return keyboard(
                message,
                [[translate(state, "texts.versusScenes.walletDefeatedActionScene.stealAction")], [translate(state, "texts.back")]],
                { playerId: state.player.id }
            );
        }
    })
);

questWalletDefeatedActionScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let data = player.data;
        switch (ctx.update.message.text) {
            case translate(state, "texts.versusScenes.walletDefeatedActionScene.stealAction"):
                ctx.session.alreadyStolen = true;
                data.coins += player.quest.server.coins;
                enterScene(ctx, "mainScene", state);
                break;
            case translate(state, "texts.back"):
                enterScene(ctx, "mainScene", state);
                break;
            default:
                redirectToOopsScene(ctx);
                break;
        }
    })
);

module.exports = questWalletDefeatedActionScene;
