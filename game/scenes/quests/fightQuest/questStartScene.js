import Scene from "telegraf/scenes/base";
import { enterScene } from "../../../helpers/TelegramApiHelpers";
import { quests } from "../../../resources/quests";
import { stateWrapper, translate } from "../../../helpers/ctx";
import stateManager from "../../../stateManager";
import { redirectToOopsScene, replyWithPhotoAndKeyboard } from "../../../helpers/TelegramApiHelpers";

const questStartScene = new Scene("questStartScene");

questStartScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        return replyWithPhotoAndKeyboard(
            translate(state, "texts.rooms.introduction.description"),
            "http://hackerpunk.s3.amazonaws.com/characters/friend.png",
            [[translate(state, "texts.accept")], [translate(state, "texts.rooms.introduction.myself")]],
            { playerId: state.player.id }
        );
    })
);

questStartScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        player.data.hackStatus = 0;
        switch (ctx.update.message.text) {
            case translate(state, "texts.accept"):
                player.currentQuest = { ...quests.usePrograms };
                player.currentQuest.introPlayed = false;
                enterScene(ctx, "questScene", state);
                break;
            case translate(state, "texts.rooms.introduction.myself"):
                enterScene(ctx, "selectCharacterScene", state);
                break;
            default:
                redirectToOopsScene(ctx);
                break;
        }
    })
);

module.exports = questStartScene;
