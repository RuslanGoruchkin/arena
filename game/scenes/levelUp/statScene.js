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
            [t(state, "texts.attributeNames.strength"), t(state, "texts.attributeNames.dexterity")],
            [t(state, "texts.attributeNames.intelligence"), t(state, "texts.attributeNames.wisdom")],
            [t(state, "texts.attributeNames.vitality")]
        ];
        if (!player.data.statPoints) {
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
            message += "\n" + t(state, `texts.attributeNames.${att}`) + ": " + player.selectedCharacter[att];
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
            case t(state, "texts.attributeNames.strength"):
                state.player.data.levelBuffer.att.strength += 1;
                state.player.data.statPoints -= 1;
                return enterScene(ctx, "statScene", state);
            case t(state, "texts.attributeNames.dexterity"):
                state.player.data.levelBuffer.att.dexterity += 1;
                state.player.data.statPoints -= 1;
                return enterScene(ctx, "statScene", state);
            case t(state, "texts.attributeNames.intelligence"):
                state.player.data.levelBuffer.att.intelligence += 1;
                state.player.data.statPoints -= 1;
                return enterScene(ctx, "statScene", state);
            case t(state, "texts.attributeNames.wisdom"):
                state.player.data.levelBuffer.att.wisdom += 1;
                state.player.data.statPoints -= 1;
                return enterScene(ctx, "statScene", state);
            case t(state, "texts.attributes.vitality"):
                state.player.data.levelBuffer.att.vitality += 1;
                state.player.data.statPoints -= 1;
                return enterScene(ctx, "statScene", state);
            case t(state, "texts.ok"):
                player.data.activity = "";

                _.forEach(player.selectedCharacter.classes, function(classLvl, key) {
                    player.selectedCharacter.classes[key] = classLvl + state.player.data.levelBuffer.cls[key];
                    state.player.data.levelBuffer.cls[key] = 0;
                });
                _.forEach(state.player.data.levelBuffer.att, function(value, att) {
                    player.selectedCharacter.classes[att] = value + player.selectedCharacter.classes[att];
                    state.player.data.levelBuffer.att[att] = 0;
                });
                return enterScene(ctx, "mainScene", state);
            case "RESET":
                state.player.data.classPoints += _.sum(_.values(state.player.data.levelBuffer.cls));
                _.forEach(state.player.data.levelBuffer.cls, function(value, key) {
                    state.player.data.levelBuffer.cls[key] = 0;
                });
                //_.map(state.player.data.levelBuffer.cls, 0);
                state.player.data.statPoints += _.sum(_.values(state.player.data.levelBuffer.att));
                _.forEach(state.player.data.levelBuffer.att, function(value, key) {
                    state.player.data.levelBuffer.att[key] = 0;
                });
                return enterScene(ctx, "levelUpScene", state);
            case "LATER":
                player.data.activity = "";
                state.player.data.classPoints += _.sum(_.values(state.player.data.levelBuffer.cls));
                _.forEach(state.player.data.levelBuffer.cls, function(value, key) {
                    state.player.data.levelBuffer.cls[key] = 0;
                });
                //_.map(state.player.data.levelBuffer.cls, 0);
                state.player.data.statPoints += _.sum(_.values(state.player.data.levelBuffer.att));
                _.forEach(state.player.data.levelBuffer.att, function(value, key) {
                    state.player.data.levelBuffer.att[key] = 0;
                });
                return enterScene(ctx, "mainScene", state);
        }
    })
);

module.exports = statScene;
