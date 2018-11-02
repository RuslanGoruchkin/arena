import Scene from "telegraf/scenes/base";
import { placeModuleToInventory } from "../../util";
import { getModule, setModule, stateWrapper, translate } from "../../helpers/ctx";
import { enterScene, keyboard, redirectToOopsScene, replyWithMarkdown } from "../../helpers/TelegramApiHelpers";

const minerModuleScene = new Scene("minerModuleScene");

minerModuleScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let coordinates = player.coordinates;
        let params = { ctx, playerId: player.id, floor: player.currentFloor, x: coordinates.xPos, y: coordinates.yPos };
        let message = translate(state, "texts.modulesScenes.minerModuleScene.balanceInStorage", {
            balance: getModule(state, params).volume
        });
        return keyboard(
            message,
            [
                [translate(state, "texts.modulesScenes.minerModuleScene.withdraw")],
                [translate(state, "texts.modulesScenes.manageModuleScene.placeModuleToInventory")],
                [translate(state, "texts.back")]
            ],
            params
        );
    })
);

minerModuleScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let coordinates = player.coordinates;
        let params = { ctx, playerId: player.id, floor: player.currentFloor, x: coordinates.xPos, y: coordinates.yPos };
        switch (ctx.update.message.text) {
            case translate(state, "texts.modulesScenes.minerModuleScene.withdraw"):
                enterScene(ctx, "mainScene", state);
                let miner = getModule(state, params);
                let amount = miner.volume;
                if (amount > 0) {
                    player.data.coins += amount;
                    state = setModule(state, { ...module, volume: 0 }, params);
                    let withdrawnText = translate(state, "texts.modulesScenes.minerModuleScene.withdrawn", { coins: amount });
                    replyWithMarkdown(withdrawnText, { playerId: state.player.id });
                }
                break;
            case translate(state, "texts.back"):
                enterScene(ctx, "mainScene", state);
                break;
            case translate(state, "texts.modulesScenes.manageModuleScene.placeModuleToInventory"):
                placeModuleToInventory(state, { ctx });
                break;
            default:
                redirectToOopsScene(ctx);
                break;
        }
    })
);

module.exports = minerModuleScene;
