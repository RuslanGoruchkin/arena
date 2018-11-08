import _ from "lodash";
import { gameModules } from "./gameModules";
import { characters } from "./resources/characters";
import { programs } from "./resources/programs";
import { quests } from "./resources/quests";
import { questRestartScene } from "./scenes/quests/questRestartScene";
import { outroScene } from "./scenes/quests/outroScene";
import { getPlayer, translate } from "./helpers/ctx";
import { enterScene, replyWithMarkdown } from "./helpers/TelegramApiHelpers";
const debug = require("debug")("bot:tick");

export const tick = state => {
    let { players } = state;
    state.currentTick = state.currentTick || 1;
    debug(`Start tick ${state.currentTick}`);
    _.each(players, player => {
        debug(`Tick for ${player.id}`);
        let params = { playerId: player.id };
        if (state.currentTick-player.sleepyTime > player.data.sleepyTick){
            player.sleepy=true;
            replyWithMarkdown(translate(state, "condition.sleepy"), params);
        }
        if (state.currentTick-player.thirstyTime > player.data.thirstyTick){
            player.thirsty=true;
            replyWithMarkdown(translate(state, "condition.sleepy"), params);
        }
        if (state.currentTick-player.hungryTime > player.data.hungryTick){
            player.hungry=true;
            replyWithMarkdown(translate(state, "condition.sleepy"), params);
        }


        _.each(characters, item => {
            if (item.onTick) {
                state = item.onTick(state, params);
            }
        });

        _.each(quests, (quest, key) => {
            let player = getPlayer(state, params);
            if (player && _.get(player, "currentQuest.name") === key) {
                if (quest.fail(state, params)) {
                    enterScene(null, { ...params, scene: "questRestartScene" }, state);
                }
                if (quest.goal(state, params)) {
                    enterScene(null, { ...params, scene: "outroScene" }, state);
                }
            }
        });
    });
    debug(`End tick ${state.currentTick}`);
    state.currentTick++;

    return state;
};
