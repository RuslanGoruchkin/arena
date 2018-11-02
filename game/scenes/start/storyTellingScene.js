import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { enterScene } from "../../helpers/TelegramApiHelpers";
import { stateWrapper, translate } from "../../helpers/ctx";
import { redirectToOopsScene, replyWithMarkdown, replyWithPhotoAndKeyboard } from "../../helpers/TelegramApiHelpers";

const storyTellingScene = new Scene("storyTellingScene");

storyTellingScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let selectedCharacter = player.selectedCharacter;
        let message = "";
        let source = "";
        let buttons = [translate(state, "texts.startScenes.confirmScene.otherCharacter")];
        if (player.selectedComics === "characterHistory") {
            message = translate(
                state,
                `texts.comics.${player.selectedComics}.${selectedCharacter.class}.${selectedCharacter.comicsCounter}`
            );
            source = `http://hackerpunk.s3.amazonaws.com/comics/${player.selectedComics}/${selectedCharacter.class}_00${
                selectedCharacter.comicsCounter
            }.png`;
            if (_.includes(player.comics, "characterHistory")) {
                if (selectedCharacter.comicsCounter < 4) {
                    buttons.push(translate(state, "texts.next"));
                } else {
                    buttons.push(translate(state, "texts.startScenes.storyTellingScene.startGame"));
                }
            } else {
                buttons = [];
                if (selectedCharacter.comicsCounter < 4) {
                    buttons.push(translate(state, "texts.next"));
                } else {
                    buttons.push(translate(state, "texts.back"));
                }
            }
        } else {
            message = translate(state, `texts.comics.${player.selectedComics}.${selectedCharacter.comicsCounter}`);
            source = `http://hackerpunk.s3.amazonaws.com/comics/${player.selectedComics}/${player.selectedComics}_00${
                selectedCharacter.comicsCounter
            }.png`;
            buttons = [];
            if (selectedCharacter.comicsCounter < 4) {
                buttons.push(translate(state, "texts.next"));
            } else {
                buttons.push(translate(state, "texts.back"));
            }
        }
        return replyWithPhotoAndKeyboard(message, source, [buttons], { playerId: state.player.id });
    })
);

storyTellingScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        switch (text) {
            case translate(state, "texts.next"):
                state.player.selectedCharacter.comicsCounter++;
                enterScene(ctx, "storyTellingScene", state);
                break;
            case translate(state, "texts.startScenes.storyTellingScene.startGame"):
                let welcomeText = translate(state, "texts.startScenes.confirmScene.welcome");
                replyWithMarkdown(welcomeText, { playerId: state.player.id });
                if (_.includes(state.player.comics, "characterHistory")) {
                    state.player.comics.push("characterHistory");
                }
                enterScene(ctx, "mainScene", state);
                break;
            case translate(state, "texts.startScenes.confirmScene.otherCharacter"):
                enterScene(ctx, "selectCharacterScene", state);
                break;
            case translate(state, "texts.back"):
                enterScene(ctx, "comicsListScene", state);
                break;
            default:
                redirectToOopsScene(ctx);
                break;
        }
    })
);

module.exports = storyTellingScene;
