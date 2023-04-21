import request from "@/utils/request";

export const loginReq = (data) => {
	return request({
    url: `/api/open/auth/phone`,
    method: "post",
		data,
  });
}