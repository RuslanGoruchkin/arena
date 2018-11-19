import _ from "lodash";
import { gameModules } from "./gameModules";
import { characters } from "./resources/characters";
import { programs } from "./resources/programs";
import { quests } from "./resources/quests";
import { generateUpdateFromState, getPlayer, t } from "./helpers/ctx";
import { enterScene, replyWithMarkdown } from "./helpers/TelegramApiHelpers";
import stateManager from "./stateManager";

const debug = require("debug")("bot:tick");

export const tick = async state => {
    let { players } = state;
    state.currentTick = state.currentTick || 1;
    // debug(`Start tick ${state.currentTick}`);
    _.each(players, player => {
        // debug(`Tick for ${player.id}`);
        let params = { playerId: player.id };

        _.each(characters, item => {
            if (item.onTick) {
                state = item.onTick(state, params);
            }
        });

        if (state.player.sleepy === false && state.currentTick - player.sleepyTime > player.data.sleepyTick) {
            state.player.sleepy = true;
            replyWithMarkdown(t(state, "texts.condition.sleepy"), params);
        }
        if (state.player.thirsty === false && state.currentTick - player.thirstyTime > player.data.thirstyTick) {
            state.player.thirsty = true;
            replyWithMarkdown(t(state, "texts.condition.thirsty"), params);
        }
        if (state.player.hungry === false && state.currentTick - player.hungryTime > player.data.hungryTick) {
            state.player.hungry = true;
            //t(state, "texts.condition.hungry")
            replyWithMarkdown(t(state, "texts.condition.hungry"), params);
        }

        if (player.data.timeoutStatus === true && player.data.timeout > state.currentTick) {
            switch (player.data.activity) {
                case "eating":
                    state.player.data.hungryTick = state.currentTick;
                    state.player.hungry = false;
                    replyWithMarkdown("You are no longer hungry. Your stats have been restored", params);
                    break;
                case "drinking":
                    state.player.data.thirstyTick = state.currentTick;
                    state.player.thirsty = false;
                    replyWithMarkdown("You are no longer thirsty. Your stats have been restored", params);
                    break;
                case "sleeping":
                    state.player.data.sleepyTick = state.currentTick;
                    state.player.sleepy = false;
                    replyWithMarkdown("You are no longer sleepy. Your stats have been restored", params);
                    break;
                default:
                    break;
            }
            state.player.data.timeout = 0;
            state.player.data.activity = "";
            state.player.data.timeoutStatus = false;
            enterScene(null, { ...params, scene: "mainScene" }, state);
        }

        _.each(quests, (quest, key) => {
            let player = getPlayer(state, params);

            if (player && _.get(player, "currentQuest.name") === key) {
                const ctx = generateUpdateFromState(state, params);
                if (quest.fail(state, params)) {
                    enterScene(ctx, "questRestartScene", state);
                }
                if (quest.goal(state, params) && !_.get(player, "currentQuest.status")) {
                    enterScene(ctx, "outroScene", state);
                }
            }
        });
    });
    // debug(`End tick ${state.currentTick}`);
    state.currentTick++;
    stateManager.setState(state);
    return state;
};
