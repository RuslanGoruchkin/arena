import { getItemByClassCaption, startNewGame } from "../../util";
import Scene from "telegraf/scenes/base";
import { stateWrapper, t } from "../../helpers/ctx";
import { characters } from "../../resources/characters";
import { enterScene, redirectToOopsScene, replyWithPhotoAndKeyboard, replyWithMarkdown } from "../../helpers/TelegramApiHelpers";

const confirmScene = new Scene("confirmScene");

confirmScene.enter(ctx =>
    stateWrapper(ctx, async (ctx, state) => {
        await startNewGame(state, { ctx });
        let player = state.player;
        player.selectedCharacter = getItemByClassCaption(ctx.session.character, characters);
        let selectedCharacter = player.selectedCharacter;
        let message = t(state, "texts.startScenes.confirmScene.descriptionCharacter", {
            charClass: t(state, `menu.characters.${selectedCharacter.class}`),
            description: t(state, `texts.startScenes.confirmScene.${selectedCharacter.class}`),
            nickname: player.nickname,
            strength: player.selectedCharacter.baseStrength,
            dexterity: player.selectedCharacter.baseDexterity,
            intelligence: player.selectedCharacter.baseIntelligence,
            wisdom: player.selectedCharacter.baseWisdom,
            vitality: player.selectedCharacter.baseVitality
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
                break;
            case t(state, "texts.startScenes.confirmScene.otherCharacter"):
                return enterScene(ctx, "selectCharacterScene", state);
                break;
            default:
                return redirectToOopsScene(ctx);
                break;
        }
    })
);

module.exports = confirmScene;
