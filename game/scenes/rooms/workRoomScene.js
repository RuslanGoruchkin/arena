import Scene from "telegraf/scenes/base";
import {
    enterScene,
    keyboard,
    redirectToOopsScene,
    replyWithMarkdown,
    stateWrapper,
    statusMessage,
    t
} from "../../helpers";

const workRoomScene = new Scene("workRoomScene");
workRoomScene.enter(ctx => {
    return stateWrapper(ctx, (ctx, state) => {
        let message = "";
        let buttons = [];
        let player = state.player;
        let data = player.data;
        if (data.activity !== "") {
            if (data.activity.startsWith("work")) {
                message = t(state, "texts.work.status");
                buttons.push([t(state, "menu.needs.status")]);
                buttons.push([t(state, "menu.needs.stop")]);
            }
        } else {
            statusMessage(state);
            message = "You are in a work room. What work do you want?";
            buttons.push(["str+dex", "str+int", "str+vit"]);
            buttons.push(["str+wis", "dex+int","dex+vit"]);
            buttons.push(["dex+wis", "int+vit","int+wis"]);
            //any scene
            buttons.push(["vit+wis", t(state, "texts.back")]);
        }

        return keyboard(message, buttons, { playerId: state.player.id });
    });
});

workRoomScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let data = player.data;
        let currentTick = state.currentTick;
        let workingTime = 10;
        //Work
        if (data.activity.startsWith("work")) {
            switch (ctx.update.message.text) {
                case t(state, "menu.needs.status"):
                    let delta = data.timeout - currentTick;
                    if (delta > 0) {
                        return replyWithMarkdown(
                            t(state, "texts.needs.timeLeft") + " " + delta + " " + t(state, "texts.seconds"),
                            {
                                playerId: player.id
                            },
                            state
                        );
                    } else {
                        return replyWithMarkdown("You have already worked", { playerId: player.id }, state);
                    }
                case t(state, "menu.needs.stop"):
                    data.timeout = 0;
                    data.activity = "";
                    return enterScene(ctx, "workRoomScene", state);
                default:
                    return redirectToOopsScene(ctx, state);
            }
        } else if (!data.activity) {
            //Main
            switch (ctx.update.message.text) {
                case "str+dex":
                    data.timeout = currentTick + workingTime;
                    data.timeoutStatus = true;
                    data.salary = player.selectedCharacter.strength * player.selectedCharacter.dexterity;
                    data.activity = "work";
                    return enterScene(ctx, "workRoomScene", state);
                case "str+int":
                    data.timeout = currentTick + workingTime;
                    data.timeoutStatus = true;
                    data.salary = player.selectedCharacter.strength * player.selectedCharacter.intelligence;
                    data.activity = "work";
                    return enterScene(ctx, "workRoomScene", state);
                case "str+vit":
                    data.timeout = currentTick + workingTime;
                    data.timeoutStatus = true;
                    data.salary = player.selectedCharacter.strength * player.selectedCharacter.vitality;
                    data.activity = "work";
                    return enterScene(ctx, "workRoomScene", state);
                case "str+wis":
                    data.timeout = currentTick + workingTime;
                    data.timeoutStatus = true;
                    data.salary = player.selectedCharacter.strength * player.selectedCharacter.wisdom;
                    data.activity = "work";
                    return enterScene(ctx, "workRoomScene", state);
                case "dex+int":
                    data.timeout = currentTick + workingTime;
                    data.timeoutStatus = true;
                    data.salary = player.selectedCharacter.int * player.selectedCharacter.dexterity;
                    data.activity = "work";
                    return enterScene(ctx, "workRoomScene", state);
                case "dex+vit":
                    data.timeout = currentTick + workingTime;
                    data.timeoutStatus = true;
                    data.salary = player.selectedCharacter.vitality * player.selectedCharacter.dexterity;
                    data.activity = "work";
                    return enterScene(ctx, "workRoomScene", state);
                case "dex+wis":
                    data.timeout = currentTick + workingTime;
                    data.timeoutStatus = true;
                    data.salary = player.selectedCharacter.wisdom * player.selectedCharacter.dexterity;
                    data.activity = "work";
                    return enterScene(ctx, "workRoomScene", state);
                case "int+vit":
                    data.timeout = currentTick + workingTime;
                    data.timeoutStatus = true;
                    data.salary = player.selectedCharacter.intelligence * player.selectedCharacter.vitality;
                    data.activity = "work";
                    return enterScene(ctx, "workRoomScene", state);
                case "int+wis":
                    data.timeout = currentTick + workingTime;
                    data.timeoutStatus = true;
                    data.salary = player.selectedCharacter.intelligence * player.selectedCharacter.wisdom;
                    data.activity = "work";
                    return enterScene(ctx, "workRoomScene", state);
                case "vit+wis":
                    data.timeout = currentTick + workingTime;
                    data.timeoutStatus = true;
                    data.salary = player.selectedCharacter.vitality * player.selectedCharacter.wisdom;
                    data.activity = "work";
                    return enterScene(ctx, "workRoomScene", state);
                //any scene
                case t(state, "texts.back"):
                    return enterScene(ctx, "hallwayRoomScene", state);
                default:
                    return redirectToOopsScene(ctx, state);
            }
        }
    })
);

module.exports = workRoomScene;