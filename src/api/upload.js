import request from "../utils/request";
export function do_upload_zip(userfile) {
  let data = new FormData();
  data.append("userfile", userfile);
  let headers = {
    "Content-Type": "application/x-www-form-urlencoded"
  };
  return request({
    headers: headers,
    url: "/admin/upload/do_upload_zip",
    method: "post",
    data: data
  });
}
