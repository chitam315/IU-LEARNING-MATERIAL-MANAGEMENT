import axios from "axios";
import { api, AUTHENTICATION_API } from "../config/api";
import { getToken } from '../utils/token.js'

export const authService = {
  login(data) {
    const user = {
      username: data.username,
      password: data.password,
    };
    return api.post(`${AUTHENTICATION_API}/login`, user);
  },
  register(data) {

    return api.post(`${AUTHENTICATION_API}/register`, data);
  },
  forgetPassword(data) {
    return api.post(`${AUTHENTICATION_API}/send-email`, data)
  },
  updatePersonalInformation(data) {
    return api.put(`${AUTHENTICATION_API}/update-personal`, data)
  },
  getNewAccessToken(data) {
    return axios.post(`${AUTHENTICATION_API}/token`, {}, {
      headers: {
        Authorization: `Bearer ${data.refreshToken}`
      }
    })
  },
  getAllUser() {
    return api.get(`${AUTHENTICATION_API}/all-users`)
  },
  getAllUserId(){
    return api.get(`${AUTHENTICATION_API}/all-user-id`)
  },
  getAllTeacher(){
    return api.get(`${AUTHENTICATION_API}/all-teachers`)
  },
  updateUserInformation(data){
    const user = {
      username: data.username,
      fullName: data.fullName,
      email: data.email,
      role: data.role,
    }
    return api.put(`${AUTHENTICATION_API}/update-information`,user)
  },
  deleteUser(data){
    return api.delete(`${AUTHENTICATION_API}/delete-user/${data.username}`)
  },
  changePassword(data){
    return api.post(`${AUTHENTICATION_API}/update-password`,data)
  },
  changePasswordWithCode(data){
    return api.post(`${AUTHENTICATION_API}/change-password-with-code`,data)
  }
};
