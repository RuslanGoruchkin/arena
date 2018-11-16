import Scene from "telegraf/scenes/base";
import { keyboard } from "../../helpers/TelegramApiHelpers";
import { stateWrapper, t } from "../../helpers/ctx";
import { enterScene, redirectToOopsScene } from "../../helpers/TelegramApiHelpers";

const settingScene = new Scene("settingScene");

settingScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        return keyboard(
            t(state, "texts.selectAction"),
            [
                [t(state, "texts.mainScenes.settingScene.invite"), t(state, "texts.mainScenes.settingScene.language")],
                [t(state, "texts.back")]
            ],
            { playerId: state.player.id }
        );
    })
);

settingScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        switch (ctx.update.message.text) {
            case t(state, "texts.mainScenes.settingScene.invite"):
                ctx.replyWithHTML(`https://telegram.me/${ctx.session.botName}?start=${state.player.telegramId}`).then(
                    enterScene(ctx, "settingScene", state)
                );
                break;
            case t(state, "texts.mainScenes.settingScene.language"):
                enterScene(ctx, "changeLanguageScene", state);
                break;
            case t(state, "texts.back"):
                enterScene(ctx, "mainMenuScene", state);
                break;
            default:
                redirectToOopsScene(ctx);
                break;
        }
    })
);

module.exports = settingScene;
