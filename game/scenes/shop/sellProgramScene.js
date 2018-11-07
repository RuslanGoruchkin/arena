import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { keyboard } from "../../helpers/TelegramApiHelpers";
import { stateWrapper, translate } from "../../helpers/ctx";
import { enterScene, replyWithMarkdown } from "../../helpers/TelegramApiHelpers";

const sellProgramScene = new Scene("sellProgramScene");

sellProgramScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        if (_.isEmpty(player.data.programsInMemory)) {
            let message = translate(state, "texts.shopScenes.sellProgramScene.emptyMemory");
            return keyboard(message, [[translate(state, "texts.back")]], params);
        } else {
            let options = [];
            _.each(player.data.programsInMemory, program => {
                //TODO: delete newItem, follow storageModuleScene
                let newItem = [];
                newItem.push(`${program.name} ${program.level} level`);
                options.push(newItem);
            });
            options.push([translate(state, "texts.back")]);
            return keyboard(translate(state, "texts.shopScenes.sellProgramScene.selectProgram"), [options], { playerId: state.player.id });
        }
    })
);

sellProgramScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        if (text === translate(state, "texts.back")) {
            enterScene(ctx, "vendorProgramScene", state);
        } else {
            let player = state.player;
            let data = player.data;
            let split = text.split(" ");
            let splitted = [];
            splitted[0] = _.isNaN(parseInt(split[1])) ? `${split[0]} ${split[1]}` : split[0];
            splitted[1] = !_.isNaN(parseInt(split[1])) ? split[1] : split[2];
            ctx.session.programForSell = _.find(data.programsInMemory, programInMemory => {
                return programInMemory.name === splitted[0] && programInMemory.level === parseInt(splitted[1]);
            });
            let enterPriceText = translate(state, "texts.shopScenes.sellProgramScene.enterPrice");
            replyWithMarkdown(enterPriceText, { playerId: state.player.id }).then(enterScene(ctx, "selectProgramPriceScene", state));
        }
    })
);

module.exports = sellProgramScene;
