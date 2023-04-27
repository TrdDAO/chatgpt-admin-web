import request from "@/utils/request";

export const loginReq = (data) => {
	return request({
    url: `/api/open/auth/phone`,
    method: "post",
		data,
  });
}

export const loginByPsd = (data) => {
	return request({
    url: `/api/open/auth/password`,
    method: "post",
		data,
  });
}