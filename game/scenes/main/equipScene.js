import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { enterScene, keyboard, stateWrapper, t, replyWithMarkdown } from "../../helpers";

const equipScene = new Scene("equipScene");

//Add filter by level

equipScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let options = [];
        options[0] = [];
        let player = state.player;
        _.each(player.selectedCharacter.inventory, item => {
            if (!item.equipped) {
                options[0].push(item.name);
            }
        });
        options.push([t(state, "texts.back")]);
        return keyboard(
            "Which item do you want to equip?",
            options,
            {
                playerId: state.player.id
            },
            state
        );
    })
);

equipScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        let player = state.player.selectedCharacter;
        let item = _.find(player.inventory, { name: text });
        if (item) {
            let index = _.findIndex(player.inventory, { name: text });
            console.log(index);
            if (item.type === "weapon" && !player.rightHand.type) {
                player.rightHand = _.cloneDeep(item);
                player.inventory.splice(index, 1);
            } else if (item.type === "weapon" && !player.leftHand.type) {
                player.leftHand = _.cloneDeep(item);
                player.inventory.splice(index, 1);
            } else if (item.type === "armor" && !player.armor.type) {
                player.armor = _.cloneDeep(item);
                player.inventory.splice(index, 1);
            } else {
                replyWithMarkdown("Your hands are already busy", { playerId: state.player.id }, state);
            }
        }
        return enterScene(ctx, "inventoryScene", state);
    })
);

module.exports = equipScene;
