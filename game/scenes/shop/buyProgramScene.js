import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { goods } from "../../util";
import { items } from "../../resources/items";
import { stateWrapper, t } from "../../helpers/ctx";
import { enterScene, keyboard } from "../../helpers/TelegramApiHelpers";

const buyProgramScene = new Scene("buyProgramScene");

//Add filter by level
let weapons = _.pickBy(items, _.type === "weapon" && _.shop === true);
console.log(weapons);

buyProgramScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let options = [];
        options[0] = [];
        _.each(weapons,weapon => {
            options[0].push(weapon.name + " Damage:" + weapon.minDamage + "-" + weapon.maxDamage);
        });
        options.push([t(state, "texts.back")]);
        return keyboard(t(state, "texts.shopScenes.buyProgramScene.selectProgramCategory"), [options], {
            playerId: state.player.id
        });
    })
);

buyProgramScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        if (text === t(state, "texts.back")) {
            enterScene(ctx, "vendorProgramScene", state);
        } else if (_.includes(programCategory, text)) {
            ctx.session.buyProgram = text;
            enterScene(ctx, "selectProgramLevelScene", state);
        }
    })
);

module.exports = buyProgramScene;
