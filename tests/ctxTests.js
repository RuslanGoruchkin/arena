import _ from "lodash";
import { stateWrapper, translate } from "../game/helpers/ctx";

const expect = require("chai").expect();
const should = require("chai").should();

describe("Ctx tests", () => {
    describe("Translations tests", () => {
        it("Should return english string", (done) => {
            stateWrapper(done, (ctx, state) => {
                _.set(state, "language", "en");
                let t = translate(state, "menu.characters.singularityProphet");
                t.should.equal("👩‍🔬 Singularity Prophet");
                done();
            });
        });
        it("Should return russian string", (done) => {
            stateWrapper(done, (ctx, state) => {
                _.set(state, "language", "ru");
                let t = translate(state, "menu.characters.singularityProphet");
                t.should.equal("👩‍🔬 Пророк Сингулярности");
                done();
            });
        });
    });
});
