import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { keyboard } from "../../helpers/TelegramApiHelpers";
import { moduleConfig } from "../../moduleConfig";
import { gameModules } from "../../gameModules";
import { stateWrapper, translate } from "../../helpers/ctx";
import { enterScene, redirectToOopsScene, replyWithMarkdown } from "../../helpers/TelegramApiHelpers";

const moduleCharacteristicsViewerScene = new Scene("moduleCharacteristicsViewerScene");

let moduleCounter = 2;

moduleCharacteristicsViewerScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let characteristics = ``;
        let module = _.find(gameModules, module => {
            return translate(state, `texts.modules.${module.name}`) === ctx.session.player.moduleForBuy.name;
        });
        _.each(moduleConfig[module.name][player.moduleForBuy.level], (value, key) => {
            characteristics += `${translate(state, `texts.modules.characteristics.${key}`)}: ${value} \n`;
        });
        let message = translate(state, "texts.shopScenes.moduleCharacteristicsViewerScene.moduleDescription", {
            name: state.player.moduleForBuy.name,
            level: state.player.moduleForBuy.level,
            characteristics: characteristics
        });
        let buttons = [[translate(state, "menu.confirm.confirm"), translate(state, "texts.back")]];
        return keyboard(message, buttons, { playerId: state.player.id });
    })
);

moduleCharacteristicsViewerScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let text = ctx.update.message.text;
        switch (text) {
            case translate(state, "texts.back"):
                enterScene(ctx, "selectModuleLevelScene", state);
                break;
            case translate(state, "menu.confirm.confirm"):
                let data = player.data;
                if (data.coins - player.moduleForBuy.price > 0) {
                    let module = _.find(gameModules, module => {
                        return translate(state, `texts.modules.${module.name}`) === ctx.session.player.moduleForBuy.name;
                    });
                    _.each(moduleConfig[module.name][player.moduleForBuy.level], (value, key) => {
                        module[key] = value;
                    });
                    module.level = player.moduleForBuy.level;
                    module.isVisible = true;
                    module.id = ++moduleCounter;
                    data.inventory.push(_.cloneDeep(module));
                    data.coins -= player.moduleForBuy.price;
                    let modulePurchasedText = translate(state, "texts.shopScenes.buyModuleScene.modulePurchased");
                    replyWithMarkdown(modulePurchasedText, { playerId: state.player.id }).then(enterScene(ctx, "buyModuleScene", state));
                } else {
                    let notEnoughFundsText = translate(state, "texts.shopScenes.buyModuleScene.notEnoughFunds");
                    replyWithMarkdown(notEnoughFundsText, { playerId: state.player.id }).then(enterScene(ctx, "vendorModuleScene", state));
                }
                break;
            default:
                redirectToOopsScene(ctx);
        }
    })
);

module.exports = moduleCharacteristicsViewerScene;
