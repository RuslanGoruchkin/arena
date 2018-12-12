import _ from "lodash";
import {
    enterScene,
    errorHandler,
    generateUpdateFromState,
    getPlayer,
    removeKeyboard,
    replyWithMarkdown,
    routerScene,
    t
} from "./helpers";
import { characters } from "./resources/characters";
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

        if (player.sleepy === false && state.currentTick - player.sleepyTime > player.data.sleepyTick) {
            player.sleepy = true;
            stateManager.queue.add(() => {
                replyWithMarkdown(t(state, "texts.condition.sleepy"), params);
            });
        }
        if (player.thirsty === false && state.currentTick - player.thirstyTime > player.data.thirstyTick) {
            player.thirsty = true;

            stateManager.queue.add(() => {
                replyWithMarkdown(t(state, "texts.condition.thirsty"), params);
            });
        }
        if (player.hungry === false && state.currentTick - player.hungryTime > player.data.hungryTick) {
            player.hungry = true;
            stateManager.queue.add(() => {
                replyWithMarkdown(t(state, "texts.condition.hungry"), params);
            });
        }

        if (player.data.timeoutStatus === true && player.data.timeout < state.currentTick) {
            const ctx = generateUpdateFromState(state, params);
            switch (player.data.activity) {
                case "eating":
                    player.data.hungryTick = state.currentTick;
                    player.hungry = false;
                    player.XP += 10;
                    stateManager.queue.add(() => {
                        replyWithMarkdown("You are no longer hungry. Your stats have been restored\n +10 XP", params);
                    });
                    break;
                case "drinking":
                    player.data.thirstyTick = state.currentTick;
                    player.thirsty = false;
                    player.XP += 10;
                    stateManager.queue.add(() => {
                        replyWithMarkdown("You are no longer thirsty. Your stats have been restored\n +10 XP", params);
                    });
                    break;
                case "sleeping":
                    player.data.sleepyTick = state.currentTick;
                    player.sleepy = false;
                    player.XP += 100;
                    stateManager.queue.add(() => {
                        replyWithMarkdown("You are no longer sleepy. Your stats have been restored\n +100 XP", params);
                    });
                    break;
                default:
                    break;
            }
            player.data.timeout = 0;
            player.data.activity = "";
            player.data.timeoutStatus = false;
            stateManager.queue.add(() => {
                enterScene(ctx, "mainScene", state);
                //    routerScene(ctx, "mainScene", false);
            });
            /*
            if (player.XP > player.selectedCharacter.levelUp * (2 ^ player.level) - player.selectedCharacter.levelUp) {
                player.level += 1;
                player.classPoints += 1;
                player.statPoints += 1;
                replyWithMarkdown("Level up!\nYou are now " + player.level + " level", params);
                stateManager.queue.add(() => {
                    routerScene(ctx, "levelUpScene");
                });
            } else {

            }
            */
        }
    });
    // debug(`End tick ${state.currentTick}`);
    state.currentTick++;
    stateManager.setState(state);
    return state;
};
