import Telegraf from "telegraf";
import { enterScene } from "./game/helpers/TelegramApiHelpers";
import MySQLSession from "./game/middlewares/mysql-session-middleware";
import TickMiddleware from "./game/middlewares/tick";
import DonatesMiddleware from "./game/middlewares/donates";
import { stage } from "./game/scenes/scenes";
import { initLoggers } from "./game/helpers/loggers";

const { Sentry, debug } = initLoggers();

const BOT_TOKEN = process.env.BOT_TOKEN;
debug(`Bot ${BOT_TOKEN} runs in production mode`);
global.ctxBase = {};

global.bot = new Telegraf(BOT_TOKEN, { telegram: { webhookReply: true } });
export const Session = new MySQLSession();
export const Tick = new TickMiddleware();
export const Donates = new DonatesMiddleware();

global.bot.use(Tick.middleware());
global.bot.use(Session.middleware());
global.bot.use(stage.middleware());
global.bot.use(Donates.middleware());
global.bot.command("start", ctx => {
    debug("Start session", ctx.session);
    global.bot.telegram.getMe().then(botInfo => {
        global.bot.options.username = botInfo.username;
    });

    return enterScene(ctx, "languageScene", null);
});
global.bot.catch(err => {
    debug(err);
    Sentry.captureException(err);
});

global.bot.startPolling();
