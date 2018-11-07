import Scene from "telegraf/scenes/base";
import { enterScene } from "../../../helpers/TelegramApiHelpers";
import { stateWrapper } from "../../../helpers/ctx";

const antivirusDefeatedActionScene = new Scene("antivirusDefeatedActionScene");

antivirusDefeatedActionScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        enterScene(ctx, "mainScene", state);
    })
);

antivirusDefeatedActionScene.on("text", ctx => {});

module.exports = antivirusDefeatedActionScene;
