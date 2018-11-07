/* eslint-disable promise/catch-or-return */
import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { programs } from "../../resources/programs";
import { enterScene } from "../../helpers/TelegramApiHelpers";
import { stateWrapper, translate } from "../../helpers/ctx";
import stateManager from "../../stateManager";
import { replyWithMarkdown } from "../../helpers/TelegramApiHelpers";

const attackScene = new Scene("attackScene");

attackScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let data = player.data;
        if (
            _.isObject(player.attackProgram) &&
            !(player.attackProgram.name === programs.evangelistVirus.name || player.attackProgram.name === programs.virus.name)
        ) {
            player.attackProgram.isCasting = true;
            player.attackPrograms.push(player.attackProgram);
            let waitTimeText = translate(state, "texts.versusScenes.attackScene.waitTime", { castTime: programs.hack.castingTime });

            let index = _.findLastIndex(data.programsInMemory, { key: player.attackProgram.key });
            if (~index) {
                data.programsInMemory.splice(index, 1);
            }
            data.programsInMemory = [...data.programsInMemory];
            replyWithMarkdown(waitTimeText, { playerId: state.player.id }).then(enterScene(ctx, "mainScene", state));
        }
    })
);

module.exports = attackScene;
