import { getItemByClassCaption, startNewGame } from "../../util";
import Scene from "telegraf/scenes/base";
import { stateWrapper, t } from "../../helpers/ctx";
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
        let message = t(state, "texts.startScenes.confirmScene.descriptionCharacter", {
            charClass: t(state, `menu.characters.${selectedCharacter.class}`),
            description: selectedCharacter.description,
            nickname: player.nickname,
            strength: player.strength,
            dexterity: player.dexterity,
            intelligence: player.intelligence,
            wisdom: player.wisdom,
            vitality: player.vitality
        });
        return replyWithPhotoAndKeyboard(
            message,
            `http://hackerpunk.s3.amazonaws.com/characters/${selectedCharacter.class}.png`,
            [
                [t(state, "texts.startScenes.confirmScene.otherCharacter")],
                [t(state, "texts.ok")]
            ],
            { playerId: state.player.id }
        );
    })
);

confirmScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        switch (ctx.update.message.text) {
            case t(state, "texts.ok"):
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
