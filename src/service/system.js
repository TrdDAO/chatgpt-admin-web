import request from "@/utils/request";

export const getSystemProfile = () => {
	return request({
    url: `/api/admin/system/profile`,
    method: "get",
  });
}

export const updateSystemProfile = (data) => {
	return request({
    url: `/api/admin/system/profile`,
    method: "put",
		data,
  });
}