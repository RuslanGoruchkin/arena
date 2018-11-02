import Scene from "telegraf/scenes/base";
import { keyboard } from "../../../helpers/TelegramApiHelpers";
import { quests } from "../../../resources/quests";
import _ from "lodash";
import { stateWrapper, translate } from "../../../helpers/ctx";
import { enterScene } from "../../../helpers/TelegramApiHelpers";

const weeklyNPCScene = new Scene("weeklyNPCScene");

weeklyNPCScene.enter(ctx => {
    stateWrapper(ctx, (ctx, state) => {
        return keyboard(ctx, "Daily Quest Intro", [translate(state, "texts.accept"), translate(state, "texts.decline")], {
            playerId: state.player.id
        });
    });
});

weeklyNPCScene.on("text", ctx => {
    stateWrapper(ctx, (ctx, state) => {
        switch (ctx.update.message.text) {
            case translate(state, "texts.accept"):
                let player = state.player;
                let questsNames = _.map(quests, "name");
                let dailyQuests = questsNames.filter(name => name.match(/^weekly/));
                let completedQuestsNames = _.get(player.state.data.completedQuests.name);
                let unfinishedQuests = _.difference(dailyQuests, completedQuestsNames);
                let pickedQuestName = unfinishedQuests[Math.floor(Math.random() * unfinishedQuests.length)];
                player.currentQuest = quests[pickedQuestName];
                enterScene(ctx, "weeklyIntroScene", state);
                break;
            case translate(state, "texts.decline"):
                ctx.replyWithMarkdown("You don't like Quest? Well...");
                player.currentFloor = "4x4";
                enterScene(ctx, "mainScene", state);
                break;
            default:
                console.log(
                    `User ${ctx.update.message.from.first_name} ${ctx.update.message.from.last_name} ${
                        ctx.update.message.from.id
                    } tries to write "${ctx.update.message.text}" in ${ctx.session.__scenes.current}`
                );
                ctx.session.player.lastScene = ctx.session.__scenes.current;
                enterScene(ctx, "oopsScene", state);
                break;
        }
    });
});

module.exports = weeklyNPCScene;
