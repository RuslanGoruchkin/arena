import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { stateWrapper, t } from "../../helpers/ctx";
import { enterScene, keyboard } from "../../helpers/TelegramApiHelpers";

const equipScene = new Scene("equipScene");

//Add filter by level

equipScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let options = [];
        options[0] = [];
        let player = state.player;
        _.each(player.inventory, item => {
            if (!item.equipped) {
                options[0].push(item.name);
            }
        });
        options.push([t(state, "texts.back")]);
        return keyboard("Which item do you want to equip:", options, {
            playerId: state.player.id
        });
    })
);

equipScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        let player = state.player;
        if (player.inventory[text]) {
            let item = player.inventory[text];
            item.equipped = true;
            player.rightHand = item;
        }
        return enterScene(ctx, "inventoryScene", state);
    })
);

module.exports = equipScene;
