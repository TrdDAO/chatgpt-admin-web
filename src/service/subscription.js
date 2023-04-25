import request from "@/utils/request";

export const getSubscriptions = (pagination) => {
	return request({
    url: `/api/admin/equity/subscriptions?page=${pagination.current||0}&size=${pagination.pageSize||20}`,
    method: "get",
  });
}

export const getSubscriptionDetail = (subscriptionId) => {
	return request({
    url: `/api/admin/equity/subscriptions/${subscriptionId}`,
    method: "get",
  });
}

export const addSubscription = (data) => {
	return request({
    url: `/api/admin/equity/subscriptions`,
    method: "post",
    data,
  });
}


export const editSubscription = (data, subscriptionId) => {
	return request({
    url: `/api/admin/equity/subscriptions/${subscriptionId}`,
    method: "put",
    data,
  });
}

export const grantSubscription = (subscriptionId, data) => {
	return request({
    url: `/api/admin/equity/subscriptions/${subscriptionId}/grant`,
    method: "put",
    data,
  });
}