import { list, save, del, batchDel } from "@/api/user";

const user = {
  namespaced: true,
  state: {
    total_rows: 0,
    users: []
  },
  mutations: {
    set_users: (state, users) => {
      state.users = users;
    },
    update_user: (state, user) => {
      state.users = state.users.map(item => {
        return item.id == user.id ? user : item;
      });
    },
    del_user: (state, id) => {
      state.users = state.users.filter(item => {
        return item.id != id;
      });
    },
    set_total_rows: (state, total_rows) => {
      state.total_rows = total_rows;
    },
    add_user: (state, user) => {
      state.users.push(user);
    }
  },
  actions: {
    getUsers({ commit }, params) {
      const { page, size, name } = params;
      return new Promise((resolve, reject) => {
        list(page, size, name)
          .then(res => {
            const { data } = res;
            commit("set_total_rows", data.total_rows);
            commit("set_users", data.users);
            resolve();
          })
          .catch(error => {
            reject();
          });
      });
    },
    save({ commit }, params) {
      const user = params;

      return new Promise((resolve, reject) => {
        save(user)
          .then(res => {
            const { data } = res;
            if (user.id != data.user.id) {
              commit("set_total_rows", data.total_rows);
              commit("add_user", data.user);
            } else {
              commit("update_user", data.user);
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
            commit("del_user", data.id);
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
              commit("del_user", id);
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
    users: (state, getters, rootState) => {
      return state.users;
    },
    total_rows: (state, getters, rootState) => {
      return state.total_rows;
    }
  }
};
export default user;
