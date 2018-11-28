import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { enterScene, keyboard, redirectToOopsScene, stateWrapper, t } from "../../helpers";

const changeLanguageScene = new Scene("changeLanguageScene");

changeLanguageScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        return keyboard(
            t(state, "texts.startScenes.languageScene.selectLanguage"),
            [[t(state, "menu.language.ru"), t(state, "menu.language.en"), t(state, "menu.language.ja")], [t(state, "texts.back")]],
            { playerId: state.player.id },
            state
        );
    })
);

changeLanguageScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        let locales = [t(state, "menu.language.ru"), t(state, "menu.language.en"), t(state, "menu.language.ja")];
        if (_.includes(locales, text) || text === t(state, "texts.back")) {
            if (text === t(state, "menu.language.ru")) {
                state.player.language = "ru";
            } else if (text === t(state, "menu.language.en")) {
                state.player.language = "en";
            } else {
                return redirectToOopsScene(ctx, state);
            }
            return enterScene(ctx, "mainScene", state);
        }
    })
);

module.exports = changeLanguageScene;
