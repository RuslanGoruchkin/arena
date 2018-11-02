import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { keyboard } from "../../helpers/TelegramApiHelpers";
import { stateWrapper, translate } from "../../helpers/ctx";
import { enterScene, replyWithMarkdown } from "../../helpers/TelegramApiHelpers";

const placeModuleScene = new Scene("placeModuleScene");
let moduleID = {};

placeModuleScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let data = player.data;
        if (_.isEmpty(data.inventory)) {
            let noModulesInInventoryText = translate(state, "texts.modulesScenes.placeModuleScene.noModulesInInventory");
            replyWithMarkdown(noModulesInInventoryText, { playerId: state.player.id }).then(enterScene(ctx, "moduleRouterScene", state));
        } else {
            let options = [];
            _.each(data.inventory, module => {
                //TODO: delete newItem, follow storageModuleScene
                let newItem = [];
                let description = translate(state, `texts.modules.${module.name}`);
                newItem.push(`${module.character} ${description} ${module.level} ${translate(state, "menu.level")}`);
                moduleID[newItem] = module.id;
                options.push(newItem);
            });
            options.push([translate(state, "texts.back")]);
            return keyboard(translate(state, "texts.modulesScenes.placeModuleScene.selectModuleToPlace"), options, {
                playerId: state.player.id
            });
        }
    })
);

placeModuleScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let data = player.data;
        let text = ctx.update.message.text;
        if (text === translate(state, "texts.back")) {
            enterScene(ctx, "mainScene", state);
        } else {
            let module = _.find(data.inventory, module => {
                return module.id === moduleID[text];
            });
            if (!module) {
                let incorrectDataText = translate(state, "texts.modulesScenes.placeModuleScene.incorrectData");
                replyWithMarkdown(incorrectDataText, { playerId: state.player.id }).then(enterScene(ctx, "placeModuleScene", state));
            } else {
                let element = _.indexOf(data.inventory, module);
                data.inventory.splice(element, 1);
                //todo set module
                state.map[player.currentFloor][player.coordinates.xPos][player.coordinates.yPos] = _.cloneDeep(module);
                let successfulPlacedText = translate(state, "texts.modulesScenes.placeModuleScene.successfulPlaced");
                replyWithMarkdown(successfulPlacedText, { playerId: state.player.id }).then(enterScene(ctx, "mainScene", state));
            }
        }
    })
);

module.exports = placeModuleScene;
