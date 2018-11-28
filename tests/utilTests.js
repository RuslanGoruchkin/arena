// import _ from "lodash";
// // import { addXPToPlayer, calculateProgramCount, generatePlayerNickname, getServerSizeFromFloor, NICKNAME_LENGTH } from "../game/util";
// import { stateWrapper } from "../game/helpers/ctx";
//
// const expect = require("chai").expect();
// const should = require("chai").should();
//
// describe("Util tests", () => {
//     describe("CalculateProgramCount tests", () => {
//         it("Player with 1 memory should have 11 programs", () => {
//             calculateProgramCount(1).should.equal(11);
//         });
//         it("Player with 3 memory should have 16 programs", () => {
//             calculateProgramCount(3).should.equal(16);
//         });
//         it("Player with 8 memory should have 46 programs", () => {
//             calculateProgramCount(8).should.equal(46);
//         });
//     });
//     it("Check generated nickname's length", () => {
//         let nickname = generatePlayerNickname();
//         nickname.length.should.equal(NICKNAME_LENGTH);
//     });
//
//     describe("GetServerSizeFromFloor tests", () => {
//         it("Should have size 4, when floor's name is '4x4'", () => {
//             getServerSizeFromFloor("4x4").should.equal(4);
//         });
//
//         it("Should have size 8, when floor's name is '8x8'", () => {
//             getServerSizeFromFloor("8x8").should.equal(8);
//         });
//     });
//
//     describe("Add xp to player tests", function() {
//         it("Should add 10 xp to player", done => {
//             stateWrapper(done, (ctx, state) => {
//                 let player = { XP: 0, playerId: "test" };
//                 _.set(state, "players.test", player);
//                 _.set(state, "player", player);
//                 _.get(addXPToPlayer(state, { XP: 10, playerId: "test" }), "player.XP").should.equals(10);
//                 done();
//             });
//         });
//         it("Should add 100 xp to player", done => {
//             stateWrapper(done, (ctx, state) => {
//                 let player = { XP: 0, playerId: "test" };
//                 _.set(state, "players.test", player);
//                 _.set(state, "player", player);
//                 _.get(addXPToPlayer(state, { XP: 100, playerId: "test" }), "player.XP").should.equals(100);
//                 done();
//             });
//         });
//     });
// });
