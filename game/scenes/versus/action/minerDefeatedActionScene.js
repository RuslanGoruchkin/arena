import Scene from "telegraf/scenes/base";
import { getOwnerModule } from "../../../util";
import { getModule, setModule, stateWrapper, translate } from "../../../helpers/ctx";
import _ from "lodash";
import { enterScene, keyboard, redirectToOopsScene } from "../../../helpers/TelegramApiHelpers";

const minerDefeatedActionScene = new Scene("minerDefeatedActionScene");

minerDefeatedActionScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let coordinates = player.coordinates;
        let params = { ctx, playerId: player.id, floor: player.currentFloor, x: coordinates.xPos, y: coordinates.yPos };
        let module = getModule(state, params);
        if (module.isStolen) {
            let message = translate(state, "texts.selectAction");
            return keyboard(message, [[translate(state, "texts.back")]], params);
        } else {
            let availableCash;
            if (_.includes(player.currentFloor, "fight")) {
                let ownerId = parseInt(getOwnerModule(state, { floor: player.currentFloor, x: coordinates.xPos, y: coordinates.yPos }));
                availableCash = Math.floor(player.quest.server.coins / 2) === 0 ? 0 : Math.floor(player.quest.server.coins / 2);
            } else {
                availableCash = Math.floor(module.volume / 2);
            }
            let message = translate(state, "texts.versusScenes.minerDefeatedActionScene.stealMiner", { coins: availableCash });
            return keyboard(
                message,
                [[translate(state, "texts.versusScenes.minerDefeatedActionScene.stealAction")], [translate(state, "texts.back")]],
                params
            );
        }
    })
);

minerDefeatedActionScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let data = player.data;
        let coordinates = player.coordinates;
        let params = { ctx, playerId: player.id, floor: player.currentFloor, x: coordinates.xPos, y: coordinates.yPos };
        let module = getModule(state, params);
        switch (ctx.update.message.text) {
            case translate(state, "texts.versusScenes.minerDefeatedActionScene.stealAction"):
                let availableCash;
                if (_.includes(player.currentFloor, "fight")) {
                    // let ownerId = parseInt(getOwnerModule(state, { floor: player.currentFloor, x: coordinates.xPos, y: coordinates.yPos }));
                    availableCash = Math.floor(player.quest.server.coins / 2) === 0 ? 0 : Math.floor(player.quest.server.coins / 2);
                    player.quest.server.coins -= availableCash;
                } else {
                    availableCash = Math.floor(module.volume / 2);
                    state = setModule(state, { ...module, volume: module.volume - availableCash }, params);
                }
                data.coins += availableCash;
                state = setModule(state, { ...module, isStolen: true }, params);
                enterScene(ctx, "minerDefeatedActionScene", state);
                break;
            case translate(state, "texts.back"):
                enterScene(ctx, "mainScene", state);
                break;
            default:
                redirectToOopsScene(ctx);
                break;
        }
    })
);

module.exports = minerDefeatedActionScene;
