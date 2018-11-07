import _ from "lodash";
import { gameModules } from "../../gameModules";

let specialStorage = _.cloneDeep(gameModules.storage);
let specialProcessor = _.cloneDeep(gameModules.processor);
let yourFriend = _.cloneDeep(gameModules.yourFriend);
specialProcessor.isBroken = true;
yourFriend.isBroken = true;
specialStorage.programs = [_.cloneDeep({ name: "Information", key: "information", level: 1 })];
export const finalFightQuestTemplate = [
    [...Array(18).fill(gameModules.space)],
    [...Array(18).fill(gameModules.space)],
    [...Array(18).fill(gameModules.space)],
    [...Array(3).fill(gameModules.space), ...Array(12).fill(gameModules.denied), ...Array(3).fill(gameModules.space)],
    [
        ...Array(3).fill(gameModules.space),
        ...Array(1).fill(gameModules.denied),
        ...Array(10).fill(gameModules.space),
        ...Array(1).fill(gameModules.denied),
        ...Array(3).fill(gameModules.space)
    ],
    [
        ...Array(3).fill(gameModules.space),
        ...Array(1).fill(gameModules.denied),
        ...Array(10).fill(gameModules.space),
        ...Array(1).fill(gameModules.denied),
        ...Array(3).fill(gameModules.space)
    ],
    [
        ...Array(3).fill(gameModules.space),
        ...Array(1).fill(gameModules.denied),

        ...Array(2).fill(gameModules.space),
        ...Array(6).fill(gameModules.way),
        ...Array(2).fill(gameModules.space),

        ...Array(1).fill(gameModules.denied),
        ...Array(3).fill(gameModules.space)
    ],

    [
        ...Array(3).fill(gameModules.space),
        ...Array(1).fill(gameModules.denied),

        ...Array(2).fill(gameModules.space),
        ...Array(1).fill(gameModules.way),

        ...Array(3).fill(gameModules.availableSpace),
        yourFriend,

        ...Array(1).fill(gameModules.way),
        ...Array(2).fill(gameModules.space),

        ...Array(1).fill(gameModules.denied),
        ...Array(3).fill(gameModules.space)
    ],
    [
        ...Array(3).fill(gameModules.space),
        ...Array(1).fill(gameModules.denied),

        ...Array(2).fill(gameModules.space),
        ...Array(1).fill(gameModules.way),
        ...Array(3).fill(gameModules.processor),
        specialProcessor,
        ...Array(1).fill(gameModules.way),
        ...Array(2).fill(gameModules.space),

        ...Array(1).fill(gameModules.denied),
        ...Array(3).fill(gameModules.space)
    ],
    [
        ...Array(3).fill(gameModules.space),
        ...Array(1).fill(gameModules.denied),

        ...Array(2).fill(gameModules.space),
        ...Array(1).fill(gameModules.way),
        ...Array(1).fill(gameModules.processor),
        specialStorage,
        ...Array(1).fill(gameModules.wallet),
        ...Array(1).fill(gameModules.processor),
        ...Array(1).fill(gameModules.way),
        ...Array(2).fill(gameModules.space),

        ...Array(1).fill(gameModules.denied),
        ...Array(3).fill(gameModules.space)
    ],
    [
        ...Array(3).fill(gameModules.space),
        ...Array(1).fill(gameModules.denied),

        ...Array(2).fill(gameModules.space),
        ...Array(1).fill(gameModules.way),
        ...Array(4).fill(gameModules.processor),
        ...Array(1).fill(gameModules.way),
        ...Array(2).fill(gameModules.space),

        ...Array(1).fill(gameModules.denied),
        ...Array(3).fill(gameModules.space)
    ],

    [
        ...Array(3).fill(gameModules.space),
        ...Array(1).fill(gameModules.denied),
        ...Array(2).fill(gameModules.space),
        ...Array(6).fill(gameModules.way),
        ...Array(2).fill(gameModules.space),
        ...Array(1).fill(gameModules.denied),
        ...Array(3).fill(gameModules.space)
    ],
    [
        ...Array(3).fill(gameModules.space),
        ...Array(1).fill(gameModules.denied),
        ...Array(10).fill(gameModules.space),
        ...Array(1).fill(gameModules.denied),
        ...Array(3).fill(gameModules.space)
    ],
    [
        ...Array(3).fill(gameModules.space),
        ...Array(1).fill(gameModules.denied),
        ...Array(10).fill(gameModules.space),
        ...Array(1).fill(gameModules.denied),
        ...Array(3).fill(gameModules.space)
    ],
    [...Array(3).fill(gameModules.space), ...Array(12).fill(gameModules.denied), ...Array(3).fill(gameModules.space)],
    [...Array(18).fill(gameModules.space)],
    [...Array(18).fill(gameModules.space)],
    [...Array(18).fill(gameModules.space)]
];
