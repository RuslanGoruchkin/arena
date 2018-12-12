import Scene from "telegraf/scenes/base";
import { enterScene, keyboard, redirectToOopsScene, stateWrapper, t } from "../../helpers";
import stateManager from "../../stateManager";

const routerScene = new Scene("routerScene");

routerScene.enter(ctx =>
    stateWrapper(ctx,(ctx, state) => {
            return enterScene(ctx, "mainScene",state);
        //}
    })
);

export default routerScene;
