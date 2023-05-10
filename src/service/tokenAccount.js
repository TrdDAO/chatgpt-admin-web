import request from "@/utils/request";

export const getTokenAccounts = (pagination) => {
	return request({
    url: `/api/admin/token-accounts?page=${pagination.current||0}&size=${pagination.pageSize||20}`,
    method: "get",
  });
}

export const getTokenAccountDetail = (accountId) => {
	return request({
    url: `/api/admin/token-accounts/${accountId}`,
    method: "get",
  });
}