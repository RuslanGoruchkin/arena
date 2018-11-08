import Scene from "telegraf/scenes/base";
import { addXPToPlayer } from "../../util";
import { quests } from "../../resources/quests";
import { stateWrapper, translate } from "../../helpers/ctx";
import { enterScene, keyboard, redirectToOopsScene, replyWithMarkdown } from "../../helpers/TelegramApiHelpers";
import stateManager from "../../stateManager";

const rewardScene = new Scene("rewardScene");

rewardScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let data = player.data;
        let award = player.currentQuest.award;
        let awardText = "\n";
        let quest = player.currentQuest.name;
        player.personalCoordinates.floor = player.currentFloor;
        data.completedQuests[player.currentQuest.name] = true;
        if (award.XP) {
            state = addXPToPlayer(state, { playerId: player.id, XP: award.XP });
            awardText += `${translate(state, "texts.rooms.xp")}: ${player.currentQuest.XP} ${translate(state, "texts.rooms.points")}\n`;
        };
        if (award.coins) {
            data.coins += award.coins;
            awardText += `${translate(state, "texts.rooms.coins")}: ${award.coins}\n`;
        };
        if (award.tokens) {
            data.tokens += award.tokens;
            awardText += `${translate(state, "texts.rooms.tokens")}: ${award.tokens}\n`;
        };
        if (award.modules) {
            data.inventory.push(award.modules);
            awardText += `${translate(state, "texts.rooms.modules")}: ${award.modules}\n`;
        };
        if (award.programs) {
            data.programsInMemory.push(award.programs);
            awardText += `${translate(state, "texts.rooms.programs")}: ${award.programs}\n`;
        };
        let rewardForQuestText = translate(state, `texts.quests.rewardForQuest`, { award: awardText });
        replyWithMarkdown(rewardForQuestText, { playerId: state.player.id }).then(() => {
            return keyboard(translate(state, `texts.quests.${quest}.success`), [[translate(state, "texts.ok")]], {
                playerId: state.player.id
            }).then(() => {
                if (player.currentQuest) {
                    if (player.currentQuest.nextQuest) {
                        player.currentQuest = quests[player.currentQuest.nextQuest];
                        stateManager.sync(state);
                    } else {
                        player.currentQuest = undefined;
                        return enterScene(ctx, "mainScene", state);
                    }
                } else {
                    return enterScene(ctx, "mainScene", state);
                }
            });
        });
    })
);

rewardScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        if (ctx.update.message.text === translate(state, "texts.ok") || ctx.update.message.text === translate(state, "texts.accept")) {
            return enterScene(ctx, "questScene", state);
        } else {
            return redirectToOopsScene(ctx);
        }
    })
);

module.exports = rewardScene;