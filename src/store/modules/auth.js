import { getToken, setToken, removeToken } from "@/utils/auth";
import { login, getUser, permission } from "@/api/auth";
const auth = {
  namespaced: true,
  state: {
    token: getToken(),
    user: {},
    permission: {},
    loaded: false
  },
  mutations: {
    set_token: (state, token) => {
      state.token = token;
    },
    set_suer: (state, user) => {
      state.user = user;
      state.loaded = user.id ? true : false;
    },
    set_prermission: (state, permission) => {
      state.permission = permission;
    }
  },
  actions: {
    login({ commit }, userInfo) {
      const { username, password } = userInfo;
      return new Promise((resolve, reject) => {
        login(username, password)
          .then(res => {
            const { data } = res;
            commit("set_token", data.token);
            setToken(data.token);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        removeToken();
        commit("set_suer", {});
        resolve();
      });
    },
    getUser({ commit }) {
      return new Promise((resolve, reject) => {
        getUser()
          .then(res => {
            const { data } = res;
            commit("set_suer", data.user);
            resolve(data.user);
          })
          .catch(() => {
            reject(false);
          });
      });
    },
    resetToken({ commit }) {
      return new Promise((resolve, reject) => {
        removeToken();
        commit("set_suer", {});
        resolve();
      });
    },
    permission({ commit }) {
      return new Promise((resolve, reject) => {
        permission()
          .then(res => {
            const { data } = res;
            commit("set_prermission", data.permission);
            resolve(data.permission);
          })
          .catch(() => {
            reject(false);
          });
      });
    }
  },
  getters: {
    permission: (state, getters, rootState) => {
      return state.permission.filter(item => {
        return item.type == "2";
      });
    }
  }
};
export default auth;
