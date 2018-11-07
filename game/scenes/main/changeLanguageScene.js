import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { keyboard } from "../../helpers/TelegramApiHelpers";
import { stateWrapper, translate } from "../../helpers/ctx";
import { enterScene, redirectToOopsScene } from "../../helpers/TelegramApiHelpers";

const changeLanguageScene = new Scene("changeLanguageScene");

changeLanguageScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        return keyboard(
            translate(state, "texts.startScenes.languageScene.selectLanguage"),
            [
                [translate(state, "menu.language.ru"), translate(state, "menu.language.en"), translate(state, "menu.language.ja")],
                [translate(state, "texts.back")]
            ],
            { playerId: state.player.id }
        );
    })
);

changeLanguageScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        let locales = [translate(state, "menu.language.ru"), translate(state, "menu.language.en"), translate(state, "menu.language.ja")];
        if (_.includes(locales, text) || text === translate(state, "texts.back")) {
            if (text === translate(state, "menu.language.ru")) {
                state.language = "ru";
            } else if (text === translate(state, "menu.language.en")) {
                state.language = "en";
            } else {
                redirectToOopsScene(ctx);
            }
            enterScene(ctx, "mainScene", state);
        }
    })
);

module.exports = changeLanguageScene;
