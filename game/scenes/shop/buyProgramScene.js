import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { goods } from "../../util";
import { programs } from "../../resources/programs";
import { stateWrapper, translate } from "../../helpers/ctx";
import { enterScene, keyboard } from "../../helpers/TelegramApiHelpers";

const buyProgramScene = new Scene("buyProgramScene");

let programCategory = [programs.hack.name, programs.scan.name, programs.virus.name];

buyProgramScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let options = [];
        options[0] = [];
        _.each(programCategory, program => {
            if (goods[program]) {
                options[0].push(program);
            }
        });
        options.push([translate(state, "texts.back")]);
        return keyboard(translate(state, "texts.shopScenes.buyProgramScene.selectProgramCategory"), [options], {
            playerId: state.player.id
        });
    })
);

buyProgramScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        if (text === translate(state, "texts.back")) {
            enterScene(ctx, "vendorProgramScene", state);
        } else if (_.includes(programCategory, text)) {
            ctx.session.buyProgram = text;
            enterScene(ctx, "selectProgramLevelScene", state);
        }
    })
);

module.exports = buyProgramScene;
