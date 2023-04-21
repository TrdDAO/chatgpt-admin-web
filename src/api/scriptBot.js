import request from "@/utils/request";

/**
 * 列表及分页数据
 * @returns 
 */
export const getScript = (pagination) => {
  return request({
    url: `/api/admin/bot/script-bots?page=${pagination.current||0}&size=${pagination.pageSize||20}`,
    method: "get",
  });
}

/**
 * 详情数据
 * @param {*} botId 
 * @returns 
 */
export const getScriptDetail = (botId)=> {
  return request({
    url: `/api/admin/bot/script-bots/${botId}`,
    method: "get",
  });
}

/**
 * 添加
 * @param {*} data 
 * @returns 
 */
export const addScript = (data) => {
  return request({
    url: `/api/admin/bot/script-bots`,
    method: "post",
		data,
  });
}

/**
 * 更新
 * @param {*} data 
 * @returns 
 */
export const editScript = (data, botId) => {
  return request({
    url: `/api/admin/bot/script-bots/${botId}`,
    method: "put",
		data,
  });
}


/**
 * 测试脚本
 * @param {} botId 
 * @returns 
 */
export const testScript = (botId) => {
	return request({
    url: `/api/admin/bot/script-bots/${botId}/test`,
    method: "get",
		timeout: 0,
  });
}
