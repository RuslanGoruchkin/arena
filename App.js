import Telegraf from "telegraf";
import { enterScene, errorHandler, initLoggers } from "./game/helpers";
import DonatesMiddleware from "./game/middlewares/donates";
import MySQLSession from "./game/middlewares/mysql-session-middleware";
import TickMiddleware from "./game/middlewares/tick";
import { stage } from "./game/scenes/scenes";

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
bot.catch(errorHandler);
bot.startPolling();
global.bot = bot;
