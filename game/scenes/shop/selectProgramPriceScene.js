import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { goods } from "../../util";
import { stateWrapper, translate } from "../../helpers/ctx";
import { enterScene, replyWithMarkdown } from "../../helpers/TelegramApiHelpers";

const selectProgramPriceScene = new Scene("selectProgramPriceScene");

selectProgramPriceScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        let price = parseInt(text);
        let player = state.player;
        let data = player.data;
        let element = _.indexOf(data.programsInMemory, ctx.session.programForSell);
        if (_.isNaN(price) || price < 0) {
            let incorrectDataText = translate(state, "texts.shopScenes.selectProgramPriceScene.incorrectData");
            replyWithMarkdown(incorrectDataText, { playerId: state.player.id }).then(enterScene(ctx, "selectProgramPriceScene", state));
        } else {
            if (~element) {
                data.programsInMemory.splice(element, 1);
                let program = ctx.session.programForSell;
                program.price = price;
                if (!goods[program.name]) {
                    goods[program.name] = [];
                }
                goods[program.name].push(_.cloneDeep(program));
                ctx.session.programForSell = undefined;
                let successAddedProgramText = translate(state, "texts.shopScenes.selectProgramPriceScene.successAddedProgram");
                replyWithMarkdown(successAddedProgramText, { playerId: state.player.id }).then(enterScene(ctx, "sellProgramScene", state));
            }
        }
    })
);

module.exports = selectProgramPriceScene;
