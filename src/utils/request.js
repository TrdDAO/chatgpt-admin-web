import axios from "axios";
import store from "@/store";
import { Modal, message } from "antd";
import { getToken } from "@/utils/auth";
import { logout } from "@/store/actions";

//创建一个axios示例
const service = axios.create({
  baseURL: '//', // api 的 base_url
  timeout: 0, // request timeout
  withCredentials: true,
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    if (store.getState().user.token) {
      // 让每个请求携带token-- ['Authorization']为自定义key 请根据实际情况自行修改
      config.headers.Authorization = getToken();
    }
    return config;
  },
  (error) => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(

  // 2xx 范围内的状态码触发
  (response) => {
    // data里有数据
    if(response.data) {
      const { code, data, msg } = response.data;
      // 业务返回的状态码
      if(code !== '200') {
        return Promise.reject(msg);
      }
      // 业务数据
      return Promise.resolve(data);
    }
    return Promise.resolve(response.data)
  },
  // 超出 2xx 范围的状态码
  (error) => {
    console.error('error:' + error);
    // 网络问题直接抛异常
    if(error.code === "ERR_NETWORK") {
      message.error('网络异常');
      return Promise.reject(error);
    }
    // 有状态码响应的异常
    const { status, data } = error.response;
    if (status === 401) {
      Modal.confirm({
        title: "确定登出?",
        content:
          "由于长时间未操作，您已被登出，可以取消继续留在该页面，或者重新登录",
        okText: "重新登录",
        cancelText: "取消",
        onOk() {
          let token = store.getState().user.token;
          store.dispatch(logout(token));
        },
        onCancel() {
          console.log("Cancel");
        },
      });
      return Promise.reject(error);
    }
    // 业务逻辑有报错抛出提示
    if(data && data.msg) {
      return Promise.reject(data.msg);
    }
    // 默认整个异常抛出
    return Promise.reject(error);
  }
);

export default service;
