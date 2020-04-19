import request from "../utils/request";
export function list(page = "", size = "", name = "") {
  return request({
    url: "/admin/log/list",
    method: "post",
    data: {
      page: page,
      size: size,
      name: name
    }
  });
}
