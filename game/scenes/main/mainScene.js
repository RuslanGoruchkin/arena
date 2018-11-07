import _ from "lodash";
import Scene from "telegraf/scenes/base";
import { getPlayerScreen, heightOfScreen, widthOfScreen } from "../../util";
import { gameModules } from "../../gameModules";
import { getModule, getPlayer, stateWrapper, translate } from "../../helpers/ctx";
import stateManager from "../../stateManager";
import { enterScene, keyboard, redirectToOopsScene, replyWithMarkdown } from "../../helpers/TelegramApiHelpers";

let debug = require("debug")("bot:mainScene");
let ignoredModules = [
    gameModules.space,
    gameModules.way,
    gameModules.sewerHatch,
    gameModules.stairs,
    gameModules.programVendor,
    gameModules.moduleVendor,
    gameModules.elevator,
    gameModules.relocationMaster
];
let standartMenuTopRow = (state, params) => [translate(state, "menu.menu"), translate(state, "menu.up")];
let standartMenuBottomRow = (state, params) => [
    translate(state, "menu.left"),
    translate(state, "menu.down"),
    translate(state, "menu.right")
];
const mainScene = new Scene("mainScene");
mainScene.enter(ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let coordinates = player.coordinates;
        let params = { playerId: player.id, floor: player.currentFloor, x: coordinates.xPos, y: coordinates.yPos };
        const module = getModule(state, params);
        let isIgnoredSlot =
            (_.isObject(module) && _.includes(ignoredModules, module)) || module.character === gameModules.availableSpace.character;

        let isThisPlayerServer = getIsThisPlayerServer(state, params);
        if (player.questFailed) {
            return keyboard(
                getPlayerScreen(state, params),
                [
                    ["Restart", ...standartMenuTopRow(state, params), translate(state, "menu.attack")],
                    [...standartMenuBottomRow(state, params)]
                ],
                params
            );
        } else if (module.character === gameModules.sewerHatch.character) {
            return keyboard(
                getPlayerScreen(state, params),
                [[...standartMenuTopRow(state, params), translate(state, "menu.goDown")], [...standartMenuBottomRow(state, params)]],
                params
            );
        } else if (module.character === gameModules.stairs.character) {
            return keyboard(
                getPlayerScreen(state, params),
                [[...standartMenuTopRow(state, params), translate(state, "menu.goUp")], [...standartMenuBottomRow(state, params)]],
                params
            );
        } else if (module.character === gameModules.dailyNPC.character) {
            return keyboard(
                getPlayerScreen(state, params),
                [[...standartMenuTopRow(state, params), translate(state, "menu.talk")], standartMenuBottomRow(state, params)],
                params
            );
        } else if (isThisPlayerServer || isIgnoredSlot || module.character === gameModules.yourFriend.character) {
            return keyboard(
                getPlayerScreen(state, params),
                [[...standartMenuTopRow(state, params), translate(state, "menu.manage")], [...standartMenuBottomRow(state, params)]],
                params
            );
        } else {
            if (module.isBroken) {
                return keyboard(
                    getPlayerScreen(state, params),
                    [[...standartMenuTopRow(state, params), translate(state, "menu.actions")], [...standartMenuBottomRow(state, params)]],
                    params
                );
            } else {
                return keyboard(
                    getPlayerScreen(state, params),
                    [[...standartMenuTopRow(state, params), translate(state, "menu.attack")], [...standartMenuBottomRow(state, params)]],
                    params
                );
            }
        }
    })
);

export const getIsThisPlayerServer = (state, params) => {
    let { floor, id, x, y } = params;
    return _.get(state.access, `[${floor}][${id}][${x}][${y}]`);
};

function isPossibleMove(state, params) {
    let impossibleModules = [gameModules.way.character, gameModules.denied.character];
    let { x, y } = params;
    return (
        _.includes(impossibleModules, _.get(getModule(state, { ...params, x: x + 1 }), "character")) ||
        _.includes(impossibleModules, _.get(getModule(state, { ...params, x: x - 1 }), "character")) ||
        _.includes(impossibleModules, _.get(getModule(state, { ...params, y: y + 1 }), "character")) ||
        _.includes(impossibleModules, _.get(getModule(state, { ...params, y: y - 1 }), "character"))
    );
}

function isPossible(state, params) {
    let { floor, x, y } = params;
    let map = state.map;
    return (
        (map[floor][x] && map[floor][x][y] && x < heightOfScreen) ||
        y < widthOfScreen ||
        x > map[floor].length - (heightOfScreen + 1) ||
        y > map[floor][x].length - (widthOfScreen + 1)
    );
}

