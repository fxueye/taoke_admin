import { list, save, del } from "@/api/role";
const role = {
  namespaced: true,
  state: {
    total_rows: 0,
    roles: []
  },
  mutations: {
    set_roles: (state, roles) => {
      state.roles = roles;
    },
    update_role: (state, role) => {
      state.roles = state.roles.map(item => {
        return item.id == role.id ? role : item;
      });
    },
    del_role: (state, id) => {
      state.roles = state.roles.filter(item => {
        return item.id != id;
      });
    },
    set_total_rows: (state, total_rows) => {
      state.total_rows = total_rows;
    },
    add_role: (state, role) => {
      state.roles.push(role);
    }
  },
  actions: {
    getRoles({ commit }, params) {
      const { page, size, name } = params;
      return new Promise((resolve, reject) => {
        list(page, size, name)
          .then(res => {
            const { data } = res;
            commit("set_total_rows", data.total_rows);
            commit("set_roles", data.roles);
            resolve();
          })
          .catch(error => {
            reject();
          });
      });
    },
    save({ commit }, params) {
      const role = params;

      return new Promise((resolve, reject) => {
        save(role)
          .then(res => {
            const { data } = res;
            if (role.id != data.role.id) {
              commit("set_total_rows", data.total_rows);
              commit("add_role", data.role);
            } else {
              commit("update_role", data.role);
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
            commit("del_role", data.id);
            commit("set_total_rows", data.total_rows);
            resolve();
          })
          .catch(error => {
            reject();
          });
      });
    }
  },
  getters: {
    roles: (state, getters, rootState) => {
      return state.roles;
    },
    total_rows: (state, getters, rootState) => {
      return state.total_rows;
    }
  }
};

export default role;
