import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { enterScene, keyboard, redirectToOopsScene, stateWrapper, t } from "../../helpers";
import { consumables } from "../../resources/consumables";

const levelUpConfirmScene = new Scene("levelUpConfirmScene");

levelUpConfirmScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let selectedCharacter = player.selectedCharacter;
        let message = "";
        let charClass = "\n";
        _.forEach(selectedCharacter.classes, function(value, key) {
            if (value > 0) {
                charClass += t(state, `menu.characters.${key}`) + " " + value + " lvl\n";
            }
        });
        message += t(state, "texts.levelUpConfirm", {
            charClass: charClass,
            nickname: player.nickname,
            level: player.level,
            xp: player.XP,
            strength: player.selectedCharacter.baseStrength,
            dexterity: player.selectedCharacter.baseDexterity,
            intelligence: player.selectedCharacter.baseIntelligence,
            wisdom: player.selectedCharacter.baseWisdom,
            vitality: player.selectedCharacter.baseVitality,
            hp: player.data.hp,
            mp: player.data.mp
        });
        return keyboard(message, [[t(state, "texts.ok")]], { playerId: state.player.id }, state);
    })
);

levelUpConfirmScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        switch (text) {
            case t(state, "texts.ok"):
                state.player.data.activity = "";
                return enterScene(ctx, "mainScene", state);
            default:
                return redirectToOopsScene(ctx, state);
        }
    })
);

module.exports = levelUpConfirmScene;
