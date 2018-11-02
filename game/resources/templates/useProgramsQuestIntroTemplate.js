import _ from "lodash";
import { gameModules } from "../../gameModules";

let specialMiner = _.cloneDeep(gameModules.miner);
let specialWallet = _.cloneDeep(gameModules.wallet);
let hackedSpecialWallet = _.cloneDeep(gameModules.miner);
specialWallet.isVisible = true;
specialMiner.isVisible = true;
hackedSpecialWallet.isVisible = true;
hackedSpecialWallet.isBroken = true;

export const useProgramsQuestIntroTemplate = [
    [...Array(15).fill(gameModules.space)],
    [...Array(15).fill(gameModules.space)],
    [...Array(2).fill(gameModules.space), ...Array(11).fill(gameModules.denied), ...Array(2).fill(gameModules.space)],
    [
        ...Array(2).fill(gameModules.space),
        ...Array(1).fill(gameModules.denied),
        ...Array(9).fill(gameModules.space),
        ...Array(1).fill(gameModules.denied),
        ...Array(2).fill(gameModules.space)
    ],
    [
        ...Array(2).fill(gameModules.space),
        ...Array(1).fill(gameModules.denied),
        ...Array(9).fill(gameModules.space),
        ...Array(1).fill(gameModules.denied),
        ...Array(2).fill(gameModules.space)
    ],
    [
        ...Array(2).fill(gameModules.space),
        ...Array(1).fill(gameModules.denied),
        ...Array(2).fill(gameModules.space),
        ...Array(5).fill(gameModules.way),
        ...Array(2).fill(gameModules.space),
        ...Array(1).fill(gameModules.denied),
        ...Array(2).fill(gameModules.space)
    ],
    [
        ...Array(2).fill(gameModules.space),
        ...Array(1).fill(gameModules.denied),
        ...Array(2).fill(gameModules.space),
        ...Array(1).fill(gameModules.way),
        ...Array(1).fill(gameModules.availableSpace),
        specialMiner,
        ...Array(1).fill(gameModules.yourFriend),
        ...Array(1).fill(gameModules.way),
        ...Array(2).fill(gameModules.space),
        ...Array(1).fill(gameModules.denied),
        ...Array(3).fill(gameModules.space)
    ],
    [
        ...Array(2).fill(gameModules.space),
        ...Array(1).fill(gameModules.denied),
        ...Array(2).fill(gameModules.space),
        ...Array(1).fill(gameModules.way),
        specialMiner,
        specialWallet,
        hackedSpecialWallet,
        ...Array(1).fill(gameModules.way),
        ...Array(2).fill(gameModules.space),
        ...Array(1).fill(gameModules.denied),
        ...Array(3).fill(gameModules.space)
    ],
    [
        ...Array(2).fill(gameModules.space),
        ...Array(1).fill(gameModules.denied),
        ...Array(2).fill(gameModules.space),
        ...Array(1).fill(gameModules.way),
        ...Array(1).fill(gameModules.availableSpace),
        specialMiner,
        ...Array(1).fill(gameModules.availableSpace),
        ...Array(1).fill(gameModules.way),
        ...Array(2).fill(gameModules.space),
        ...Array(1).fill(gameModules.denied),
        ...Array(3).fill(gameModules.space)
    ],
    [
        ...Array(2).fill(gameModules.space),
        ...Array(1).fill(gameModules.denied),
        ...Array(2).fill(gameModules.space),
        ...Array(5).fill(gameModules.way),
        ...Array(2).fill(gameModules.space),
        ...Array(1).fill(gameModules.denied),
        ...Array(2).fill(gameModules.space)
    ],
    [
        ...Array(2).fill(gameModules.space),
        ...Array(1).fill(gameModules.denied),
        ...Array(9).fill(gameModules.space),
        ...Array(1).fill(gameModules.denied),
        ...Array(2).fill(gameModules.space)
    ],
    [
        ...Array(2).fill(gameModules.space),
        ...Array(1).fill(gameModules.denied),
        ...Array(9).fill(gameModules.space),
        ...Array(1).fill(gameModules.denied),
        ...Array(2).fill(gameModules.space)
    ],
    [...Array(2).fill(gameModules.space), ...Array(11).fill(gameModules.denied), ...Array(2).fill(gameModules.space)],
    [...Array(15).fill(gameModules.space)],
    [...Array(15).fill(gameModules.space)]
];
