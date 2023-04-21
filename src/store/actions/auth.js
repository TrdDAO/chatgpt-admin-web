import { setUserToken, resetUser } from "./user";
import { reqLogin, reqLogout } from "@/api/login";
import { setToken, removeToken } from "@/utils/auth";
import { loginReq } from '@/service/auth.js'
export const login = (username, password, phoneArea) => (dispatch) => {
  return new Promise((resolve, reject) => {
    loginReq({ phoneNumber: username.trim(), authCode: password, phoneArea })
      .then((response) => {
        const { token } = response;
        dispatch(setUserToken(token));
        setToken(token);
        resolve(token);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const logout = (token) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch(resetUser());
    removeToken();
    resolve(token);
  });
};
