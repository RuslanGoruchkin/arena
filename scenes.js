import Stage from "telegraf/stage";
import languageScene from "./game/scenes/start/languageScene";
import selectCharacterScene from "./game/scenes/start/selectCharacterScene";
import confirmScene from "./game/scenes/start/confirmScene";
import moduleRouterScene from "./game/scenes/main/moduleRouterScene";
import minerModuleScene from "./game/scenes/modules/minerModuleScene";
import walletModuleScene from "./game/scenes/modules/walletModuleScene";
import storageModuleScene from "./game/scenes/modules/storage/storageModuleScene";
import processorModuleScene from "./game/scenes/modules/processor/processorModuleScene";
import createProgramScene from "./game/scenes/modules/processor/createProgramScene";
import attackScene from "./game/scenes/versus/attackScene";
import mainScene from "./game/scenes/main/mainScene";
import actionDefeatedModuleScene from "./game/scenes/versus/action/actionRouterDefeatedModuleScene";
import minerDefeatedActionScene from "./game/scenes/versus/action/minerDefeatedActionScene";
import walletDefeatedActionScene from "./game/scenes/versus/action/walletDefeatedActionScene";
import processorDefeatedActionScene from "./game/scenes/versus/action/processorDefeatedActionScene";
import storageDefeatedActionScene from "./game/scenes/versus/action/storageDefeatedActionScene";
import antivirusDefeatedActionScene from "./game/scenes/versus/action/antivirusDefeatedActionScene";
import firewallDefeatedActionScene from "./game/scenes/versus/action/firewallDefeatedActionScene";
import questStartScene from "./game/scenes/quests/fightQuest/questStartScene";
import confirmQuestScene from "./game/scenes/quests/fightQuest/confirmQuestScene";
import congratulationQuestScene from "./game/scenes/quests/fightQuest/congratulationQuestScene";
import selectAttackProgramScene from "./game/scenes/versus/selectAttackProgramScene";
import vendorProgramScene from "./game/scenes/shop/vendorProgramScene";
import buyProgramScene from "./game/scenes/shop/buyProgramScene";
import sellProgramScene from "./game/scenes/shop/sellProgramScene";
import vendorModuleScene from "./game/scenes/shop/vendorModuleScene";
import selectProgramPriceScene from "./game/scenes/shop/selectProgramPriceScene";
import storeDisclamerScene from "./game/scenes/main/storeDisclamerScene";
import selectProgramLevelScene from "./game/scenes/shop/selectProgramLevelScene";
import buyModuleScene from "./game/scenes/shop/buyModuleScene";
import placeModuleScene from "./game/scenes/modules/placeModuleScene";
import elevatorModuleScene from "./game/scenes/modules/elevatorModuleScene";
import settingScene from "./game/scenes/main/settingScene";
import questScene from "./game/scenes/quests/questScene";
import ratingScene from "./game/scenes/main/ratingScene";
import disclamerScene from "./game/scenes/main/disclamerScene";
import relocationMasterScene from "./game/scenes/modules/relocationMasterScene";
import availableSpaceModuleScene from "./game/scenes/modules/availableSpaceModuleScene";
import antivirusModuleScene from "./game/scenes/modules/antivirusModuleScene";
import firewallModuleScene from "./game/scenes/modules/firewallModuleScene";
import paymentScene from "./game/scenes/main/paymentScene";
import oopsScene from "./game/scenes/main/oopsScene";
import questWalletDefeatedActionScene from "./game/scenes/versus/action/questWalletDefeatedActionScene";
import teleportScene from "./game/scenes/main/teleportScene";
import finalFightQuest from "./game/scenes/quests/fightQuest/finalFightQuest";
import characterScene from "./game/scenes/main/characterScene";
import changeLanguageScene from "./game/scenes/main/changeLanguageScene";
import transferProgramFromMemoryScene from "./game/scenes/modules/storage/transferProgramFromMemoryScene";
import transferProgramFromStorageScene from "./game/scenes/modules/storage/transferProgramFromStorageScene";
import selectCreatedProgramLevelScene from "./game/scenes/modules/processor/selectCreatedProgramLevelScene";
import mainMenuScene from "./game/scenes/main/mainMenuScene";
import storyTellingScene from "./game/scenes/start/storyTellingScene";
import comicsListScene from "./game/scenes/main/comicsListScene";
import selectModuleLevelScene from "./game/scenes/shop/selectModuleLevelScene";
import moduleCharacteristicsViewerScene from "./game/scenes/shop/moduleCharacteristicsViewerScene";
import defenseQuestScene from "./game/scenes/quests/openWorldQuests/defenseQuestScene";
import offenseQuestScene from "./game/scenes/quests/openWorldQuests/offenseQuestScene";
import dailyQuestScene from "./game/scenes/quests/dailyQuests/dailyQuestScene";
import dailyTimeoutScene from "./game/scenes/quests/dailyQuests/dailyTimeoutScene";
import outroScene from "./game/scenes/quests/outroScene";
import questRestartScene from "./game/scenes/quests/questRestartScene";
import buyProcessorQuestIntro from "./game/scenes/quests/tutorialQuests/buyProcessorQuestIntro";
import useProgramsQuestIntro from "./game/scenes/quests/tutorialQuests/useProgramsQuestIntro";
import finalFightQuestIntro from "./game/scenes/quests/fightQuest/finalFightQuestIntro";
import finalFightQuestOutro from "./game/scenes/quests/fightQuest/finalFightQuestOutro";
import dailyMentorScene from "./game/scenes/quests/dailyQuests/dailyMentorScene";
import dailyNPCScene from "./game/scenes/quests/dailyQuests/dailyNPCScene";
import dailyIntroScene from "./game/scenes/quests/dailyQuests/dailyIntroScene";
import dailyOutroScene from "./game/scenes/quests/dailyQuests/dailyOutroScene";
import rewardScene from "./game/scenes/quests/rewardScene";
import rewardSceneB from "./game/scenes/quests/rewardSceneB";
// import weeklyMentorScene from "./game/scenes/rooms/weeklyQuests/weeklyMentorScene";
// import weeklyNPCScene from "./game/scenes/rooms/weeklyQuests/weeklyNPCScene";
// import weeklyIntroScene from "./game/scenes/rooms/weeklyQuests/weeklyIntroScene";
// import weeklyOutroScene from "./game/scenes/rooms/weeklyQuests/weeklyOutroScene";
// import weeklyQuestScene from "./game/scenes/rooms/weeklyQuests/weeklyQuestScene";
// import weeklyTimeoutScene from "./game/scenes/rooms/weeklyQuests/weeklyTimeoutScene";

