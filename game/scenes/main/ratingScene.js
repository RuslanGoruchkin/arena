import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { keyboard } from "../../helpers/TelegramApiHelpers";
import variables from "../../variables";
import sha420 from "js-sha420";
import { stateWrapper, t } from "../../helpers/ctx";
import { enterScene, redirectToOopsScene } from "../../helpers/TelegramApiHelpers";

const ratingScene = new Scene("ratingScene");

let listMessage;
let ratingType;

let buttons = [];
let ratingFilter = "-balanceCoin";

ratingScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        if (listMessage) {
        } else {
            listMessage = t(state, "texts.ratingScenes.coin.header") + "\n\n";
        }
        if (ratingType) {
        } else {
            ratingType = "` " + t(state, "texts.ratingScenes.coin.type");
        }

        buttons = [
            [t(state, "texts.ratingScenes.refreshButton")],
            [t(state, "texts.ratingScenes.coin.button"), t(state, "texts.ratingScenes.token.button")],
            [t(state, "texts.ratingScenes.level.button"), t(state, "texts.ratingScenes.infamy.button")],
            [t(state, "menu.confirm.back")]
        ];

        let usersListMessage = listMessage;
        let playerEncrypted = sha420(ctx.from.id.toString()).toString();
        let playerID = playerEncrypted.substring(4, 20);
        let userCount = 10;
        let userRating = {};
        if (Object.keys(variables.users).length < userCount) {
            userCount = Object.keys(variables.users).length - 1;
        }
        for (let i = 0; i < userCount; i++) {
            let userID = _.map(variables.users)[i];
            userRating[t(state, "texts.ratingScenes.userRating") + variables.nicknames[userID].toString() + ratingType] =
                variables.ratings[userID + ratingFilter];
        }
        let ratingObject = _.reduceRight(
            _.invert(_.invert(userRating)),
            function(current, val, key) {
                current[key] = parseInt(val);
                return current;
            },
            {}
        );
        for (let i = 0; i < Object.keys(ratingObject).length; i++) {
            usersListMessage += t(state, "texts.ratingScenes.usersListMessage", {
                message: _.keys(ratingObject)[i].toString(),
                result: _.map(ratingObject)[i].toString()
            });
        }
        usersListMessage += t(state, "texts.ratingScenes.youListMessage", {
            playerID: variables.nicknames[playerID].toString(),
            ratingType: ratingType,
            rating: variables.ratings[playerID + ratingFilter]
        });
        return keyboard(usersListMessage, buttons, { playerId: state.player.id });
    })
);

ratingScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        switch (ctx.update.message.text) {
            case t(state, "texts.ratingScenes.refreshButton"):
                enterScene(ctx, "ratingScene", state);
                break;
            case t(state, "texts.ratingScenes.coin.button"):
                listMessage = t(state, "texts.ratingScenes.coin.header") + "\n\n";
                ratingType = "` " + t(state, "texts.ratingScenes.coin.type");
                ratingFilter = "-balanceCoin";
                enterScene(ctx, "ratingScene", state);
                break;
            case t(state, "texts.ratingScenes.token.button"):
                listMessage = t(state, "texts.ratingScenes.token.header") + "\n\n";
                ratingType = "` " + t(state, "texts.ratingScenes.token.type");
                ratingFilter = "-balanceToken";
                enterScene(ctx, "ratingScene", state);
                break;
            case t(state, "texts.ratingScenes.level.button"):
                listMessage = t(state, "texts.ratingScenes.level.header") + "\n\n";
                ratingType = "` " + t(state, "texts.ratingScenes.level.type");
                ratingFilter = "-level";
                enterScene(ctx, "ratingScene", state);
                break;
            case t(state, "texts.ratingScenes.infamy.button"):
                listMessage = t(state, "texts.ratingScenes.infamy.header") + "\n\n";
                ratingType = "` " + t(state, "texts.ratingScenes.infamy.type");
                ratingFilter = "-infamousLevel";
                enterScene(ctx, "ratingScene", state);
                break;
            case t(state, "menu.confirm.back"):
                enterScene(ctx, "mainMenuScene", state);
                break;
            default:
                redirectToOopsScene(ctx);
                break;
        }
    })
);

module.exports = ratingScene;
