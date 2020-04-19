import Vue from "vue";
import Vuex from "vuex";
import auth from "./modules/auth";
import user from "./modules/user";
import role from "./modules/role";
import menu from "./modules/menu";
import log from "./modules/log";
import activity from "./modules/activity";
import wechat from "./modules/wechat";
import getters from "./getters";

Vue.use(Vuex);
const store = new Vuex.Store({
    modules: {
        auth,
        user,
        role,
        menu,
        log,
        activity,
        wechat
    },
    getters
});

export default store;

// const user = {
//   namespaced: true,
//   state: {},
//   mutations: {},
//   actions: {}
// };
