import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { consumables } from "../../resources/consumables";
import { enterScene, keyboard, stateWrapper, replyWithMarkdown, redirectToOopsScene, t } from "../../helpers";

const levelUpScene = new Scene("levelUpScene");

levelUpScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let message = "";

        message += "What CLASS would you want to upgrade?\n\n";

        let buttons = [
            [t(state, "menu.characters.warrior"), t(state, "menu.characters.mage")],
            [t(state, "menu.characters.evangelist"), t(state, "menu.characters.prophet")],
            [t(state, "menu.characters.nomad")]
        ];
        if (!player.data.classPoints) {
            buttons = [];
        }
        message +=
            "Player: " +
            player.nickname +
            " " +
            player.level +
            " level\nHP: " +
            player.data.hp +
            "SP: " +
            player.data.sp +
            "MP: " +
            player.data.mp +
            "\n\nClass upgrades: " +
            player.data.classPoints +
            "\n Attribute upgrades: " +
            player.data.statPoints;
        _.forEach(player.selectedCharacter.classes, function(classLvl, key) {
            if (classLvl || state.player.data.levelBuffer.cls[key]) message += "\n";
            if (classLvl) {
                message += t(state, `menu.characters.${key}`) + " " + classLvl + " lvl";
            }
            if (state.player.data.levelBuffer.cls[key] >= 1) {
                let futureLvl = state.player.data.levelBuffer.cls[key] + classLvl;
                message +=
                    " ➕ " +
                    state.player.data.levelBuffer.cls[key] +
                    " ➡️ " +
                    t(state, `menu.characters.${key}`) +
                    " " +
                    futureLvl +
                    " lvl";
            }
        });
        _.forEach(state.player.data.levelBuffer.att, function(value, att) {
            message += "\n" + t(state, `texts.attributes.${att}`) + ": " + player.selectedCharacter[att];
            if (value >= 1) {
                let futureAtt = player.selectedCharacter[att] + value;
                message += " ➕ " + value + " ➡️ " + futureAtt;
            }
        });

        buttons.push([t(state, "texts.ok"), "RESET", "LATER"]);
        return keyboard(message, buttons, { playerId: state.player.id }, state);
    })
);

levelUpScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        let player = state.player;
        let data = player.data;
        switch (text) {
            case t(state, "menu.characters.warrior"):
                state.player.data.levelBuffer.cls.warrior += 1;
                data.classPoints -= 1;
                return enterScene(ctx, "levelUpScene", state);
                break;
            case t(state, "menu.characters.mage"):
                state.player.data.levelBuffer.cls.mage += 1;
                data.classPoints -= 1;
                return enterScene(ctx, "levelUpScene", state);
                break;
            case t(state, "menu.characters.evangelist"):
                state.player.data.levelBuffer.cls.evangelist += 1;
                data.classPoints -= 1;
                return enterScene(ctx, "levelUpScene", state);
                break;
            case t(state, "menu.characters.prophet"):
                state.player.data.levelBuffer.cls.prophet += 1;
                data.classPoints -= 1;
                return enterScene(ctx, "levelUpScene", state);
                break;
            case t(state, "menu.characters.nomad"):
                state.player.data.levelBuffer.cls.nomad += 1;
                data.classPoints -= 1;
                return enterScene(ctx, "levelUpScene", state);
                break;
            case t(state, "texts.ok"):
                return enterScene(ctx, "statScene", state);
                break;
            case "RESET":
                data.classPoints += _.sum(state.player.data.levelBuffer.cls);
                _.fill(state.player.data.levelBuffer.cls, 0);
                return enterScene(ctx, "levelUpScene", state);
                break;
            case "LATER":
                data.classPoints += _.sum(state.player.data.levelBuffer.cls);
                _.fill(state.player.data.levelBuffer.cls, 0);
                data.activity = "";
                return enterScene(ctx, "mainScene", state);
                break;
        }
    })
);

module.exports = levelUpScene;
