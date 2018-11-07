import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { getOwnerModule } from "../../../util";
import { getModule, setModule, stateWrapper, translate } from "../../../helpers/ctx";
import { enterScene, keyboard, redirectToOopsScene } from "../../../helpers/TelegramApiHelpers";

const walletDefeatedActionScene = new Scene("walletDefeatedActionScene");

walletDefeatedActionScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let coordinates = player.coordinates;
        let ownerId = getOwnerModule(state, { floor: player.currentFloor, x: coordinates.xPos, y: coordinates.yPos });
        let module = getModule(state, { floor: player.currentFloor, x: coordinates.xPos, y: coordinates.yPos });
        if (module.isStolen) {
            return keyboard(ctx, translate(state, "texts.versusScenes.walletDefeatedActionScene.alreadyStolen"), [
                [translate(state, "texts.back")]
            ]);
        } else {
            let availableCash = _.get(state.players, `${ownerId}.state.coins`);
            let message = translate(state, "texts.versusScenes.walletDefeatedActionScene.canStealCash", {
                availableCash: Math.floor(availableCash / 2)
            });
            return keyboard(
                message,
                [[translate(state, "texts.versusScenes.walletDefeatedActionScene.stealAction")], [translate(state, "texts.back")]],
                { playerId: state.player.id }
            );
        }
    })
);

walletDefeatedActionScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let coordinates = player.coordinates;
        let ownerId = getOwnerModule(state, { floor: player.currentFloor, x: coordinates.xPos, y: coordinates.yPos });
        let availableCash = _.get(state.players, `${ownerId}.state.coins`);
        // let availableCash = playersArray[ownerId].state.coins;
        switch (ctx.update.message.text) {
            case translate(state, "texts.versusScenes.walletDefeatedActionScene.stealAction"):
                let module = getModule(ctx, { floor: player.currentFloor, x: coordinates.xPos, y: coordinates.yPos });
                player.data.coins += Math.floor(availableCash / 2);
                state.players[ownerId].state.coins -= Math.floor(availableCash / 2);
                setModule(
                    state,
                    {
                        ...module,
                        isStolen: true
                    },
                    { floor: player.currentFloor, x: coordinates.xPos, y: coordinates.yPos }
                );
                enterScene(ctx, "mainScene", state);
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

module.exports = walletDefeatedActionScene;
