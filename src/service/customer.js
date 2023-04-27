import request from "@/utils/request";

export const getCustomers = (pagination) => {
	return request({
    url: `/api/admin/customers?page=${pagination.current||0}&size=${pagination.pageSize||20}`,
    method: "get",
  });
}

export const getCustomerDetail = (customerId) => {
	return request({
    url: `/api/admin/customers/${customerId}`,
    method: "get",
  });
}

export const addCustomer = (data) => {
	return request({
    url: `/api/admin/customers`,
    method: "post",
    data,
  });
}

export const editCustomer = (data, customerId) => {
	return request({
    url: `/api/admin/customers/${customerId}`,
    method: "put",
    data,
  });
}

export const deleteCustomer = (customerId) => {
	return request({
    url: `/api/admin/customers/${customerId}`,
    method: "delete",
  });
}

export const setCustomerDisable = (customerId) => {
	return request({
    url: `/api/admin/customers/${customerId}/disable`,
    method: "put",
  });
}

export const setCustomerEnable = (customerId) => {
	return request({
    url: `/api/admin/customers/${customerId}/enable`,
    method: "put",
  });
}

export const resetPassword= (customerId) => {
	return request({
    url: `/api/admin/customers/${customerId}/reset-password`,
    method: "put",
  });
}