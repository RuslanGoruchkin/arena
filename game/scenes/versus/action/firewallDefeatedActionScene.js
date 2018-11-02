import Scene from "telegraf/scenes/base";
import { enterScene } from "../../../helpers/TelegramApiHelpers";
import { stateWrapper } from "../../../helpers/ctx";

const firewallDefeatedActionScene = new Scene("firewallDefeatedActionScene");

firewallDefeatedActionScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        enterScene(ctx, "mainScene", state);
    })
);

firewallDefeatedActionScene.on("text", ctx => {});

module.exports = firewallDefeatedActionScene;
