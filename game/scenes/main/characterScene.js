import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { calculateProgramCount } from "../../util";
import { stateWrapper, translate } from "../../helpers/ctx";
import { enterScene, keyboard, redirectToOopsScene } from "../../helpers/TelegramApiHelpers";

const characterScene = new Scene("characterScene");

characterScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let selectedCharacter = player.selectedCharacter;
        let programs = "";
        let programsInMemory = _.cloneDeep(player.data.programsInMemory);
        programsInMemory = _.sortBy(programsInMemory, [
            program => {
                return translate(state, `texts.${program.key}`);
            }
        ]);
        _.each(programsInMemory, program => {
            programs += `\n${translate(state, `texts.${program.key}`)}`;
        });
        let message = translate(state, "texts.mainScenes.characterScene.descriptionCharacter", {
            charClass: translate(state, `menu.characters.${selectedCharacter.class}`),
            nickname: player.nickname,
            level: player.level,
            xp: player.XP,
            coins: player.data.coins,
            tokens: player.data.tokens,
            processing: selectedCharacter.processing,
            speed: selectedCharacter.speed,
            logic: selectedCharacter.logic,
            memory: selectedCharacter.memory,
            attention: selectedCharacter.attention,
            busy: player.data.programsInMemory.length,
            total: calculateProgramCount(player.selectedCharacter.memory),
            programs: programs
        });
        return keyboard(message, [[translate(state, "texts.back")]], { playerId: state.player.id });
    })
);

characterScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        switch (text) {
            case translate(state, "texts.back"):
                enterScene(ctx, "mainMenuScene", state);
                break;
            default:
                redirectToOopsScene(ctx);
                break;
        }
    })
);

module.exports = characterScene;
