import request from "../utils/request";
export function list(page = "", size = "", name = "") {
  return request({
    url: "/admin/activity/list",
    method: "post",
    data: {
      page: page,
      size: size,
      name: name
    }
  });
}
export function save(user) {
  return request({
    url: "/admin/activity/save",
    method: "post",
    data: user
  });
}
export function del(id) {
  return request({
    url: "/admin/activity/del",
    method: "post",
    data: {
      id: id
    }
  });
}

export function batchDel(ids) {
  return request({
    url: "/admin/activity/batch_del",
    method: "post",
    data: ids
  });
}
