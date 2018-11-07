import { gameModules } from "../../gameModules";

export let basementServers = {
    dangerousProcessors: {
        class: "dangerousProcessors",
        server: [
            [...Array(4).fill(gameModules.processor)],
            [...Array(1).fill(gameModules.processor), ...Array(2).fill(gameModules.antivirus), ...Array(1).fill(gameModules.processor)],
            [...Array(1).fill(gameModules.processor), ...Array(2).fill(gameModules.antivirus), ...Array(1).fill(gameModules.processor)],
            [...Array(4).fill(gameModules.processor)]
        ]
    },
    valleyOfMoney: {
        class: "valleyOfMoney",
        server: [
            [...Array(1).fill(gameModules.antivirus), ...Array(2).fill(gameModules.firewall), ...Array(1).fill(gameModules.antivirus)],
            [...Array(1).fill(gameModules.firewall), ...Array(2).fill(gameModules.wallet), ...Array(1).fill(gameModules.firewall)],
            [...Array(1).fill(gameModules.firewall), ...Array(2).fill(gameModules.wallet), ...Array(1).fill(gameModules.firewall)],
            [...Array(1).fill(gameModules.antivirus), ...Array(2).fill(gameModules.firewall), ...Array(1).fill(gameModules.antivirus)]
        ]
    },
    programParadise: {
        class: "programParadise",
        server: [
            [...Array(1).fill(gameModules.processor), ...Array(1).fill(gameModules.firewall), ...Array(2).fill(gameModules.processor)],
            [
                ...Array(1).fill(gameModules.firewall),
                ...Array(1).fill(gameModules.storage),
                ...Array(1).fill(gameModules.antivirus),
                ...Array(1).fill(gameModules.processor)
            ],
            [
                ...Array(1).fill(gameModules.processor),
                ...Array(1).fill(gameModules.antivirus),
                ...Array(1).fill(gameModules.storage),
                ...Array(1).fill(gameModules.firewall)
            ],
            [...Array(1).fill(gameModules.processor), ...Array(1).fill(gameModules.firewall), ...Array(2).fill(gameModules.processor)]
        ]
    },
    miningFarm: {
        class: "miningFarm",
        server: [
            [...Array(4).fill(gameModules.miner)],
            [
                ...Array(1).fill(gameModules.antivirus),
                ...Array(1).fill(gameModules.firewall),
                ...Array(1).fill(gameModules.wallet),
                ...Array(1).fill(gameModules.firewall)
            ],
            [
                ...Array(1).fill(gameModules.firewall),
                ...Array(1).fill(gameModules.wallet),
                ...Array(1).fill(gameModules.firewall),
                ...Array(1).fill(gameModules.antivirus)
            ],
            [...Array(4).fill(gameModules.miner)]
        ]
    },
    stealWall: {
        class: "stealWall",
        server: [
            [...Array(1).fill(gameModules.antivirus), ...Array(1).fill(gameModules.miner), ...Array(2).fill(gameModules.processor)],
            [
                ...Array(1).fill(gameModules.storage),
                ...Array(1).fill(gameModules.firewall),
                ...Array(1).fill(gameModules.processor),
                ...Array(1).fill(gameModules.antivirus)
            ],
            [
                ...Array(1).fill(gameModules.firewall),
                ...Array(1).fill(gameModules.storage),
                ...Array(1).fill(gameModules.firewall),
                ...Array(1).fill(gameModules.miner)
            ],
            [
                ...Array(1).fill(gameModules.processor),
                ...Array(1).fill(gameModules.firewall),
                ...Array(1).fill(gameModules.antivirus),
                ...Array(1).fill(gameModules.miner)
            ]
        ]
    }
};
