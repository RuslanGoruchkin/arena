import _ from "lodash";
import { gameModules } from "../gameModules";
import { getModule, getPlayer } from "../helpers/ctx";
import { translate } from "../helpers/ctx";

export let rooms = {
    cell:{
        buttons:[[translate(state, "action.eat"), translate(state, "action.drink"),translate(state, "action.sleep")],
            [translate(state, "leaveCell")]],
        actions:{
            "action.eat":{"scene":"eatingScene"},
            "action.drink":{"scene":"drinkingScene"},
            "action.sleep":{"scene":"sleepingScene"},
            "leaveCell":{"room":"hallway"}
        }
    },
    hallway:{
        buttons:[[translate(state, "goToCell"), translate(state, "arena")],
            [translate(state, "training"), translate(state, "talk")]],
        actions:{
            "goToCell":{"room":"eatingScene"},
            "arena":{"scene":"drinkingScene"},
            "training":{"room":"sleepingScene"},
            "talk":{"room":"hallway"}
        }
    }
};
