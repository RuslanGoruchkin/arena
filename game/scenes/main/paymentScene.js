import Scene from "telegraf/scenes/base";
import { keyboard } from "../../helpers/TelegramApiHelpers";
import variables from "../../variables";
import { stateWrapper, translate } from "../../helpers/ctx";
import { enterScene, redirectToOopsScene } from "../../helpers/TelegramApiHelpers";

const paymentScene = new Scene("paymentScene");

let buttons;

paymentScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        buttons = [[translate(state, "menu.confirm.back")]];
        let user = JSON.parse(JSON.stringify(variables.users[ctx.from.id]));
        return keyboard(
            translate(state, "texts.shopScenes.donateText") +
                "\n\n" +
                translate(state, "texts.shopScenes.donateLink", { link: variables.userDonateLink[user] }),
            buttons,
            { playerId: state.player.id }
        );
    })
);

paymentScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        switch (ctx.update.message.text) {
            case translate(state, "menu.confirm.back"):
                enterScene(ctx, "mainMenuScene", state);
                break;
            default:
                redirectToOopsScene(ctx);
                break;
        }
    })
);

module.exports = paymentScene;
