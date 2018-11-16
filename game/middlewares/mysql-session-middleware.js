import db from "../../models/index";
import _ from "lodash";

const debug = require("debug")("telegraf:session-mysql");

let sessions = {};
class MySQLSession {
    constructor(options) {
        this.options = Object.assign(
            {
                property: "session",
                getSessionKey: ctx => {
                    if (ctx.updateType === "callback_query") {
                        ctx = ctx.update.callback_query.message;
                    }
                    if (!ctx.from || !ctx.chat) {
                        return;
                    }
                    return `${ctx.from.id}:${ctx.chat.id}`;
                },
                store: {}
            },
            options
        );
        this.loadPromises = new Map();
        this.savePromises = new Map();
        this.defineMap();
        this.client = db;
    }
    defineMap() {
        // if (!global._hackerpunk.sessions) {
        //     Object.defineProperty(global._hackerpunk, "sessions", {
        //         get: () => ({ ...sessions }),
        //         set: newValue => {
        //             sessions = Object.assign({}, newValue);
        //         }
        //     });
        // }
    }
    getSession(key) {
        if (_.isObject(sessions[key])) return Promise.resolve(sessions[key]);
        let existedPromise = this.loadPromises.get(key);
        if (existedPromise) {
            return existedPromise;
        }
        let promise = this.client.session.findById(key).then(json => {
            let session = {};
            if (_.get(json, "dataValues.session")) {
                try {
                    debug("JSON: ", json.dataValues);
                    session = { ...json.dataValues.session };
                    debug("session state", session);
                } catch (error) {
                    debug("Parse session state failed", error);
                }
            }
            sessions[key] = session;
            return session;
        });
        this.loadPromises.set(key, promise);
        return promise;
    }

    saveSession(key, session) {
        if (!session || Object.keys(session).length === 0) {
            debug("clear session");
            return this.client.query('DELETE FROM sessions WHERE id="' + key + '"');
        }
        debug("save session", session, "key", key);
        // let existedPromise = this.savePromises.get(key);
        // if (existedPromise) {
        //     debug("session with key", key, "key", " is saving now");
        //     return existedPromise;
        // }
        let promise = this.client.session.upsert({ id: key, session });

        if (_.get(session, "player.id")) {
            promise = this.client.player
                .upsert({
                    id: session.player.id,
                    ...session.player
                })
                .then(() => this.client.player.findOne({ where: { id: session.player.id } }))
                .then(player =>
                    this.client.session.upsert({
                        id: key,
                        playerId: player.id
                    })
                );
        }
        this.savePromises.set(key, promise);
        return promise;
    }

    middleware() {
        return (ctx, next) => {
            const key = this.options.getSessionKey(ctx);
            if (!key) {
                return next();
            }
            debug("session key %s", key);
            return this.getSession(key).then(() => {
                debug("session value", sessions[key]);
                Object.defineProperty(ctx, this.options.property, {
                    get: () => sessions[key],
                    set: newValue => {
                        sessions[key] = Object.assign({}, newValue);
                    }
                });
                // eslint-disable-next-line promise/no-nesting
                return next().then(() => this.saveSession(key, sessions[key]));
            });
        };
    }
}

export default MySQLSession;
