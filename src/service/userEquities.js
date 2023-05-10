import request from "@/utils/request";

export const getuserEquities = (pagination) => {
	return request({
    url: `/api/admin/equity/user-equities?page=${pagination.current||0}&size=${pagination.pageSize||20}`,
    method: "get",
  });
}

export const getuserEquitieDetail = (userEquityId) => {
	return request({
    url: `/api/admin/equity/user-equities/${userEquityId}`,
    method: "get",
  });
}

export const removeUserEquity = (userEquityId) => {
  return request({
    url: `/api/admin/equity/user-equities/${userEquityId}`,
    method: "delete",
  });
}

export const renewalUserEquity = (userEquityId, quantity) => {
  return request({
    url: `/api/admin/equity/user-equities/${userEquityId}/renewal`,
    method: "put",
    data: { renewalQty: quantity },
  });
}