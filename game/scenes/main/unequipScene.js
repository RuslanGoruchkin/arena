import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { stateWrapper, t } from "../../helpers/ctx";
import { enterScene, keyboard } from "../../helpers/TelegramApiHelpers";

const unequipScene = new Scene("unequipScene");

//Add filter by level

unequipScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let options = [];
        options[0] = [];
        let player = state.player;
        if (player.rightHand.equipped) {
            options[0].push(player.rightHand.name);
        }
        if (player.leftHand.equipped) {
            options[0].push(player.leftHand.name);
        }
        if (player.armor.equipped) {
            options[0].push(player.armor.name);
        }
        console.log(options);
        options.push([t(state, "texts.back")]);
        console.log(options);
        return keyboard("Which item do you want to unequip?", options, {
            playerId: state.player.id
        });
    })
);

unequipScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        let player = state.player;
        if (player.inventory[text]) {
            let item = player.inventory[text];
            item.equipped = false;
            player.rightHand = {};
        }
        return enterScene(ctx, "inventoryScene", state);
    })
);

module.exports = unequipScene;
