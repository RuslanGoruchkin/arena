import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { keyboard } from "../../../helpers/TelegramApiHelpers";
import { createDailyQuest } from "../../../map";
import { modules } from "../../../modules";
import { programs } from "../../../resources/programs";
import { weeklyQuestServers } from "../../../resources/weeklyQuestServers";
import { stateWrapper, translate } from "../../../helpers/ctx";
import { enterScene } from "../../../helpers/TelegramApiHelpers";

const weeklyIntroScene = new Scene("weeklyIntroScene");

weeklyIntroScene.enter(ctx => {
    stateWrapper(ctx, (ctx, state) => {
        return keyboard(ctx, translate(state, "texts.quests.weeklyIntroScene"), [translate(state, "texts.go")], {
            playerId: state.player.id
        });
    });
});

weeklyIntroScene.on("text", ctx => {
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let data = player.state.data;
        switch (ctx.update.message.text) {
            case translate(state, "texts.go"):
                player.currentFloor = "fight";
                let specialStorage = _.cloneDeep(modules.storage);
                specialStorage.programs = [
                    _.cloneDeep({
                        name: "Information" + player.currentQuest.name,
                        key: player.currentQuest.name,
                        level: 1
                    })
                ];
                let enemyServer = _.get(weeklyQuestServers, player.currentQuest.name);
                ctx.session.alreadyStolen = false;
                ctx.session.serverCoins = 1000;
                //programs for testing
                data.programsInMemory = [programs.hack, programs.hack, programs.hack, programs.scan, programs.scan, programs.scan];
                createDailyQuest(ctx, enemyServer, true, 500);
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

module.exports = weeklyIntroScene;
