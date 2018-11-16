import Scene from "telegraf/scenes/base";
import { keyboard } from "../../helpers/TelegramApiHelpers";
import { stateWrapper, t } from "../../helpers/ctx";
import { enterScene, redirectToOopsScene, replyWithMarkdown } from "../../helpers/TelegramApiHelpers";

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
        let message = t(state, "texts.mainScenes.infoScene.info");
        let buttons = [
            [t(state, "menu.credits"), t(state, "texts.settings")],
            [t(state, "texts.ratingScenes.sceneName"), t(state, "menu.donate")],
            [
                t(state, "texts.mainScenes.mainMenuScene.comics"),
                t(state, "menu.character", { character: player.selectedCharacter.character })
            ]
        ];
        if (player.selectedCharacter.class === "defaultCharacter") {
            buttons.push([t(state, "texts.rooms.finishTraining")]);
        } else {
            buttons.push([t(state, "texts.rooms.abandonQuest")]);
            buttons.push([t(state, "menu.weekly"), t(state, "menu.daily")]);
        }
        buttons.push([t(state, "menu.home"), t(state, "texts.back")]);
        return keyboard(message, buttons, { playerId: state.player.id });
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
                replyWithMarkdown(credits, { playerId: state.player.id });
                enterScene(ctx, "mainMenuScene", state);
                break;
            case t(state, "texts.back"):
                enterScene(ctx, "mainScene", state);
                break;
            case t(state, "menu.character", { character: player.selectedCharacter.character }):
                enterScene(ctx, "characterScene", state);
                break;
            case t(state, "menu.donate"):
                enterScene(ctx, "storeDisclamerScene", state);
                break;
            case t(state, "menu.home"):
                if (state.player.finalFightWasStarted || ctx.session.firstFightWasStarted) {
                    ctx.session.firstFightWasStarted = false;
                    state.finalFightWasStarted = false;
                    enterScene(ctx, "selectCharacterScene", state);
                } else {
                    enterScene(ctx, "teleportScene", state);
                }
                break;
            case t(state, "texts.settings", { character: player.selectedCharacter.character }):
                enterScene(ctx, "settingScene", state);
                break;
            case t(state, "texts.ratingScenes.sceneName"):
                enterScene(ctx, "ratingScene", state);
                break;
            case t(state, "menu.daily"):
                if (dailyTickDifference >= dailyDelta) {
                    state.player.data.dailyTick = currentTick;
                    enterScene(ctx, "dailyQuestScene", state);
                } else {
                    enterScene(ctx, "dailyTimeoutScene", state);
                }
                break;
            case t(state, "menu.weekly"):
                if (weeklyTickDifference >= weeklyDelta) {
                    state.player.data.dailyTick = currentTick;
                    enterScene(ctx, "weeklyQuestScene", state);
                } else {
                    enterScene(ctx, "weeklyTimeoutScene", state);
                }
                break;
            case t(state, "texts.rooms.finishTraining"):
                if (player.currentFloor === `${player.id}_quest`) {
                    player.currentQuest = undefined;
                    player.data.inventory = [];
                    enterScene(ctx, "selectCharacterScene", state);
                } else {
                    redirectToOopsScene(ctx);
                }
                break;
            case t(state, "texts.rooms.abandonQuest"):
                if (player.currentQuest) {
                    player.data.droppedQuests[player.currentQuest] = true;
                    player.currentQuest = undefined;
                }
                break;
            case t(state, "texts.mainScenes.mainMenuScene.comics"):
                enterScene(ctx, "comicsListScene", state);
                break;
            default:
                redirectToOopsScene(ctx);
                break;
        }
    })
);

module.exports = mainMenuScene;
