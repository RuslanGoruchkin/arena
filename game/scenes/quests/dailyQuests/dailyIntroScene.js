import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { keyboard } from "../../../helpers/TelegramApiHelpers";
import { createDailyQuest } from "../../../map";
import { modules } from "../../../gameModules";
import { programs } from "../../../resources/programs";
import { dailyQuestServers } from "../../../resources/dailyQuestServers";
import { stateWrapper, translate } from "../../../helpers/ctx";
import { enterScene } from "../../../helpers/TelegramApiHelpers";
import {createQuestFromTemplate, generateBorders} from "../../../util";
import {finalFightQuestTemplate} from "../../../resources/templates/finalFightQuestTemplate";

const dailyIntroScene = new Scene("dailyIntroScene");

dailyIntroScene.enter(ctx => {
    stateWrapper(ctx, (ctx, state) => {
        return keyboard(ctx, translate(state, "texts.rooms.dailyIntroScene"), [translate(state, "texts.go")], {
            playerId: state.player.id
        });
    });
});

dailyIntroScene.on("text", ctx => {
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let data = player.state.data;
        switch (ctx.update.message.text) {
            case translate(state, "texts.go"):
                player.currentFloor = "fight";
                let enemyServer = _.get(dailyQuestServers, player.currentQuest.name);
                let dailyQuestTemplate = generateBorders(enemyServer);
                ctx.session.alreadyStolen = false;
                ctx.session.serverCoins = 1000;
                //programs for testing
                data.programsInMemory = [programs.hack, programs.hack, programs.hack, programs.scan, programs.scan, programs.scan];
                createQuestFromTemplate(state, { questTemplate: dailyQuestTemplate, fog: false, coins: 500 });
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

module.exports = dailyIntroScene;
