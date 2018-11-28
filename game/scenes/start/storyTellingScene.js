import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { enterScene, redirectToOopsScene, replyWithMarkdown, replyWithPhotoAndKeyboard, stateWrapper, t } from "../../helpers";

const storyTellingScene = new Scene("storyTellingScene");

storyTellingScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let { player } = state;
        let { comicsCounter } = player.selectedCharacter;
        let message = "";
        let source = "";
        let buttons = [t(state, "texts.startScenes.confirmScene.otherCharacter")];
        if (player.selectedComics === "characterHistory") {
            message = t(state, `texts.comics.${player.selectedComics}.${player.selectedCharacter.class}.page${comicsCounter}`);
            source = `http://hackerpunk.s3.amazonaws.com/comics/${player.selectedComics}/${
                player.selectedCharacter.class
            }_00${comicsCounter}.png`;
            if (_.includes(player.comics, "characterHistory")) {
                if (comicsCounter < 4) {
                    buttons.push(t(state, "texts.next"));
                } else {
                    buttons.push(t(state, "texts.startScenes.storyTellingScene.startGame"));
                }
            } else {
                buttons = [];
                if (comicsCounter < 4) {
                    buttons.push(t(state, "texts.next"));
                } else {
                    buttons.push(t(state, "texts.back"));
                }
            }
        } else {
            message = t(state, `texts.comics.${player.selectedComics}.page${comicsCounter}`);
            source = `http://hackerpunk.s3.amazonaws.com/comics/${player.selectedComics}/${player.selectedComics}_00${comicsCounter}.png`;
            buttons = [];
            if (comicsCounter < 4) {
                buttons.push(t(state, "texts.next"));
            } else {
                buttons.push(t(state, "texts.back"));
            }
        }
        return replyWithPhotoAndKeyboard(message, source, [buttons], { playerId: state.player.id }, state);
    })
);

storyTellingScene.on("text", ctx =>
    stateWrapper(ctx, async (ctx, state) => {
        let text = ctx.update.message.text;
        switch (text) {
            case t(state, "texts.next"):
                state.player.selectedCharacter.comicsCounter = state.player.selectedCharacter.comicsCounter + 1;
                return enterScene(ctx, "storyTellingScene", state);
            case t(state, "texts.startScenes.storyTellingScene.startGame"):
                let welcomeText = t(state, "texts.startScenes.confirmScene.welcome");
                await replyWithMarkdown(welcomeText, { playerId: state.player.id }, state);
                if (_.includes(state.player.comics, "characterHistory")) {
                    state.player.comics.push("characterHistory");
                }
                return enterScene(ctx, "mainScene", state);
            case t(state, "texts.startScenes.confirmScene.otherCharacter"):
                return enterScene(ctx, "selectCharacterScene", state);
            case t(state, "texts.back"):
                return enterScene(ctx, "comicsListScene", state);
            default:
                return redirectToOopsScene(ctx, state);
        }
    })
);

module.exports = storyTellingScene;
