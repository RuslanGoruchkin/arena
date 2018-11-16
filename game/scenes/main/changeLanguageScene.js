import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { keyboard } from "../../helpers/TelegramApiHelpers";
import { stateWrapper, t } from "../../helpers/ctx";
import { enterScene, redirectToOopsScene } from "../../helpers/TelegramApiHelpers";

const changeLanguageScene = new Scene("changeLanguageScene");

changeLanguageScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        return keyboard(
            t(state, "texts.startScenes.languageScene.selectLanguage"),
            [
                [t(state, "menu.language.ru"), t(state, "menu.language.en"), t(state, "menu.language.ja")],
                [t(state, "texts.back")]
            ],
            { playerId: state.player.id }
        );
    })
);

changeLanguageScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        let locales = [t(state, "menu.language.ru"), t(state, "menu.language.en"), t(state, "menu.language.ja")];
        if (_.includes(locales, text) || text === t(state, "texts.back")) {
            if (text === t(state, "menu.language.ru")) {
                state.language = "ru";
            } else if (text === t(state, "menu.language.en")) {
                state.language = "en";
            } else {
                redirectToOopsScene(ctx);
            }
            enterScene(ctx, "mainScene", state);
        }
    })
);

module.exports = changeLanguageScene;
