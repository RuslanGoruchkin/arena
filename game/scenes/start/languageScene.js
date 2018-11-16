import _ from "lodash";
import { startNewGame } from "../../util";
import Scene from "telegraf/scenes/base";
import { gameModules } from "../../gameModules";
import { stateWrapper, t } from "../../helpers/ctx";
import stateManager from "../../stateManager";
import { enterScene, keyboard, replyWithMarkdown } from "../../helpers/TelegramApiHelpers";

const languageScene = new Scene("languageScene");

languageScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let date = new Date();
        let dateLog = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} 
        ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        let log = `${dateLog} ${ctx.update.message.from.first_name} ${ctx.update.message.from.last_name} 
        ${ctx.update.message.from.username} ${ctx.from.id}`;
        console.log(log);
        let split = ctx.update.message.text.split(" ");
        if (split[1]) {
            let telegramId = parseInt(split[1]);
            _.each(state.players, player => {
                if (player.id === telegramId) {
                    player.state.tokens += 50;
                }
            });
            ctx.telegram.sendMessage(telegramId, t(state, "texts.startScenes.languageScene.reward"));
        }
        let params = {};

        params = { ...params, playerId: ctx.from.id };
        return keyboard(
            t(state, "texts.startScenes.languageScene.selectLanguage"),
            [[t(state, "menu.language.ru")], [t(state, "menu.language.en")]],
            params
        );
    })
);

languageScene.on("text", ctx =>
    stateWrapper(ctx, async (ctx, state) => {
        let text = ctx.update.message.text;
        let locales = [t(state, "menu.language.ru"), t(state, "menu.language.en")];
        if (_.includes(locales, text)) {
            if (text === t(state, "menu.language.ru")) {
                state.language = "ru";
            } else if (text === t(state, "menu.language.en")) {
                state.language = "en";
            }
            ctx.session.__language_code = ctx.session.language;
            state = await startNewGame(state, { ctx });
            return await enterScene(ctx, "disclamerScene", state);
        } else {
            let selectLangtext = "Введите корректный язык";
            //replyWithMarkdown(selectLangtext, { playerId: state.player.id });
            return enterScene(ctx, "languageScene", state);
        }
    })
);

module.exports = languageScene;
