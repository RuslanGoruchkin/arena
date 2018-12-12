const Telegraf = require("telegraf");

const telegram = new Telegraf(process.env.BOT_TOKEN);
import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { consumables } from "../../resources/consumables";
import {
    enterScene,
    inlineKeyboard,
    stateWrapper,
    redirectToOopsScene,
    t,
    removeKeyboard,
    enterSceneCB,
    replyWithMarkdown
} from "../../helpers";

const levelUpAltScene = new Scene("levelUpAltScene");

levelUpAltScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        return inlineKeyboard(
            'Do you want to Level up now?\nYou can do it later from "character" menu',
            [[{ text: "now", callback_data: "now" }, { text: "later", callback_data: "later" }]],
            { playerId: state.player.id },
            state
        );
    })
);

/*
levelUpAltScene.on(
    "callback_query",
    ("callback_query",
    ctx =>
        stateWrapper(ctx, (ctx, state) => {
            ctx.editMessageReplyMarkup({ message_id: ctx.update.callback_query.message.message_id, reply_markup: null });
            let text = ctx.update.callback_query.data;
            console.log(text);
            if (text === "now") {
                return ctx.answerCbQuery("now", false).then(() => enterSceneCB(ctx, "levelUpScene", null));
            } else {
                return ctx.answerCbQuery("later", false);
            }
        }))
);
/*
levelUpAltScene.on("callback_query", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.data;
        console.log(text);
        let scene = "mainScene";
        if (text === "true") {
            scene = "levelUpScene";
        } else {
            enterScene(ctx, "mainScene", state);
        }
        return global.bot.telegram.answerCallbackQuery(ctx.id).then(() => enterScene(ctx, scene, state));
    })
);
*/
module.exports = levelUpAltScene;
