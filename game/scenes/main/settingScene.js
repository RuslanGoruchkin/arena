import Scene from "telegraf/scenes/base";
import { enterScene, keyboard, redirectToOopsScene, replyWithMarkdown, stateWrapper, t } from "../../helpers";

const settingScene = new Scene("settingScene");

settingScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        return keyboard(
            t(state, "texts.selectAction"),
            [
                [t(state, "texts.mainScenes.settingScene.invite"), t(state, "texts.mainScenes.settingScene.language")],
                [t(state, "texts.back")]
            ],
            { playerId: state.player.id },
            state
        );
    })
);

settingScene.on("text", ctx =>
    stateWrapper(ctx, async (ctx, state) => {
        switch (ctx.update.message.text) {
            case t(state, "texts.mainScenes.settingScene.invite"):
                await replyWithMarkdown(`https://telegram.me/${ctx.session.botName}?start=${state.player.telegramId}`);
                return enterScene(ctx, "settingScene", state);
            case t(state, "texts.mainScenes.settingScene.language"):
                return enterScene(ctx, "changeLanguageScene", state);
            case t(state, "texts.back"):
                return enterScene(ctx, "mainMenuScene", state);
            default:
                return redirectToOopsScene(ctx, state);
        }
    })
);

module.exports = settingScene;
