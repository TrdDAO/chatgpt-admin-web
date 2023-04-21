import request from "@/utils/request";

/**
 * 分页查询回测任务列表
 *  @param {*} pagination 分页及排序信息
 * @returns
 */
export const queryBacktestTasks = (pagination) => {
  return request({
    url: `/api/admin/bot/backtest/tasks?page=${
      pagination.current ? pagination.current - 1 : 0
    }&size=${pagination.pageSize || 20}`,
    method: "get",
  });
};

/**
 * 分页查询回测任务订单列表
 * @param {} taskId 回测任务ID
 * @param {*} pagination 分页及排序信息
 * @returns
 */
export const queryBacktestTaskOrders = (taskId, pagination) => {
  return request({
    url: `/api/admin/bot/backtest/tasks/${taskId}/orders?page=${
      pagination.current ? pagination.current - 1 : 0
    }&size=${pagination.pageSize || 20}`,
    method: "get",
  });
};

/**
 * 回测任务详情
 * @param {*} taskId 回测任务ID
 * @returns
 */
export const getBacktestTask = (taskId) => {
  return request({
    url: `/api/admin/bot/backtest/tasks/${taskId}`,
    method: "get",
  });
};

/**
 * 创建回测任务
 * @param {*} data
 * @returns
 */
export const addBacktestTask = (data) => {
  return request({
    url: `/api/admin/bot/backtest/tasks`,
    method: "post",
    data,
  });
};

/**
 * 更新回测任务
 * @param {*} data
 * @returns
 */
export const updateBacktestTask = (data, taskId) => {
  return request({
    url: `/api/admin/bot/backtest/tasks/${taskId}`,
    method: "put",
    data,
  });
};

/**
 * 启动回测任务
 * @param {*} taskId 回测任务ID
 * @returns
 */
export const startBacktestTask = (taskId) => {
  return request({
    url: `/api/admin/bot/backtest/tasks/${taskId}/start`,
    method: "put",
    data,
  });
};

/**
 * 取消回测任务
 * @param {*} taskId 回测任务ID
 * @returns
 */
export const cancelBacktestTask = (taskId) => {
  return request({
    url: `/api/admin/bot/backtest/tasks/${taskId}/cancel`,
    method: "put",
    data,
  });
};