let move = (state, params) => {
    let { ctx, newCoordinates } = params;
    let nextModule = getModule(state, params);
    let player = getPlayer(state, params);
    if (nextModule === gameModules.denied) {
        enterScene(ctx, "confirmQuestScene", state);
    } else {
        if (
            (!getIsThisPlayerServer(state, params) && !isPossibleMove(state, params) && !nextModule.isVisible) ||
            isPossible(state, params)
        ) {
            let notAllowedDirectionText = translate(state, "texts.mainScenes.mainScene.notAllowedDirection");
            replyWithMarkdown(notAllowedDirectionText, { playerId: state.player.id }).then(enterScene(ctx, "mainScene", state));
        } else {
            state = { ...state, player: { ...player, coordinates: newCoordinates } };

            enterScene(ctx, "mainScene", state);
        }
    }
    return state;
};
mainScene.on("text", ctx =>
    stateWrapper(ctx, (ctx, state) => {
        let player = state.player;
        let coordinates = player.coordinates;
        let xPos = coordinates.xPos;
        let yPos = coordinates.yPos;
        let params = { ctx, playerId: player.id, floor: player.currentFloor, x: coordinates.xPos, y: coordinates.yPos };
        // switch (getModule(state, params).character) {
        switch (ctx.update.message.text) {
            case translate(state, "menu.goUp"):
                enterScene(ctx, "moduleRouterScene", state);
                break;
            case translate(state, "menu.goDown"):
                enterScene(ctx, "moduleRouterScene", state);
                break;
            case translate(state, "menu.manage"): {
                let module = getModule(state, params);
                let availableModules = [
                    gameModules.programVendor.character,
                    gameModules.moduleVendor.character,
                    gameModules.elevator.character,
                    gameModules.relocationMaster.character
                ];
                if (getIsThisPlayerServer(state, params)) {
                    enterScene(ctx, "moduleRouterScene", state);
                } else if (_.includes(availableModules, module.character)) {
                    enterScene(ctx, "moduleRouterScene", state);
                } else {
                    let haveNoAccessText = translate(state, "texts.mainScenes.mainScene.haveNoAccess");
                    replyWithMarkdown(haveNoAccessText, { playerId: state.player.id }).then(enterScene(ctx, "mainScene", state));
                }
                break;
            }
            case translate(state, "menu.up"): {
                params = { ...params, x: xPos - 1, y: yPos };
                let newCoordinates = { ...coordinates, xPos: coordinates.xPos-- };
                state = move(state, { ...params, newCoordinates });
                break;
            }
            case translate(state, "menu.left"): {
                params = { ...params, x: xPos, y: yPos - 1 };
                let newCoordinates = { ...coordinates, yPos: coordinates.yPos-- };
                state = move(state, { ...params, newCoordinates });
                break;
            }
            case translate(state, "menu.right"): {
                params = { ...params, x: xPos, y: yPos + 1 };
                let newCoordinates = { ...coordinates, yPos: coordinates.yPos++ };
                state = move(state, { ...params, newCoordinates });
                break;
            }
            case translate(state, "menu.down"): {
                params = { ...params, x: xPos + 1, y: yPos };
                let newCoordinates = { ...coordinates, xPos: coordinates.xPos++ };
                state = move(state, { ...params, newCoordinates });
                break;
            }
            case translate(state, "menu.attack"): {
                let module = getModule(state, params);
                if (!_.get(module, "isBroken")) {
                    enterScene(ctx, "selectAttackProgramScene", state);
                }
                break;
            }

            case translate(state, "menu.actions"):
                enterScene(ctx, "actionRouterDefeatedModuleScene", state);
                break;
            case "Restart":
                enterScene(ctx, "finalFightQuest", state);
                break;
            case translate(state, "menu.menu"):
                enterScene(ctx, "mainMenuScene", state);
                break;
            case translate(state, "menu.talk"):
                enterScene(ctx, "moduleRouterScene", state);
                break;
            default:
                redirectToOopsScene(ctx);
                break;
        }
        //first open-world quests trigger
        if (player.data.antivirusQuest === false && player.selectedCharacter.class !== "defaultCharacter") {
            if (player.data.completedQuests["finalFight"]) {
                enterScene(ctx, "defenseQuestScene", state);
            } else {
                enterScene(ctx, "offenseQuestScene", state);
            }
        }
    })
);

module.exports = mainScene;
