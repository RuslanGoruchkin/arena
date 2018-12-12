import Scene from "telegraf/scenes/base";
import { enterScene, keyboard, redirectToOopsScene, replyWithMarkdown, stateWrapper, t } from "../../helpers";

const mainMenuScene = new Scene("mainMenuScene");

const credits = `Black Deck Crew

Producer: Alex Gapak
Art Director: Alexandr Cherepuschak
Narrative Director: Olena Gapak
Tech Director: Sergey Kamaltynov
PR Director: Maxim Merkulov
Character Artist: Julia Voronina
Concept Artist: Katya Sytch
Dev-ops: Alexey Shendrick
Developer: Sergey Tatarinov
Product Manager: Nastya Kondratieva
Localization: Yana Pryimak
Product Designer: Yura Danilov
Game Designer: Ilya Ulyanov
`;

mainMenuScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let message = "test";
        let buttons = [
            [t(state, "menu.credits"), t(state, "texts.settings")],
            [t(state, "texts.ratingScenes.sceneName"), t(state, "menu.donate")],
            [
                t(state, "texts.mainScenes.mainMenuScene.comics"),
                t(state, "menu.character", { character: player.selectedCharacter.character })
            ]
        ];
        buttons.push([t(state, "menu.home"), t(state, "texts.back")]);
        return keyboard(message, buttons, { playerId: state.player.id }, state);
    })
);

mainMenuScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        let player = state.player;
        let data = player.data;
        let currentTick = state.currentTick;
        let dailyTick = data.dailyTick;
        let weeklyTick = data.weeklyTick;
        let dailyTickDifference = currentTick - dailyTick;
        let weeklyTickDifference = currentTick - weeklyTick;
        //todo change time to real values daily = 86400 and weekly = 604800
        let dailyDelta = 30;
        let weeklyDelta = 60;

        switch (text) {
            case t(state, "menu.credits"):
                replyWithMarkdown(credits, { playerId: state.player.id }, state);
                return enterScene(ctx, "mainMenuScene", state);
            case t(state, "texts.back"):
                return enterScene(ctx, "mainScene", state);
            case t(state, "menu.character", { character: player.selectedCharacter.character }):
                return enterScene(ctx, "characterScene", state);
            case t(state, "menu.donate"):
                return enterScene(ctx, "storeDisclamerScene", state);
            case t(state, "menu.home"):
                if (state.player.finalFightWasStarted || ctx.session.firstFightWasStarted) {
                    ctx.session.firstFightWasStarted = false;
                    state.finalFightWasStarted = false;
                    return enterScene(ctx, "selectCharacterScene", state);
                } else {
                    return enterScene(ctx, "teleportScene", state);
                }
            case t(state, "texts.settings", { character: player.selectedCharacter.character }):
                return enterScene(ctx, "settingScene", state);
            case t(state, "texts.ratingScenes.sceneName"):
                return enterScene(ctx, "ratingScene", state);
            case t(state, "texts.mainScenes.mainMenuScene.comics"):
                return enterScene(ctx, "comicsListScene", state);
            default:
                return redirectToOopsScene(ctx, state);
        }
    })
);

module.exports = mainMenuScene;
