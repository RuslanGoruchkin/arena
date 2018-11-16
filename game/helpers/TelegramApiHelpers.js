import _ from "lodash";
import stateManager from "../stateManager";
import * as scenes from "../scenes/scenes";
import { getCurrentScene } from "./ctx";
import TelegrafContext from "telegraf/core/context";

// let debug = require("debug")("bot:telegrafApiHelpers");

export const keyboard = (text = "", menu, params, state = null) => {
    let options = {
        parse_mode: "Markdown",
        reply_markup: {
            keyboard: menu,
            resize_keyboard: true
        }
    };
    if (state) {
        stateManager.setState(state);
    }
    let playerId = _.get(params, "playerId");
    if (playerId && text) {
        return global.bot.telegram.sendMessage(playerId, text, options);
    }
    return Promise.reject("No id");
};

export let replyWithPhotoAndKeyboard = (text = "", photo, menu, params, state = null) => {
    let options = {
        caption: text,
        parse_mode: "Markdown",
        reply_markup: {
            keyboard: menu,
            resize_keyboard: true
        }
    };
    if (state) {
        stateManager.setState(state);
    }
    let playerId = _.get(params, "playerId");
    if (playerId) {
        return global.bot.telegram.sendPhoto(playerId, photo, options);
    }
    return null;
};

export let replyWithMarkdown = (text = "", params = {}, state = null) => {
    let options = {
        parse_mode: "Markdown"
    };
    if (state) {
        stateManager.setState(state);
    }
    let playerId = _.get(params, "playerId");
    if (playerId) {
        return global.bot.telegram.sendMessage(playerId, text, options);
    }
    return null;
};

export const enterScene = (ctx, sceneName, state) => {
    const idFromCtx = _.get(ctx, "update.message.from.id");
    const fake_update = _.has(ctx, "update.fake_update");
    if (state) {
        stateManager.setState(state);
    }
    if (!idFromCtx) {
        return null;
    }
    if (!fake_update) {
        return ctx.scene.enter(sceneName);
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
        return _.get(scenes, sceneName).enterHandler.call(state, newCtx);
    }
};

export let redirectToOopsScene = ctx => {
    console.log(
        `User ${ctx.update.message.from.first_name} ${ctx.update.message.from.last_name} ${ctx.update.message.from.id} tries to write "${
            ctx.update.message.text
        }" in ${getCurrentScene(ctx)}`
    );
    ctx.session.lastScene = getCurrentScene(ctx);
    return enterScene(ctx, "oopsScene");
};
