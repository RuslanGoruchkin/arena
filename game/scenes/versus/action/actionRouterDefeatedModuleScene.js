import Scene from "telegraf/scenes/base";
import { gameModules } from "../../../gameModules";
import { enterScene } from "../../../helpers/TelegramApiHelpers";
import { stateWrapper } from "../../../helpers/ctx";
import _ from "lodash";
import { redirectToOopsScene } from "../../../helpers/TelegramApiHelpers";

const actionRouterDefeatedModuleScene = new Scene("actionRouterDefeatedModuleScene");

actionRouterDefeatedModuleScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let coordinates = player.coordinates;
        let newMap = ctx.state.map;

        let module = newMap[player.currentFloor][coordinates.xPos][coordinates.yPos];
        switch (module.character) {
            case gameModules.processor.character:
                enterScene(ctx, "processorDefeatedActionScene", state);
                break;
            case gameModules.storage.character:
                enterScene(ctx, "storageDefeatedActionScene", state);
                break;
            case gameModules.miner.character:
                enterScene(ctx, "minerDefeatedActionScene", state);
                break;
            case gameModules.wallet.character:
                if (_.includes(player.currentFloor, "_quest") || _.includes(player.currentFloor, "fight")) {
                    enterScene(ctx, "questWalletDefeatedActionScene", state);
                } else {
                    enterScene(ctx, "walletDefeatedActionScene", state);
                }
                break;
            case gameModules.antivirus.character:
                enterScene(ctx, "antivirusDefeatedActionScene", state);
                break;
            case gameModules.firewall.character:
                enterScene(ctx, "firewallDefeatedActionScene", state);
                break;
            default:
                redirectToOopsScene(ctx);
                break;
        }
    })
);

module.exports = actionRouterDefeatedModuleScene;
