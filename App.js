import Telegraf from "telegraf";
import { enterScene, enterSceneCB, errorHandler, initLoggers, stateWrapper, replyWithMarkdown, t, keyboard } from "./game/helpers";
import DonatesMiddleware from "./game/middlewares/donates";
import MySQLSession from "./game/middlewares/mysql-session-middleware";
import TickMiddleware from "./game/middlewares/tick";
import { stage } from "./game/scenes/scenes";
import stateManager from "./game/stateManager";
import _ from "lodash";

const { Sentry, debug } = initLoggers();

const BOT_TOKEN = process.env.BOT_TOKEN;
debug(`Bot ${BOT_TOKEN} runs in production mode`);

const bot = new Telegraf(BOT_TOKEN, { telegram: { webhookReply: true } });
export const Session = new MySQLSession();
export const Tick = new TickMiddleware();
export const Donates = new DonatesMiddleware();

bot.use(Tick.middleware());
bot.use(Session.middleware());
bot.use(stage.middleware());
bot.use(Donates.middleware());
bot.command("start", ctx => {
    debug("Start session", ctx.session);
    bot.telegram
        .getMe()
        .then(botInfo => {
            bot.options.username = botInfo.username;
            return botInfo.username;
        })
        .catch(e => errorHandler(e, ctx, null));

    return enterScene(ctx, "languageScene", null);
});

bot.on(
    "callback_query",
    ("callback_query",
    ctx => {
        stateWrapper(ctx, (ctx, state) => {
            ctx.editMessageReplyMarkup({ message_id: ctx.update.callback_query.message.message_id, reply_markup: null });
            let text = ctx.update.callback_query.data;
            //return ctx.answerCbQuery("later", false).then(() => enterSceneCB(ctx, "mainScene", state));
            // stateManager.queue.add(() => {
            //let state = stateManager.getState({ playerId: _.get(ctx, "from.id") });

            if (text === "now") {
                state.player.data.activity = "leveling1";
            }
            //enterScene(ctx, "mainScene", state);
            //routerScene(ctx, "mainScene", false);
            // });
            state.player.data.activity = "leveling1";
            ctx.answerCbQuery("later", false);
            //enterSceneCB(ctx, "levelUpRefreshScene", null);
            //ctx.answerCbQuery("later", false).then(() => return enterSceneCB(ctx, "mainScene", state));
            // });
            keyboard(
                "What class do you want to upgrade?",
                [
                    [t(state, "menu.characters.warrior"), t(state, "menu.characters.mage")],
                    [t(state, "menu.characters.evangelist"), t(state, "menu.characters.prophet")],
                    [t(state, "menu.characters.nomad")],
                    [t(state, "texts.ok"), "RESET", "LATER"]
                ],
                { playerId: state.player.id },
                state
            );
            return enterSceneCB(ctx, "levelUpScene", state);
            //.then(() => enterSceneCB(ctx, "mainScene", null));
        });
    })
);

bot.catch(errorHandler);
bot.startPolling();
global.bot = bot;
