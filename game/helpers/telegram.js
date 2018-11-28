import _ from "lodash";
import TelegrafContext from "telegraf/core/context";
import * as scenes from "../scenes/scenes";
import stateManager from "../stateManager";
import { errorHandler, getCurrentScene } from "./index";

let debug = require("debug")("bot:telegram-helpers");
// let debug = require("debug")("bot:telegrafApiHelpers");

export const keyboard = (text = "", menu = [], params, state = null) => {
    let options = {
        parse_mode: "Markdown",
        reply_markup: {
            keyboard: menu,
            resize_keyboard: true
        }
    };
    let playerId = _.get(params, "playerId");
    if (!playerId || !text) {
        return Promise.reject("No id or text");
    }
    if (state) {
        state.userHistory.push({
            playerId,
            action: "keyboard",
            data: {
                text,
                menu
            }
        });
        stateManager.setState(state);
    }
    return global.bot.telegram.sendMessage(playerId, text, options).catch(e => errorHandler(e, null, state));
};

export let replyWithPhotoAndKeyboard = (text = "", photo = "", menu = [], params, state = null) => {
    let options = {
        caption: text,
        parse_mode: "Markdown",
        reply_markup: {
            keyboard: menu,
            resize_keyboard: true
        }
    };
    let playerId = _.get(params, "playerId");
    if (!playerId || !text) return Promise.reject("No id or text");
    if (state) {
        state.userHistory.push({
            playerId,
            action: "photo",
            data: {
                text,
                menu,
                photo
            }
        });
        stateManager.setState(state);
    }
    return global.bot.telegram.sendPhoto(playerId, photo, options).catch(e => errorHandler(e, null, state));
};

export let replyWithMarkdown = (text = "", params = {}, state = null) => {
    let options = {
        parse_mode: "Markdown"
    };
    let playerId = _.get(params, "playerId");
    if (!playerId || !text) {
        return Promise.reject("No id or text");
    }
    if (state) {
        state.userHistory.push({
            playerId,
            action: "markdown",
            data: {
                text
            }
        });
        stateManager.setState(state);
    }
    return global.bot.telegram.sendMessage(playerId, text, {}).catch(e => errorHandler(e, null, state));
};

export const enterScene = (ctx, sceneName, state) => {
    const idFromCtx = _.get(ctx, "update.message.from.id");
    const fake_update = _.has(ctx, "update.fake_update");
    if (state) {
        state.userHistory.push({
            playerId: idFromCtx,
            action: "enterScene",
            data: {
                sceneName
            }
        });
        stateManager.setState(state);
    }
    if (!idFromCtx) {
        return Promise.reject("No id");
    }
    if (!fake_update) {
        return ctx.scene.enter(sceneName).catch(e => errorHandler(e, ctx, state));
    }
    if (_.get(scenes, sceneName)) {
        let options = {
            retryAfter: 1,
            handlerTimeout: 0,
            telegram: {
                webhookReply: true
            }
        };
        let newCtx = new TelegrafContext(ctx.update, global.bot, options);
        return _.get(scenes, sceneName)
            .enterHandler.call(state, newCtx)
            .catch(e => errorHandler(e, ctx, state));
    }
};

export let redirectToOopsScene = (ctx = {}, state = {}, e) => {
    console.log(
        `User ${ctx.update.message.from.first_name} ${ctx.update.message.from.last_name} ${ctx.update.message.from.id} tries to write "${
            ctx.update.message.text
        }" in ${getCurrentScene(ctx)}`
    );
    if (_.get(ctx, "update.message.text") === "/start") {
        return enterScene(ctx, "languageScene", state).catch(e => errorHandler(e, ctx, state));
    }
    if (getCurrentScene(ctx) !== "mainScene" && e) {
        return enterScene(ctx, "mainScene", state).catch(e => errorHandler(e, ctx, state));
    }
    return enterScene(ctx, getCurrentScene(ctx)).catch(e => errorHandler(e, ctx, state));
    // return null;

    // return enterScene(ctx, "oopsScene");
};
