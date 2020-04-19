import request from "../utils/request";
export function menu_list() {
    return request({
        url: "/admin/wechat/menu_list",
        method: "post",
        data: {}
    });
}
export function menu_save(menus) {
    return request({
        url: "/admin/wechat/menu_save",
        method: "post",
        data: menus
    });
}
export function menu_del(id) {
    return request({
        url: "/admin/wechat/menu_del",
        method: "post",
        data: {
            id: id
        }
    });
}
export function event_list(params) {
    return request({
        url: "/admin/wechat/event_list",
        method: "post",
        data: params
    })
}
export function event_save(event) {
    return request({
        url: "/admin/wechat/event_save",
        method: "post",
        data: event
    })
}

export function material_list(params) {
    return request({
        url: "/admin/wechat/material_list",
        method: "post",
        data: params
    })
}