import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { consumables } from "../../resources/consumables";
import { enterScene, keyboard, stateWrapper, redirectToOopsScene, t } from "../../helpers";

const statScene = new Scene("statScene");

statScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let message = "What ATTRIBUTE would you want to upgrade?\n\n";
        let buttons = [
            [t(state, "texts.attributes.baseStrength"), t(state, "texts.attributes.baseDexterity")],
            [t(state, "texts.attributes.baseIntelligence"), t(state, "texts.attributes.baseWisdom")],
            [t(state, "texts.attributes.baseVitality")]
        ];
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
            if (classLvl || state.levelBuffer.cls[key]) message += "\n";
            if (classLvl) {
                message += t(state, `menu.characters.${key}`) + " " + classLvl + " lvl";
            }
            if (state.levelBuffer.cls[key] >= 1) {
                let futureLvl = state.levelBuffer.cls[key] + classLvl;
                message += " ➕ " + state.levelBuffer.cls[key] + " ➡️ " + t(state, `menu.characters.${key}`) + " " + futureLvl + " lvl";
            }
        });
        _.forEach(state.levelBuffer.att, function(value, att) {
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

statScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        let player = state.player;
        let selectedCharacter = player.selectedCharacter;
        switch (ctx.update.message.text) {
            case t(state, "texts.attributes.baseStrength"):
                state.levelBuffer.att.baseStrength += 1;
                data.statPoints -= 1;
                return enterScene(ctx, "statScene", state);
            case t(state, "texts.attributes.baseDexterity"):
                state.levelBuffer.att.baseDexterity += 1;
                data.statPoints -= 1;
                return enterScene(ctx, "statScene", state);
            case t(state, "texts.attributes.baseIntelligence"):
                state.levelBuffer.att.baseIntelligence += 1;
                data.statPoints -= 1;
                return enterScene(ctx, "statScene", state);
            case t(state, "texts.attributes.baseWisdom"):
                state.levelBuffer.att.baseWisdom += 1;
                data.statPoints -= 1;
                return enterScene(ctx, "statScene", state);
            case t(state, "texts.attributes.baseVitality"):
                state.levelBuffer.att.baseVitality += 1;
                data.statPoints -= 1;
                return enterScene(ctx, "statScene", state);
            case t(state, "texts.ok"):

                _.forEach(player.selectedCharacter.classes, function(classLvl, key) {
                    player.selectedCharacter.classes[key] = classLvl + state.levelBuffer.cls[key];
                    state.levelBuffer.cls[key] = 0;
                });
                _.forEach(state.levelBuffer.att, function(value, att) {
                    player.selectedCharacter.classes[att] = value + player.selectedCharacter.classes[att];
                    state.levelBuffer.att[att] = 0;
                });
                return enterScene(ctx, "mainScene", state);
            case "RESET":
                data.classPoints += _.sum(state.levelBuffer.cls);
                _.fill(state.levelBuffer.cls, 0);
                data.statPoints += _.sum(state.levelBuffer.att);
                _.fill(state.levelBuffer.att, 0);
                return enterScene(ctx, "levelUpScene", state);
            case "LATER":
                data.classPoints += _.sum(state.levelBuffer.cls);
                _.fill(state.levelBuffer.cls, 0);
                data.statPoints += _.sum(state.levelBuffer.att);
                _.fill(state.levelBuffer.att, 0);
                data.activity = "";
                return enterScene(ctx, "mainScene", state);
        }})
);

module.exports = statScene;
