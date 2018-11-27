import { keyboard } from "../../helpers/TelegramApiHelpers";
import Scene from "telegraf/scenes/base";
import { createServerFromTemplate } from "../../server";
import { gameModules } from "../../gameModules";
import { stateWrapper, t } from "../../helpers/ctx";
import { enterScene } from "../../helpers/TelegramApiHelpers";

const selectCharacterScene = new Scene("selectCharacterScene");

selectCharacterScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        return keyboard(
            t(state, "texts.startScenes.selectCharacterScene.chooseCharacter"),
            [
                [t(state, "menu.characters.warrior"), t(state, "menu.characters.mage")],
                [t(state, "menu.characters.evangelist"), t(state, "menu.characters.prophet")],
                [t(state, "menu.characters.nomad")]
            ],
            { playerId: state.player.id }
        );
    })
);

selectCharacterScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        switch (text) {
            case t(state, "menu.characters.warrior"):
                ctx.session.character = "warrior";
                break;
            case t(state, "menu.characters.mage"):
                ctx.session.character = "mage";
                break;
            case t(state, "menu.characters.evangelist"):
                ctx.session.character = "evangelist";
                break;
            case t(state, "menu.characters.prophet"):
                ctx.session.character = "prophet";
                break;
            case t(state, "menu.characters.nomad"):
                ctx.session.character = "nomad";
                break;
        }
        return enterScene(ctx, "confirmScene", state);
    })
);

module.exports = selectCharacterScene;
