import { list } from "@/api/log";

const user = {
  namespaced: true,
  state: {
    total_rows: 0,
    logs: []
  },
  mutations: {
    set_logs: (state, logs) => {
      state.logs = logs;
    },
    set_total_rows: (state, total_rows) => {
      state.total_rows = total_rows;
    }
  },
  actions: {
    getLogs({ commit }, params) {
      const { page, size, name } = params;
      return new Promise((resolve, reject) => {
        list(page, size, name)
          .then(res => {
            const { data } = res;
            commit("set_total_rows", data.total_rows);
            commit("set_logs", data.logs);
            resolve();
          })
          .catch(error => {
            reject();
          });
      });
    }
  },
  getters: {
    logs: (state, getters, rootState) => {
      return state.logs;
    },
    total_rows: (state, getters, rootState) => {
      return state.total_rows;
    }
  }
};
export default user;
