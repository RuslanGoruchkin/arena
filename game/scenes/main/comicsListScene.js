import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { keyboard } from "../../helpers/TelegramApiHelpers";
import { stateWrapper, translate } from "../../helpers/ctx";
import { enterScene, redirectToOopsScene } from "../../helpers/TelegramApiHelpers";

const comicsListScene = new Scene("comicsListScene");

comicsListScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let message = translate(state, "texts.mainScenes.comicsListScene.selectComics");
        let buttons = [];
        _.each(player.comics, comics => {
            buttons.push([`${translate(state, `texts.comics.${comics}.description`)}`]);
        });
        buttons.push([translate(state, "texts.back")]);
        player.selectedCharacter.comicsCounter = 1;
        return keyboard(message, buttons, { playerId: state.player.id });
    })
);

comicsListScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        switch (text) {
            case translate(state, "texts.back"):
                enterScene(ctx, "mainMenuScene", state);
                break;
            default:
                let player = state.player;
                let isPresent = false;
                _.each(player.comics, comics => {
                    if (text === `${translate(state, `texts.comics.${comics}.description`)}`) {
                        player.selectedComics = comics;
                        isPresent = true;
                    }
                });
                if (isPresent) {
                    //ctx.session.player.selectedComics = 'worldHistory';
                    enterScene(ctx, "storyTellingScene", state);
                } else {
                    redirectToOopsScene(ctx);
                    break;
                }
        }
    })
);

module.exports = comicsListScene;