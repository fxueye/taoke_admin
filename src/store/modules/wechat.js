import { menu_list, menu_save, event_list, event_save, material_list } from "@/api/wechat";
const wechat = {
    namespaced: true,
    state: {
        id: 1,
        events: [],
        total_events_rows: 0,
        menus: [],
        currentMenu: null,
        currentMenuIndex: null,
        materialPerPage: 20,
        news: {
            page: 1,
            items: [],
            bottom: false,
            total: 0,
        },
        image: {
            page: 1,
            items: [],
            bottom: false,
            total: 0,
        },

        voice: {
            page: 1,
            items: [],
            bottom: false,
            total: 0,
        },

        video: {
            page: 1,
            items: [],
            bottom: false,
            total: 0,
        },
    },
    mutations: {
        set_id: (state, id) => {
            state.id = id;
        },
        set_menus: (state, menus) => {
            state.menus = menus;
        },
        set_current_menu: (state, menu) => {
            state.currentMenu = menu;
        },
        set_current_menu_index: (state, index) => {
            state.currentMenuIndex = index;
        },
        set_events: (state, events) => {
            state.events = events;
        },
        set_total_events_rows: (state, total_rows) => {
            state.total_events_rows = total_rows;
        },
        update_event: (state, event) => {
            state.events = state.events.map(item => {
                return item.id == event.id ? event : item;
            });
        },
        add_event: (state, event) => {
            state.events.push(event);
        },
        set_news: (state, data, page) => {
            state.news.items = data.items;
            state.news.page = page;
            state.news.total = data.total_count;
        },
        set_image: (state, data, page) => {
            state.image.items = data.item;
            state.image.page = page;
            state.image.total = data.total_count;
        },
        set_voice: (state, data, page) => {
            state.voice.items = data.item;
            state.voice.page = page;
            state.voice.total = data.total_count;
        }
        ,
        set_video: (state, data, page) => {
            state.video.items = data.item;
            state.video.page = page;
            state.video.total = data.total_count;
        }

    },
    actions: {
        menuList({ commit }) {
            return new Promise((resolve, reject) => {
                menu_list()
                    .then(res => {
                        console.log(res);
                        const { data } = res;
                        let addId = function (menus, id = 1) {
                            menus.forEach(item => {
                                item.id = id++;
                                id = addId(item.sub_button, id);
                            });
                            return id;
                        }
                        let id = addId(data.menus, 1);
                        commit('set_id', id)
                        commit('set_menus', data.menus);
                        resolve();
                    })
                    .catch(error => {
                        reject();
                    });
            });
        },
        menuSave({ state }) {
            return new Promise((resolve, reject) => {
                menu_save(state.menus)
                    .then(res => {
                        resolve();
                    })
                    .catch(error => {
                        reject();
                    });
            });
        },
        eventList({ commit }, params) {
            const query = params;
            return new Promise((resolve, reject) => {
                event_list(query).then(res => {
                    const { data } = res;
                    commit("set_total_events_rows", data.total_rows);
                    commit('set_events', data.events);
                    resolve();
                }).catch(err => {
                    reject();
                })
            })
        },
        eventSave({ commit }, params) {
            const event = params;
            return new Promise((resolve, reject) => {
                event_save(event).then(res => {
                    const { data } = res;
                    if (event.id != data.event.id && event.type == data.event.type) {
                        commit("set_total_events_rows", data.total_rows);
                        commit("add_event", data.event);
                    } else {
                        commit("update_event", data.event);
                    }
                    resolve();
                }).catch(err => {
                    reject();
                })
            });
        },
        materialList({ commit }, params) {
            const p = params;
            return new Promise((resolve, reject) => {
                material_list(p).then(res => {
                    const { data } = res;
                    if (data.type == 'news') {
                        commit('set_news', data.material, data.page);
                    } else if (data.type == 'image') {
                        commit('set_image', data.material, data.page);
                    } else if (data.type == 'voice') {
                        commit('set_voice', data.material, data.page);
                    } else if (data.type == 'video') {
                        commit('set_video', data.material, data.page);
                    }
                }).catch(err => {
                    reject();
                })
            })
        }


    },
    getters: {
        id: (state, getters, rootState) => {
            return state.id;
        },
        menus: (state, getters, rootState) => {
            return state.menus;
        },
        totalEventsRows: (state, getters, rootState) => {
            return state.total_events_rows;
        },
        events: (state, getters, rootState) => {
            return state.events;
        },
        currentMenu: (state, getters, rootState) => {
            return state.currentMenu;
        },
        currentMenuIndex: (state, getters, rootState) => {
            return state.currentMenuIndex;
        },
        news: (state, getters, rootState) => {
            return state.news;
        },
        image: (state, getters, rootState) => {
            return state.image;
        },
        voice: (state, getters, rootState) => {
            return state.voice;
        },
        video: (state, getters, rootState) => {
            return state.video;
        }

    }
};

export default wechat;
