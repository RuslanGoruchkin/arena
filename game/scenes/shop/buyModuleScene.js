import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { keyboard } from "../../helpers/TelegramApiHelpers";
import { gameModules } from "../../gameModules";
import { stateWrapper, translate } from "../../helpers/ctx";
import { enterScene, redirectToOopsScene } from "../../helpers/TelegramApiHelpers";

const buyModuleScene = new Scene("buyModuleScene");

buyModuleScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        return keyboard(
            translate(state, "texts.shopScenes.buyModuleScene.typeOfModule", { balance: state.player.data.coins }),
            [
                [`${translate(state, "menu.shop.processor")}`, `${translate(state, "menu.shop.storage")}`],
                [`${translate(state, "menu.shop.miner")}`, `${translate(state, "menu.shop.wallet")}`],
                [`${translate(state, "menu.shop.antivirus")}`, `${translate(state, "menu.shop.firewall")}`],
                [translate(state, "menu.shop.back")]
            ],
            { playerId: state.player.id }
        );
    })
);

buyModuleScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        if (text === translate(state, "texts.back")) {
            enterScene(ctx, "vendorModuleScene", state);
        } else {
            let split = text.split(" ");
            let availableForBuy = [
                translate(state, `texts.modules.${gameModules.processor.name}`),
                translate(state, `texts.modules.${gameModules.storage.name}`),
                translate(state, `texts.modules.${gameModules.miner.name}`),
                translate(state, `texts.modules.${gameModules.wallet.name}`),
                translate(state, `texts.modules.${gameModules.antivirus.name}`),
                translate(state, `texts.modules.${gameModules.firewall.name}`)
            ];
            let moduleName = split[1];
            if (_.includes(availableForBuy, moduleName)) {
                state.player.moduleForBuy = {};
                state.player.moduleForBuy.name = moduleName;
                enterScene(ctx, "selectModuleLevelScene", state);
            } else {
                redirectToOopsScene(ctx);
            }
        }
    })
);

module.exports = buyModuleScene;
