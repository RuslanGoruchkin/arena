import { t } from "../helpers/ctx";

export let rooms = {
    cell: {
        buttonsReturn: buttons => {
            buttons.push([t(state, "texts.action.eat"), t(state, "texts.action.drink"), t(state, "texts.action.sleep")]);
            buttons.push([t(state, "leaveCell")]);
            return buttons;
        },
        actions: {
            "action.eat": { scene: "eatingScene" },
            "action.drink": { scene: "drinkingScene" },
            "action.sleep": { scene: "sleepingScene" },
            leaveCell: { room: "hallway" }
        },
        message: "texts.message.cell"
    },
    hallway: {
        buttonsReturn: buttons => {
            return [[t(state, "menu.goToCell"), t(state, "menu.arena")], [t(state, "menu.training"), t(state, "menu.talk")]];
        },
        actions: {
            goToCell: { room: "eatingScene" },
            arena: { scene: "drinkingScene" },
            training: { room: "sleepingScene" },
            talk: { room: "hallway" }
        },
        message: "texts.message.hallway"
    },
    training: {},
    interactions: {}
};
