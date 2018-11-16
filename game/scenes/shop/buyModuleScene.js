import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { keyboard } from "../../helpers/TelegramApiHelpers";
import { gameModules } from "../../gameModules";
import { stateWrapper, t } from "../../helpers/ctx";
import { enterScene, redirectToOopsScene } from "../../helpers/TelegramApiHelpers";

const buyModuleScene = new Scene("buyModuleScene");

buyModuleScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        return keyboard(
            t(state, "texts.shopScenes.buyModuleScene.typeOfModule", { balance: state.player.data.coins }),
            [
                [`${t(state, "menu.shop.processor")}`, `${t(state, "menu.shop.storage")}`],
                [`${t(state, "menu.shop.miner")}`, `${t(state, "menu.shop.wallet")}`],
                [`${t(state, "menu.shop.antivirus")}`, `${t(state, "menu.shop.firewall")}`],
                [t(state, "menu.shop.back")]
            ],
            { playerId: state.player.id }
        );
    })
);

buyModuleScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        if (text === t(state, "texts.back")) {
            enterScene(ctx, "vendorModuleScene", state);
        } else {
            let split = text.split(" ");
            let availableForBuy = [
                t(state, `texts.modules.${gameModules.processor.name}`),
                t(state, `texts.modules.${gameModules.storage.name}`),
                t(state, `texts.modules.${gameModules.miner.name}`),
                t(state, `texts.modules.${gameModules.wallet.name}`),
                t(state, `texts.modules.${gameModules.antivirus.name}`),
                t(state, `texts.modules.${gameModules.firewall.name}`)
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
