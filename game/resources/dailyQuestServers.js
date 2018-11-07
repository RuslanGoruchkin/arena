import { gameModules } from "../gameModules";
import _ from "lodash";

let specialStorage1 = _.cloneDeep(gameModules.storage);
specialStorage1.programs = [_.cloneDeep({ name: "daily1", key: "daily1", level: 1 })];
let specialStorage2 = _.cloneDeep(gameModules.storage);
specialStorage2.programs = [_.cloneDeep({ name: "daily2", key: "daily2", level: 1 })];
let specialStorage3 = _.cloneDeep(gameModules.storage);
specialStorage3.programs = [_.cloneDeep({ name: "daily3", key: "daily3", level: 1 })];

export let dailyQuestServers = {
    daily1: [
        [gameModules.storage, gameModules.wallet, gameModules.storage, gameModules.wallet],
        [gameModules.wallet, gameModules.storage, gameModules.firewall, gameModules.storage],
        [gameModules.storage, gameModules.firewall, gameModules.storage, gameModules.firewall],
        [gameModules.wallet, specialStorage1, gameModules.firewall, gameModules.storage]
    ],
    daily2: [
        [specialStorage2, gameModules.wallet, gameModules.wallet, gameModules.wallet],
        [gameModules.wallet, gameModules.wallet, gameModules.wallet, gameModules.wallet],
        [gameModules.wallet, gameModules.wallet, gameModules.wallet, gameModules.wallet],
        [gameModules.wallet, gameModules.wallet, gameModules.wallet, gameModules.wallet]
    ],
    daily3: [
        [gameModules.antivirus, gameModules.wallet, gameModules.firewall, gameModules.wallet],
        [gameModules.wallet, gameModules.firewall, gameModules.firewall, gameModules.firewall],
        [gameModules.firewall, gameModules.firewall, specialStorage3, gameModules.firewall],
        [gameModules.wallet, gameModules.firewall, gameModules.firewall, gameModules.firewall]
    ]
};