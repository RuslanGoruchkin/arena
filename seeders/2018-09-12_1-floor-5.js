require("babel-register");
module.exports = {
    up: async queryInterface => {
        const newMap = require("./../game/newMap.js");
        let accesses = [];
        let items = [];
        let i = 5;
        let { accessItems, mapItems } = newMap.createFloor(`${i}x${i}`, i);
        accesses = [...accesses, ...accessItems];
        items = [...items, ...mapItems];
        await queryInterface.bulkInsert("mapItems", items, {});
        if (accesses.length) {
            await queryInterface.bulkInsert("accesses", accesses, {});
        }
    },

    down: async queryInterface => {
        await queryInterface.bulkDelete("mapItems", null, {});
    }
};
