import request from "@/utils/request";

/**
 * 分页查询运行任务列表
 *  @param {*} pagination 分页及排序信息
 * @returns
 */
export const queryRunnerTasks = (pagination) => {
  return request({
    url: `/api/admin/bot/runner/tasks?page=${
      pagination.current ? pagination.current - 1 : 0
    }&size=${pagination.pageSize || 20}`,
    method: "get",
  });
};

/**
 * 分页查询运行任务订单列表
 * @param {} taskId 运行任务ID
 * @param {*} pagination 分页及排序信息
 * @returns
 */
export const queryRunnerTaskOrders = (taskId, pagination) => {
  return request({
    url: `/api/admin/bot/runner/tasks/${taskId}/orders?page=${
      pagination.current ? pagination.current - 1 : 0
    }&size=${pagination.pageSize || 20}`,
    method: "get",
  });
};

/**
 * 运行任务详情
 * @param {*} taskId 运行任务ID
 * @returns
 */
export const getRunnerTask = (taskId) => {
  return request({
    url: `/api/admin/bot/runner/tasks/${taskId}`,
    method: "get",
  });
};

/**
 * 创建运行任务
 * @param {*} data
 * @returns
 */
export const addRunnerTask = (data) => {
  return request({
    url: `/api/admin/bot/runner/tasks`,
    method: "post",
    data,
  });
};

/**
 * 更新运行任务
 * @param {*} data
 * @returns
 */
export const updateRunnerTask = (data, taskId) => {
  return request({
    url: `/api/admin/bot/runner/tasks/${taskId}`,
    method: "put",
    data,
  });
};

/**
 * 启动运行任务
 * @param {*} taskId 运行任务ID
 * @returns
 */
export const startRunnerTask = (taskId) => {
  return request({
    url: `/api/admin/bot/runner/tasks/${taskId}/start`,
    method: "put",
    data,
  });
};

/**
 * 取消运行任务
 * @param {*} taskId 运行任务ID
 * @returns
 */
export const cancelRunnerTask = (taskId) => {
  return request({
    url: `/api/admin/bot/runner/tasks/${taskId}/cancel`,
    method: "put",
    data,
  });
};
