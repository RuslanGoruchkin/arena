import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { rooms } from "../../resources/rooms";
import { getPlayerScreen, heightOfScreen, widthOfScreen } from "../../util";
import { gameModules } from "../../gameModules";
import { getModule, getPlayer, stateWrapper, translate } from "../../helpers/ctx";
import stateManager from "../../stateManager";
import { enterScene, keyboard, redirectToOopsScene, replyWithMarkdown } from "../../helpers/TelegramApiHelpers";

let debug = require("debug")("bot:mainScene");

const mainScene = new Scene("mainScene");
mainScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let room = _.get(rooms, player.currentRoom);
        let message = translate(state, room.message);
        let buttons = [];
        buttons.push(room.buttons);
        buttons.push([
            translate(state, "character"),
            translate(state, "inventory"),
            translate(state, "menu")]);

        return keyboard(message, buttons, { playerId: state.player.id });
    })
);


mainScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let room = _.get(rooms, player.currentRoom);
        let action = _.get(room, text);
        if(action){
            if (_.has(action, "scene")){
                let scene = _.get(action, "scene");
                enterScene(ctx, scene, state);
            } else if (_.has(action, "room")){
                player.currentRoom = _.get(action, "room");
                enterScene(ctx, "mainScene", state);
            }
        } else {
            switch (text) {
                case translate(state, "character"):
                    enterScene(ctx, "characterScene", state);
                    break;
                case translate(state, "inventory"):
                    enterScene(ctx, "inventoryScene", state);
                    break;
                case translate(state, "menu"):
                    enterScene(ctx, "mainMenuScene", state);
                    break;
                default:
                    redirectToOopsScene(ctx);
                    break;
            }
        }
    })
);

module.exports = mainScene;
