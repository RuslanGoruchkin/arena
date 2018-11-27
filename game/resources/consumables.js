export const consumables = {
    heal: { name: "HP Pot", cost: 10, text: "Restore HP and cure poison", load: 3, type: "potions" },
    stamina: { name: "SP Pot", cost: 10, text: "Restore SP and warm ice", load: 3, type: "potions" },
    manna: { name: "MP Pot", cost: 10, text: "Restore MP and extinguish fire", load: 3, type: "potions" },

    fire_resin: { name: "Fire Resin", cost: 10, text: "Adds fire damage to weapons attacks, but lowers accuracy.", load: 5, type: "buffs" },
    ice_resin: {
        name: "Ice Resin",
        cost: 10,
        text: "Adds ice damage to weapons attacks, but lowers attack speed.",
        load: 5,
        type: "buffs"
    },
    dark_resin: { name: "Dark Resin", cost: 10, text: "Adds dark damage to weapons attacks, but lowers range.", load: 5, type: "buffs" },
    light_resin: {
        name: "Light Resin",
        cost: 10,
        text: "Adds dark damage to weapons attacks, but lowers stunning.",
        load: 5,
        type: "buffs"
    },

    blink: { name: "Blink Scroll", cost: 10, text: "Scroll of Random Teleportation", load: 1, type: "scrolls" },
    wave: { name: "Wave Scroll", cost: 10, text: "Pushes, stuns and freezes the target", load: 1, type: "scrolls" },
    fire: { name: "Fire Scroll", cost: 10, text: "Damage and ignite target", load: 1, type: "scrolls" },

    knife: {
        name: "Knife",
        cost: 3,
        text: "A light throwing weapon that distracts rather than damages the target",
        load: 1,
        type: "projectiles"
    },
    dart: { name: "Dart Spear", cost: 10, text: "Heavy throwing spear", load: 3, type: "projectiles" },
    bomb: { name: "Poison Bomb", cost: 10, text: "Poisons the target and those standing nearby", load: 3, type: "projectiles" },
    web: { name: "Web Net", cost: 10, text: "Entangles the target and makes it inactive for a long time", load: 3, type: "projectiles" }
};
