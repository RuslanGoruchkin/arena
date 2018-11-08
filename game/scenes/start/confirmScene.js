import { getItemByClassCaption, startNewGame } from "../../util";
import Scene from "telegraf/scenes/base";
import { stateWrapper, translate } from "../../helpers/ctx";
import { characters } from "../../resources/characters";
import { enterScene, redirectToOopsScene, replyWithPhotoAndKeyboard } from "../../helpers/TelegramApiHelpers";

const confirmScene = new Scene("confirmScene");

confirmScene.enter(ctx =>
    stateWrapper(ctx, async (ctx, state) => {
        await startNewGame(state, { ctx });
        let player = state.player;
        player.selectedCharacter = getItemByClassCaption(ctx.session.character, characters);
        let selectedCharacter = player.selectedCharacter;
        player.data.inventory = [];
        let message = translate(state, "texts.startScenes.confirmScene.descriptionCharacter", {
            charClass: translate(state, `menu.characters.${selectedCharacter.class}`),
            description: selectedCharacter.description,
            nickname: player.nickname,
            processing: selectedCharacter.processing,
            speed: selectedCharacter.speed,
            logic: selectedCharacter.logic,
            memory: selectedCharacter.memory,
            attention: selectedCharacter.attention
        });
        return replyWithPhotoAndKeyboard(
            message,
            `http://hackerpunk.s3.amazonaws.com/characters/${selectedCharacter.class}.png`,
            [
                [translate(state, "texts.startScenes.confirmScene.otherCharacter")],
                [translate(state, "texts.ok")]
            ],
            { playerId: state.player.id }
        );
    })
);

confirmScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        switch (ctx.update.message.text) {
            case translate(state, "texts.ok"):
                enterScene(ctx, "mainScene", state);
                break;
            case translate(state, "texts.startScenes.confirmScene.otherCharacter"):
                enterScene(ctx, "selectCharacterScene", state);
                break;
            default:
                redirectToOopsScene(ctx);
                break;
        }
    })
);

module.exports = confirmScene;
