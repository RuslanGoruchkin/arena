import Scene from "telegraf/scenes/base";

import { characters } from "../../resources/characters";
import {
    enterScene,
    getItemByClassCaption,
    startNewGame,
    replyWithMarkdown,
    stateWrapper,
    redirectToOopsScene,
    replyWithPhotoAndKeyboard,
    t
} from "../../helpers";

const confirmScene = new Scene("confirmScene");

confirmScene.enter(ctx =>
    stateWrapper(ctx, async (ctx, state) => {
        await startNewGame(state, { ctx });
        let player = state.player;
        player.selectedCharacter = getItemByClassCaption(ctx.session.character, characters);
        let message = t(state, "texts.startScenes.confirmScene.descriptionCharacter", {
            charClass: t(state, `menu.characters.${player.selectedCharacter.class}`),
            description: t(state, `texts.startScenes.confirmScene.${player.selectedCharacter.class}`),
            nickname: player.nickname,
            strength: player.selectedCharacter.strength,
            dexterity: player.selectedCharacter.dexterity,
            intelligence: player.selectedCharacter.intelligence,
            wisdom: player.selectedCharacter.wisdom,
            vitality: player.selectedCharacter.vitality
        });
        return replyWithPhotoAndKeyboard(
            message,
            `http://hackerpunk.s3.amazonaws.com/characters/techMage.png`,
            [[t(state, "texts.startScenes.confirmScene.otherCharacter")], [t(state, "texts.ok")]],
            { playerId: state.player.id },
            state
        );
    })
);

confirmScene.on("text", ctx =>
    stateWrapper(ctx, async (ctx, state) => {
        switch (ctx.update.message.text) {
            case t(state, "texts.ok"):
                let welcomeText = t(state, "texts.startScenes.confirmScene.welcome");
                await replyWithMarkdown(welcomeText, { playerId: state.player.id }, state);
                state.player.data.hungryTick = state.currentTick;
                state.player.data.thirstyTick = state.currentTick;
                state.player.data.sleepyTick = state.currentTick;
                return enterScene(ctx, "mainScene", state);
            case t(state, "texts.startScenes.confirmScene.otherCharacter"):
                return enterScene(ctx, "selectCharacterScene", state);
            default:
                return redirectToOopsScene(ctx, state);
        }
    })
);

module.exports = confirmScene;
