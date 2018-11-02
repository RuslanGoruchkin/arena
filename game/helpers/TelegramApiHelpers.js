import _ from "lodash";
import stateManager from "../stateManager";
import * as scenes from "../../scenes";
import { getCurrentScene } from "./ctx";
let debug = require("debug")("bot:telegrafApiHelpers");

export const keyboard = (text, menu, params) => {
    let options = {
        parse_mode: "Markdown",
        reply_markup: {
            keyboard: menu,
            resize_keyboard: true
        }
    };
    let playerId = _.get(params, "playerId");
    if (playerId) {
        return global.bot.telegram.sendMessage(playerId, text, options);
    }
    return Promise.reject("No id");
};

export let replyWithPhotoAndKeyboard = (text, photo, menu, params) => {
    let options = {
        caption: text,
        parse_mode: "Markdown",
        reply_markup: {
            keyboard: menu,
            resize_keyboard: true
        }
    };
    let playerId = _.get(params, "playerId");
    if (playerId) {
        return global.bot.telegram.sendPhoto(playerId, photo, options);
    }
    return Promise.reject("No id");
};

export let replyWithMarkdown = (text = "", params = {}) => {
    let options = {
        parse_mode: "Markdown"
    };
    let playerId = _.get(params, "playerId");
    if (playerId) {
        return global.bot.telegram.sendMessage(playerId, text, options);
    }
    return Promise.reject("No id");
};

export const enterScene = (ctx, sceneName, state) => {
    let idFromCtx = _.get(ctx, "update.message.from.id");
    if (state) {
        stateManager.sync(state);
    }
    if (idFromCtx) {
        return ctx.scene.enter(sceneName);
    }
    if (_.isObject(sceneName)) {
        let name = _.get(sceneName, "scene");
        let id = _.get(sceneName, "playerId");
        let fakeCtx = { from: { id: id } };
        if (_.get(scenes, name)) {
            return _.get(scenes, name).enterHandler.call(state, fakeCtx);
        }
        // let oldCtx = global.ctxBase[id];
        // return oldCtx.scene.enter(name);
    }
};

export let redirectToOopsScene = ctx => {
    console.log(
        `User ${ctx.update.message.from.first_name} ${ctx.update.message.from.last_name} ${ctx.update.message.from.id} tries to write "${
            ctx.update.message.text
        }" in ${getCurrentScene(ctx)}`
    );
    ctx.session.lastScene = getCurrentScene(ctx);
    enterScene(ctx, "oopsScene");
};
