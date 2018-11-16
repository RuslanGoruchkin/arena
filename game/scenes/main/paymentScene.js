import Scene from "telegraf/scenes/base";
import { keyboard } from "../../helpers/TelegramApiHelpers";
import variables from "../../variables";
import { stateWrapper, t } from "../../helpers/ctx";
import { enterScene, redirectToOopsScene } from "../../helpers/TelegramApiHelpers";

const paymentScene = new Scene("paymentScene");

let buttons;

paymentScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        buttons = [[t(state, "menu.confirm.back")]];
        let user = JSON.parse(JSON.stringify(variables.users[ctx.from.id]));
        return keyboard(
            t(state, "texts.shopScenes.donateText") +
                "\n\n" +
                t(state, "texts.shopScenes.donateLink", { link: variables.userDonateLink[user] }),
            buttons,
            { playerId: state.player.id }
        );
    })
);

paymentScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        switch (ctx.update.message.text) {
            case t(state, "menu.confirm.back"):
                enterScene(ctx, "mainMenuScene", state);
                break;
            default:
                redirectToOopsScene(ctx);
                break;
        }
    })
);

module.exports = paymentScene;
