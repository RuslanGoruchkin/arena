import Scene from "telegraf/scenes/base";
import { gameModules } from "../../gameModules";
import { enterScene } from "../../helpers/TelegramApiHelpers";
import { getModule, stateWrapper, translate } from "../../helpers/ctx";
import { redirectToOopsScene, replyWithMarkdown } from "../../helpers/TelegramApiHelpers";

const moduleRouterScene = new Scene("moduleRouterScene");

moduleRouterScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let coordinates = player.coordinates;
        let params = { ctx, playerId: player.id, floor: player.currentFloor, x: coordinates.xPos, y: coordinates.yPos };
        switch (getModule(state, params).character) {
            case gameModules.miner.character:
                enterScene(ctx, "minerModuleScene", state);
                break;
            case gameModules.wallet.character:
                enterScene(ctx, "walletModuleScene", state);
                break;
            case gameModules.antivirus.character:
                enterScene(ctx, "antivirusModuleScene", state);
                break;
            case gameModules.firewall.character:
                enterScene(ctx, "firewallModuleScene", state);
                break;
            case gameModules.storage.character:
                enterScene(ctx, "storageModuleScene", state);
                break;
            case gameModules.processor.character:
                enterScene(ctx, "processorModuleScene", state);
                break;
            case gameModules.availableSpace.character:
                enterScene(ctx, "availableSpaceModuleScene", state);
                break;
            case gameModules.sewerHatch.character:
                player.currentFloor = "4x4_tech";
                let basementLevelText = translate(state, "texts.mainScenes.moduleRouterScene.basementLevel");
                replyWithMarkdown(basementLevelText, { playerId: state.player.id }).then(enterScene(ctx, "mainScene", state));
                break;
            case gameModules.stairs.character:
                player.currentFloor = "4x4";
                let playerLevelText = translate(state, "texts.mainScenes.moduleRouterScene.playerLevel");
                replyWithMarkdown(playerLevelText, { playerId: state.player.id }).then(enterScene(ctx, "mainScene", state));
                break;
            case gameModules.programVendor.character:
                enterScene(ctx, "vendorProgramScene", state);
                break;
            case gameModules.moduleVendor.character:
                enterScene(ctx, "vendorModuleScene", state);
                break;
            case gameModules.elevator.character:
                enterScene(ctx, "elevatorModuleScene", state);
                break;
            case gameModules.relocationMaster.character:
                enterScene(ctx, "relocationMasterScene", state);
                break;
            case gameModules.dailyNPC.character:
                ctx.scene.enter("dailyNPCScene");
                break;
            default:
                redirectToOopsScene(ctx);
                break;
        }
    })
);

module.exports = moduleRouterScene;
