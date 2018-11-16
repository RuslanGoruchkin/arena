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
                [t(state, "menu.characters.cyberWarrior"), t(state, "menu.characters.techMage")],
                [t(state, "menu.characters.cryptoEvangelist"), t(state, "menu.characters.singularityProphet")],
                [t(state, "menu.characters.digitalNomad")]
            ],
            { playerId: state.player.id }
        );
    })
);

selectCharacterScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        switch (text) {
            case t(state, "menu.characters.cyberWarrior"):
                ctx.session.character = "cyberWarrior";
                break;
            case t(state, "menu.characters.techMage"):
                ctx.session.character = "techMage";
                break;
            case t(state, "menu.characters.cryptoEvangelist"):
                ctx.session.character = "cryptoEvangelist";
                break;
            case t(state, "menu.characters.singularityProphet"):
                ctx.session.character = "singularityProphet";
                break;
            case t(state, "menu.characters.digitalNomad"):
                ctx.session.character = "digitalNomad";
                break;
        }
        enterScene(ctx, "confirmScene", state);
    })
);

module.exports = selectCharacterScene;
