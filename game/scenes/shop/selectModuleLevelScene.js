import Scene from "telegraf/scenes/base";
import { keyboard } from "../../helpers/TelegramApiHelpers";
import { stateWrapper, t } from "../../helpers/ctx";
import { enterScene } from "../../helpers/TelegramApiHelpers";

const selectModuleLevelScene = new Scene("selectModuleLevelScene");

selectModuleLevelScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let message = t(state, "texts.modulesScenes.selectCreatedProgramLevelScene.selectProgramLevel");
        let buttons = [];
        for (let level = 1; level <= player.level; level++) {
            if (level <= 9) {
                buttons.push([
                    `${level} ${t(state, "texts.versusScenes.selectAttackProgramScene.levelOfProgram")}: ${2 ** (level - 1) *
                        100} ${t(state, "texts.currency")}`
                ]);
            }
        }
        buttons.push([t(state, "texts.back")]);
        return keyboard(message, buttons, { playerId: state.player.id });
    })
);

selectModuleLevelScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        let player = state.player;
        if (text === t(state, "texts.back")) {
            enterScene(ctx, "buyModuleScene", state);
        } else {
            let split = text.split(" ");
            let price = parseInt(split[2]);
            let level = parseInt(split[0]);
            player.moduleForBuy.price = price;
            player.moduleForBuy.level = level;
            enterScene(ctx, "moduleCharacteristicsViewerScene", state);
        }
    })
);

module.exports = selectModuleLevelScene;
