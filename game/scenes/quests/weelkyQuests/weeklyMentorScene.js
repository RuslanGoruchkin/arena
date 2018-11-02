import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { assembleServerToInventory } from "../../../util";
import { createMentorRoom } from "../../../map";
import { gameModules } from "../../../gameModules";
import { stateWrapper, translate } from "../../../helpers/ctx";
import { enterScene, keyboard } from "../../../helpers/TelegramApiHelpers";

const weeklyMentorScene = new Scene("weeklyMentorScene");

weeklyMentorScene.enter(ctx => {
    stateWrapper(ctx, (ctx, state) => {
        return keyboard(ctx, translate(state, "texts.quests.weeklyMentorScene"), [translate(state, "texts.go")], {
            playerId: state.player.id
        });
    });
});

weeklyMentorScene.on("text", ctx => {
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        switch (ctx.update.message.text) {
            case translate(state, "texts.go"):
                player.currentFloor = "daily_quest";
                let fire = _.cloneDeep(gameModules.fire);
                let dailyNPC = _.cloneDeep(gameModules.weeklyNPC);
                let room = [
                    [
                        gameModules.availableSpace,
                        gameModules.availableSpace,
                        gameModules.availableSpace,
                        gameModules.availableSpace,
                        gameModules.availableSpace
                    ],
                    [fire, gameModules.availableSpace, dailyNPC, gameModules.availableSpace, fire],
                    [
                        gameModules.availableSpace,
                        gameModules.availableSpace,
                        gameModules.availableSpace,
                        gameModules.availableSpace,
                        gameModules.availableSpace
                    ],
                    [
                        gameModules.availableSpace,
                        gameModules.availableSpace,
                        gameModules.availableSpace,
                        gameModules.availableSpace,
                        gameModules.availableSpace
                    ],
                    [
                        gameModules.availableSpace,
                        gameModules.availableSpace,
                        gameModules.availableSpace,
                        gameModules.availableSpace,
                        gameModules.availableSpace
                    ]
                ];
                createMentorRoom(ctx, room);
                player.coordinates.xPos += 3;
                player.coordinates.yPos += 2;
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

module.exports = weeklyMentorScene;
