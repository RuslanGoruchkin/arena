import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { getPlayerScreen, heightOfScreen, widthOfScreen } from "../../util";
import { gameModules } from "../../gameModules";
import { getModule, getPlayer, stateWrapper, translate } from "../../helpers/ctx";
import stateManager from "../../stateManager";
import { enterScene, keyboard, redirectToOopsScene, replyWithMarkdown } from "../../helpers/TelegramApiHelpers";

let debug = require("debug")("bot:mainScene");

let standartMenuTopRow = (state, params) => [translate(state, "menu.menu"), translate(state, "menu.up")];
let standartMenuBottomRow = (state, params) => [
    translate(state, "menu.character"),
    translate(state, "menu.inventory"),
    translate(state, "menu.menu")
];

const mainScene = new Scene("mainScene");
mainScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;

    })
);


mainScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;

    })
);

module.exports = mainScene;
