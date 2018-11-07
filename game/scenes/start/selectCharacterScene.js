import { keyboard } from "../../helpers/TelegramApiHelpers";
import Scene from "telegraf/scenes/base";
import { createServerFromTemplate } from "../../server";
import { gameModules } from "../../gameModules";
import { stateWrapper, translate } from "../../helpers/ctx";
import { enterScene } from "../../helpers/TelegramApiHelpers";

const selectCharacterScene = new Scene("selectCharacterScene");

selectCharacterScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let startServer = [
            [gameModules.availableSpace, gameModules.availableSpace, gameModules.miner, gameModules.availableSpace],
            [gameModules.availableSpace, gameModules.firewall, gameModules.wallet, gameModules.miner],
            [gameModules.processor, gameModules.storage, gameModules.antivirus, gameModules.availableSpace],
            [gameModules.availableSpace, gameModules.processor, gameModules.availableSpace, gameModules.availableSpace]
        ];
        player.server = createServerFromTemplate(startServer);

        return keyboard(
            translate(state, "texts.startScenes.selectCharacterScene.chooseCharacter"),
            [
                [translate(state, "menu.characters.cyberWarrior"), translate(state, "menu.characters.techMage")],
                [translate(state, "menu.characters.cryptoEvangelist"), translate(state, "menu.characters.singularityProphet")],
                [translate(state, "menu.characters.digitalNomad")]
            ],
            { playerId: state.player.id }
        );
    })
);

selectCharacterScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let text = ctx.update.message.text;
        switch (text) {
            case translate(state, "menu.characters.cyberWarrior"):
                ctx.session.character = "cyberWarrior";
                break;
            case translate(state, "menu.characters.techMage"):
                ctx.session.character = "techMage";
                break;
            case translate(state, "menu.characters.cryptoEvangelist"):
                ctx.session.character = "cryptoEvangelist";
                break;
            case translate(state, "menu.characters.singularityProphet"):
                ctx.session.character = "singularityProphet";
                break;
            case translate(state, "menu.characters.digitalNomad"):
                ctx.session.character = "digitalNomad";
                break;
        }
        enterScene(ctx, "confirmScene", state);
    })
);

module.exports = selectCharacterScene;
