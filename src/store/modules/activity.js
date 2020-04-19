import { list, save, del, batchDel } from "@/api/activity";
import utils from "@/utils/utils";
const activity = {
  namespaced: true,
  state: {
    total_rows: 0,
    activitys: []
  },
  mutations: {
    set_activitys: (state, activitys) => {
      state.activitys = activitys;
    },
    update_activity: (state, activity) => {
      state.activitys = state.activitys.map(item => {
        return item.id == activity.id ? activity : item;
      });
    },
    del_activity: (state, id) => {
      state.activitys = state.activitys.filter(item => {
        return item.id != id;
      });
    },
    set_total_rows: (state, total_rows) => {
      state.total_rows = total_rows;
    },
    add_activity: (state, activity) => {
      state.activitys.push(activity);
    }
  },
  actions: {
    getActivitys({ commit }, params) {
      const { page, size, name } = params;
      return new Promise((resolve, reject) => {
        list(page, size, name)
          .then(res => {
            const { data } = res;
            commit("set_total_rows", data.total_rows);
            commit("set_activitys", data.activitys);
            resolve();
          })
          .catch(error => {
            reject();
          });
      });
    },
    save({ commit }, params) {
      const activity = params;

      return new Promise((resolve, reject) => {
        save(activity)
          .then(res => {
            const { data } = res;
            if (activity.id != data.activity.id) {
              commit("set_total_rows", data.total_rows);
              commit("add_activity", data.activity);
            } else {
              commit("update_activity", data.activity);
            }
            resolve();
          })
          .catch(error => {
            reject();
          });
      });
    },
    del({ commit }, params) {
      const { id } = params;
      return new Promise((resolve, reject) => {
        del(id)
          .then(res => {
            const { data } = res;
            commit("del_activity", data.id);
            commit("set_total_rows", data.total_rows);
            resolve();
          })
          .catch(error => {
            reject();
          });
      });
    },
    batchDel({ commit }, params) {
      return new Promise((resolve, reject) => {
        batchDel(params)
          .then(res => {
            const { data } = res;
            let ids = data.ids;
            for (let id of ids) {
              commit("del_activity", id);
            }
            resolve();
          })
          .catch(error => {
            reject();
          });
      });
    }
  },
  getters: {
    activitys: (state, getters, rootState) => {
      return state.activitys;
    },
    total_rows: (state, getters, rootState) => {
      return state.total_rows;
    }
  }
};
export default activity;