export const stage = new Stage([
    languageScene,
    selectCharacterScene,
    confirmScene,
    moduleRouterScene,
    minerModuleScene,
    walletModuleScene,
    storageModuleScene,
    processorModuleScene,
    createProgramScene,
    attackScene,
    mainScene,
    actionDefeatedModuleScene,
    minerDefeatedActionScene,
    walletDefeatedActionScene,
    processorDefeatedActionScene,
    storageDefeatedActionScene,
    antivirusDefeatedActionScene,
    firewallDefeatedActionScene,
    questStartScene,
    confirmQuestScene,
    congratulationQuestScene,
    selectAttackProgramScene,
    vendorProgramScene,
    buyProgramScene,
    sellProgramScene,
    vendorModuleScene,
    selectProgramPriceScene,
    storeDisclamerScene,
    selectProgramLevelScene,
    buyModuleScene,
    placeModuleScene,
    elevatorModuleScene,
    settingScene,
    questScene,
    ratingScene,
    disclamerScene,
    relocationMasterScene,
    availableSpaceModuleScene,
    antivirusModuleScene,
    firewallModuleScene,
    paymentScene,
    oopsScene,
    questWalletDefeatedActionScene,
    teleportScene,
    finalFightQuest,
    characterScene,
    changeLanguageScene,
    transferProgramFromMemoryScene,
    transferProgramFromStorageScene,
    selectCreatedProgramLevelScene,
    mainMenuScene,
    storyTellingScene,
    comicsListScene,
    selectModuleLevelScene,
    moduleCharacteristicsViewerScene,
    defenseQuestScene,
    offenseQuestScene,
    dailyQuestScene,
    dailyTimeoutScene,
    dailyTimeoutScene,
    outroScene,
    questRestartScene,
    useProgramsQuestIntro,
    buyProcessorQuestIntro,
    finalFightQuestIntro,
    finalFightQuestOutro,
    dailyMentorScene,
    dailyNPCScene,
    dailyIntroScene,
    dailyOutroScene,
    rewardScene,
    rewardSceneB
    // weeklyMentorScene,
    // weeklyNPCScene,
    // weeklyIntroScene,
    // weeklyOutroScene,
    // weeklyQuestScene,
    // weeklyTimeoutScene,
    // weeklyTimeoutScene
]);
export {
    languageScene,
    selectCharacterScene,
    confirmScene,
    moduleRouterScene,
    minerModuleScene,
    walletModuleScene,
    storageModuleScene,
    processorModuleScene,
    createProgramScene,
    attackScene,
    mainScene,
    actionDefeatedModuleScene,
    minerDefeatedActionScene,
    walletDefeatedActionScene,
    processorDefeatedActionScene,
    storageDefeatedActionScene,
    antivirusDefeatedActionScene,
    firewallDefeatedActionScene,
    questStartScene,
    confirmQuestScene,
    congratulationQuestScene,
    selectAttackProgramScene,
    vendorProgramScene,
    buyProgramScene,
    sellProgramScene,
    vendorModuleScene,
    selectProgramPriceScene,
    storeDisclamerScene,
    selectProgramLevelScene,
    buyModuleScene,
    placeModuleScene,
    elevatorModuleScene,
    settingScene,
    questScene,
    ratingScene,
    disclamerScene,
    relocationMasterScene,
    availableSpaceModuleScene,
    antivirusModuleScene,
    firewallModuleScene,
    paymentScene,
    oopsScene,
    questWalletDefeatedActionScene,
    teleportScene,
    finalFightQuest,
    characterScene,
    changeLanguageScene,
    transferProgramFromMemoryScene,
    transferProgramFromStorageScene,
    selectCreatedProgramLevelScene,
    mainMenuScene,
    storyTellingScene,
    comicsListScene,
    selectModuleLevelScene,
    moduleCharacteristicsViewerScene,
    defenseQuestScene,
    offenseQuestScene,
    dailyQuestScene,
    dailyTimeoutScene,
    outroScene,
    questRestartScene,
    useProgramsQuestIntro,
    buyProcessorQuestIntro,
    finalFightQuestIntro,
    finalFightQuestOutro,
    dailyMentorScene,
    dailyNPCScene,
    dailyIntroScene,
    dailyOutroScene,
    rewardScene,
    rewardSceneB
};
