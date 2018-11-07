import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { keyboard } from "../../helpers/TelegramApiHelpers";
import { gameModules } from "../../gameModules";
import { stateWrapper, translate } from "../../helpers/ctx";
import { enterScene, redirectToOopsScene, replyWithMarkdown } from "../../helpers/TelegramApiHelpers";

const questScene = new Scene("questScene");

questScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        player.personalCoordinates.floor = player.currentFloor;
        if (_.get(player, "currentQuest.name")) {
            player.currentQuest.introPlayed = true;
            if (player.currentQuest.introScene) {
                enterScene(ctx, player.currentQuest.introScene, state);
            } else {
                return keyboard(
                    translate(state, `texts.quests.${player.currentQuest.name}.description`),
                    [[translate(state, "texts.ok")]],
                    { playerId: state.player.id }
                );
            }
        } else {
            enterScene(ctx, "mainScene", state);
        }
    })
);

questScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        if (ctx.update.message.text === translate(state, "texts.ok") || ctx.update.message.text === translate(state, "texts.accept")) {
            if (player.finalFightWasStarted) {
                enterScene(ctx, "selectCharacterScene", state);
            }
            if (player.currentQuest) {
                let extra = player.currentQuest.extra;
                if (extra) {
                    if (extra.module) {
                        let extraModule = _.find(gameModules, module => {
                            return module.name === extra.module.name;
                        });
                        extraModule.id = extra.module.id;
                        player.data.inventory.push(extraModule);
                    }
                }
                let questDescriptionText = translate(state, `texts.quests.${player.currentQuest.name}.description`);
                replyWithMarkdown(questDescriptionText, { playerId: state.player.id });
            }
            enterScene(ctx, "mainScene", state);
        } else {
            redirectToOopsScene(ctx);
        }
    })
);

module.exports = questScene;
