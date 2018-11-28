import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { enterScene, keyboard, redirectToOopsScene, stateWrapper, t } from "../../helpers";

const comicsListScene = new Scene("comicsListScene");

comicsListScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let message = t(state, "texts.mainScenes.comicsListScene.selectComics");
        let buttons = [];
        // eslint-disable-next-line lodash/prefer-map
        _.each(player.comics, comics => {
            buttons.push([`${t(state, `texts.comics.${comics}.description`)}`]);
        });
        buttons.push([t(state, "texts.back")]);
        player.selectedCharacter.comicsCounter = 1;
        return keyboard(message, buttons, { playerId: state.player.id }, state);
    })
);

comicsListScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        switch (text) {
            case t(state, "texts.back"):
                enterScene(ctx, "mainMenuScene", state);
                break;
            default:
                let player = state.player;
                let isPresent = false;
                _.each(player.comics, comics => {
                    if (text === `${t(state, `texts.comics.${comics}.description`)}`) {
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
