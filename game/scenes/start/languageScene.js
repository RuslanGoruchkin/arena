import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { enterScene, keyboard, replyWithMarkdown, startNewGame, stateWrapper, t } from "../../helpers";

const languageScene = new Scene("languageScene");

languageScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let date = new Date();
        let dateLog =
            `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ` +
            `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        let log =
            `${dateLog} ${ctx.update.message.from.first_name} ${ctx.update.message.from.last_name} ` +
            `${ctx.update.message.from.username} ${ctx.from.id}`;
        console.log(log);
        let split = ctx.update.message.text.split(" ");
        let params = { playerId: ctx.from.id };
        if (split[1]) {
            let playerId = parseInt(split[1]);
            _.each(state.players, player => {
                if (player.id === playerId) {
                    player.state.tokens += 50;
                }
            });
            let rewardText = t(state, "texts.startScenes.languageScene.reward");
            replyWithMarkdown(rewardText, params, state);
        }
        return keyboard(
            t(state, "texts.startScenes.languageScene.selectLanguage"),
            [[t(state, "menu.language.ru")], [t(state, "menu.language.en")]],
            params,
            state
        );
    })
);

languageScene.on("text", ctx =>
    stateWrapper(ctx, async (ctx, state) => {
        let text = ctx.update.message.text;
        let locales = [t(state, "menu.language.ru"), t(state, "menu.language.en")];
        let params = { playerId: ctx.from.id };
        if (_.includes(locales, text)) {
            if (text === t(state, "menu.language.ru")) {
                state.language = "ru";
            } else if (text === t(state, "menu.language.en")) {
                state.language = "en";
            }
            ctx.session.__language_code = ctx.session.language = state.language;
            state = await startNewGame(state, { ctx, ...params, language: state.language });
            return enterScene(ctx, "disclamerScene", state);
        } else {
            let selectLangtext = "Введите корректный язык";
            replyWithMarkdown(selectLangtext, params, state);
            return enterScene(ctx, "languageScene", state);
        }
    })
);

module.exports = languageScene;
