import { gameModules } from "../../gameModules";

export const questTemplate = [
    //top border
    [
        ...Array(2).fill(gameModules.space),
        ...Array(1).fill(gameModules.way),
        ...Array(4).fill(gameModules.space),
        ...Array(1).fill(gameModules.way),
        ...Array(2).fill(gameModules.space)
    ],
    [
        ...Array(2).fill(gameModules.space),
        ...Array(1).fill(gameModules.way),
        ...Array(4).fill(gameModules.space),
        ...Array(1).fill(gameModules.way),
        ...Array(2).fill(gameModules.space)
    ],

    //sewer hatch

    [
        ...Array(2).fill(gameModules.way),
        ...Array(1).fill(gameModules.sewerHatch),
        ...Array(4).fill(gameModules.way),
        ...Array(1).fill(gameModules.sewerHatch),
        ...Array(2).fill(gameModules.way)
    ],

    //player's area

    [
        ...Array(2).fill(gameModules.space),
        ...Array(1).fill(gameModules.way),
        ...Array(4).fill(gameModules.space),
        ...Array(1).fill(gameModules.way),
        ...Array(2).fill(gameModules.space)
    ],
    [
        ...Array(2).fill(gameModules.space),
        ...Array(1).fill(gameModules.way),
        ...Array(4).fill(gameModules.space),
        ...Array(1).fill(gameModules.way),
        ...Array(2).fill(gameModules.space)
    ],
    [
        ...Array(2).fill(gameModules.space),
        ...Array(1).fill(gameModules.way),
        ...Array(4).fill(gameModules.space),
        ...Array(1).fill(gameModules.way),
        ...Array(2).fill(gameModules.space)
    ],
    [
        ...Array(2).fill(gameModules.space),
        ...Array(1).fill(gameModules.way),
        ...Array(4).fill(gameModules.space),
        ...Array(1).fill(gameModules.way),
        ...Array(2).fill(gameModules.space)
    ],

    //sewer hatch

    [
        ...Array(2).fill(gameModules.way),
        ...Array(1).fill(gameModules.sewerHatch),
        ...Array(4).fill(gameModules.way),
        ...Array(1).fill(gameModules.sewerHatch),
        ...Array(2).fill(gameModules.way)
    ],

    //hub's area

    [
        ...Array(2).fill(gameModules.space),
        ...Array(1).fill(gameModules.way),

        ...Array(2).fill(gameModules.space),
        ...Array(1).fill(gameModules.programVendor),
        ...Array(1).fill(gameModules.moduleVendor),

        ...Array(1).fill(gameModules.way),
        ...Array(2).fill(gameModules.space)
    ],
    [
        ...Array(2).fill(gameModules.space),
        ...Array(1).fill(gameModules.way),

        ...Array(2).fill(gameModules.space),
        ...Array(1).fill(gameModules.relocationMaster),
        ...Array(1).fill(gameModules.elevator),

        ...Array(1).fill(gameModules.way),
        ...Array(2).fill(gameModules.space)
    ],
    [
        ...Array(2).fill(gameModules.space),
        ...Array(1).fill(gameModules.way),
        ...Array(4).fill(gameModules.space),
        ...Array(1).fill(gameModules.way),
        ...Array(2).fill(gameModules.space)
    ],
    [
        ...Array(2).fill(gameModules.space),
        ...Array(1).fill(gameModules.way),
        ...Array(4).fill(gameModules.space),
        ...Array(1).fill(gameModules.way),
        ...Array(2).fill(gameModules.space)
    ],

    //sewer hatch

    [
        ...Array(2).fill(gameModules.way),
        ...Array(1).fill(gameModules.sewerHatch),
        ...Array(4).fill(gameModules.way),
        ...Array(1).fill(gameModules.sewerHatch),
        ...Array(2).fill(gameModules.way)
    ],

    //bottom border

    [
        ...Array(2).fill(gameModules.space),
        ...Array(1).fill(gameModules.way),
        ...Array(4).fill(gameModules.space),
        ...Array(1).fill(gameModules.way),
        ...Array(2).fill(gameModules.space)
    ],
    [
        ...Array(2).fill(gameModules.space),
        ...Array(1).fill(gameModules.way),
        ...Array(4).fill(gameModules.space),
        ...Array(1).fill(gameModules.way),
        ...Array(2).fill(gameModules.space)
    ]
];
