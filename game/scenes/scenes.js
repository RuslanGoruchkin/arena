import Stage from "telegraf/stage";
import languageScene from "./start/languageScene";
import selectCharacterScene from "./start/selectCharacterScene";
import confirmScene from "./start/confirmScene";
import mainScene from "./main/mainScene";
import settingScene from "./main/settingScene";
import disclamerScene from "./main/disclamerScene";
import paymentScene from "./main/paymentScene";
import oopsScene from "./main/oopsScene";
import characterScene from "./main/characterScene";
import changeLanguageScene from "./main/changeLanguageScene";
import mainMenuScene from "./main/mainMenuScene";
import storyTellingScene from "./start/storyTellingScene";
import comicsListScene from "./main/comicsListScene";
import drinkingScene from "./needs/drinkingScene";
import eatingScene from "./needs/eatingScene";
import sleepingScene from "./needs/sleepingScene";
import hallwayRoomScene from "./rooms/hallwayRoomScene";
import marketRoomScene from "./rooms/marketRoomScene";
import inventoryScene from "./main/inventoryScene";
import ratingScene from "./main/ratingScene";
import equipScene from "./main/equipScene";
import unequipScene from "./main/unequipScene";
import buyScrollScene from "./shop/buyScrollScene";
import buyBuffScene from "./shop/buyBuffScene";
import buyProjectileScene from "./shop/buyProjectileScene";
import buyPotionScene from "./shop/buyPotionScene";
import vendorScene from "./shop/vendorScene";
import levelUpScene from "./levelUp/levelUpScene";
import statScene from "./levelUp/statScene";
import levelUpConfirmScene from "./levelUp/levelUpConfirmScene";
import levelUpAltScene from "./levelUp/levelUpAltScene";
import levelUpRefreshScene from "./levelUp/levelUpRefreshScene";
import routerScene from "./main/routerScene";
import trainingRoomScene from "./rooms/trainingRoomScene";
import workRoomScene from "./rooms/workRoomScene";

export const stage = new Stage([
    languageScene,
    selectCharacterScene,
    confirmScene,
    ratingScene,
    mainScene,
    settingScene,
    disclamerScene,
    paymentScene,
    oopsScene,
    characterScene,
    changeLanguageScene,
    mainMenuScene,
    storyTellingScene,
    comicsListScene,
    drinkingScene,
    eatingScene,
    sleepingScene,
    hallwayRoomScene,
    marketRoomScene,
    inventoryScene,
    equipScene,
    unequipScene,
    buyScrollScene,
    buyBuffScene,
    buyPotionScene,
    buyProjectileScene,
    vendorScene,
    levelUpScene,
    statScene,
    levelUpConfirmScene,
    levelUpAltScene,
    levelUpRefreshScene,
    routerScene,
    trainingRoomScene,
    workRoomScene
]);
export {
    languageScene,
    selectCharacterScene,
    confirmScene,
    mainScene,
    settingScene,
    disclamerScene,
    paymentScene,
    oopsScene,
    characterScene,
    changeLanguageScene,
    mainMenuScene,
    storyTellingScene,
    comicsListScene,
    ratingScene,
    drinkingScene,
    eatingScene,
    sleepingScene,
    hallwayRoomScene,
    marketRoomScene,
    inventoryScene,
    equipScene,
    unequipScene,
    buyScrollScene,
    buyBuffScene,
    buyPotionScene,
    buyProjectileScene,
    vendorScene,
    levelUpScene,
    statScene,
    levelUpConfirmScene,
    levelUpAltScene,
    levelUpRefreshScene,
    routerScene,
    trainingRoomScene,
    workRoomScene
};
