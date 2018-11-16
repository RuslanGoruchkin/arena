import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { stateWrapper, t } from "../../helpers/ctx";
import { enterScene, keyboard, redirectToOopsScene } from "../../helpers/TelegramApiHelpers";

const characterScene = new Scene("characterScene");

characterScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let selectedCharacter = player.selectedCharacter;
        let message = t(state, "texts.mainScenes.characterScene.descriptionCharacter", {
            charClass: t(state, `menu.characters.${selectedCharacter.class}`),
            nickname: player.nickname,
            level: player.level,
            xp: player.XP,
            coins: player.data.coins,
            tokens: player.data.tokens,
            strength: player.strength,
            dexterity: player.dexterity,
            intelligence: player.intelligence,
            wisdom: player.wisdom,
            vitality: player.vitality,
            rightHandName: player.rightHand.name
        });
        return keyboard(message, [[t(state, "texts.back")]], { playerId: state.player.id });
    })
);

characterScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        switch (text) {
            case t(state, "texts.back"):
                enterScene(ctx, "mainMenuScene", state);
                break;
            default:
                redirectToOopsScene(ctx);
                break;
        }
    })
);

module.exports = characterScene;
