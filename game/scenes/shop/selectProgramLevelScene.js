import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { calculateProgramCount, goods } from "../../util";
import { stateWrapper, t } from "../../helpers/ctx";
import { enterScene, keyboard, replyWithMarkdown } from "../../helpers/TelegramApiHelpers";

const selectProgramLevelScene = new Scene("selectProgramLevelScene");

selectProgramLevelScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let options = new Set();
        _.each(goods[ctx.session.buyProgram], program => {
            let bestProgram = program;
            options.forEach(item => {
                let split = item.split(" ");
                let optionProgram = { level: split[0], price: split[2] };
                if (parseInt(optionProgram.level) === program.level) {
                    bestProgram =
                        optionProgram.price === program.price
                            ? {
                                  level: program.level,
                                  price: program.price
                              }
                            : optionProgram.price < program.price
                                ? optionProgram
                                : { level: program.level, price: program.price };
                    options.delete(`${optionProgram.level} level: ${optionProgram.price} 💰`);
                }
            });
            options.add(`${bestProgram.level} level: ${bestProgram.price} 💰`);
        });
        options.add(t(state, "texts.back"));
        return keyboard(t(state, "texts.shopScenes.selectProgramLevelScene.selectLevel"), [...options], {
            playerId: state.player.id
        });
    })
);

selectProgramLevelScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text.split(" ");
        let price = parseInt(text[2]);
        let player = state.player;
        let data = player.data;
        if (text[0] === t(state, "texts.back")) {
            enterScene(ctx, "buyProgramScene", state);
        }
        if (data.programsInMemory.length < calculateProgramCount(player.selectedCharacter.memory)) {
            if (data.tokens > price) {
                data.tokens -= price;
                let program = _.find(goods[ctx.session.buyProgram], programAtVendor => {
                    return programAtVendor.level === parseInt(text[0]) && programAtVendor.price === price;
                });
                let element = _.indexOf(goods[ctx.session.buyProgram], program);
                if (~element) {
                    goods[ctx.session.buyProgram].splice(element, 1);
                    data.programsInMemory.push(program);
                    let boughtProgramSuccessText = t(state, "texts.shopScenes.selectProgramLevelScene.boughtProgramSuccess");
                    replyWithMarkdown(boughtProgramSuccessText, { playerId: state.player.id }).then(
                        enterScene(ctx, "selectProgramLevelScene", state)
                    );
                }
            } else {
                let notEnoughFundsText = t(state, "texts.shopScenes.selectProgramLevelScene.notEnoughFunds");
                replyWithMarkdown(notEnoughFundsText, { playerId: state.player.id }).then(enterScene(ctx, "buyProgramScene", state));
            }
        } else {
            let memoryOverflowText = t(state, "texts.shopScenes.selectProgramLevelScene.memoryOverflow");
            replyWithMarkdown(memoryOverflowText, { playerId: state.player.id }).then(enterScene(ctx, "buyProgramScene", state));
        }
    })
);

module.exports = selectProgramLevelScene;
