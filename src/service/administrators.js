import request from "@/utils/request";

export const getAdministrators = (pagination) => {
	return request({
    url: `/api/admin/administrators?page=${pagination.current||0}&size=${pagination.pageSize||20}`,
    method: "get",
  });
}

export const getAdministratorDetail = (administratorId) => {
	return request({
    url: `/api/admin/administrators/${administratorId}`,
    method: "get",
  });
}

export const addAdministrator = (data) => {
	return request({
    url: `/api/admin/administrators`,
    method: "post",
    data,
  });
}

export const editAdministrator = (data, administratorId) => {
	return request({
    url: `/api/admin/administrators/${administratorId}`,
    method: "put",
    data,
  });
}

export const deleteAdministrator = (administratorId) => {
	return request({
    url: `/api/admin/administrators/${administratorId}`,
    method: "delete",
  });
}


export const setAdministratorDisable = (administratorId) => {
	return request({
    url: `/api/admin/administrators/${administratorId}/disable`,
    method: "put",
  });
}

export const setAdministratorEnable = (administratorId) => {
	return request({
    url: `/api/admin/administrators/${administratorId}/enable`,
    method: "put",
  });
}

export const resetPassword= (administratorId) => {
	return request({
    url: `/api/admin/administrators/${administratorId}/reset-password`,
    method: "put",
  });
}