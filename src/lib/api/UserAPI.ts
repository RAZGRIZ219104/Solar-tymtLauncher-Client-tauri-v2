import axios from "axios";
import { tymt_backend_url } from "../../configs/index";
import tymtStorage from "../Storage";
import { IReqCreateMutedList, IReqDeleteMutedList, IReqUpdateUser } from "../../types/UserAPITypes";
import { ISaltToken } from "../../types/accountTypes";

class UserAPI {
  static async getUserById(id: string) {
    return await axios.get(`${tymt_backend_url}/users/${id}`);
  }

  static async getUsersByRoles(body: string[]) {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    return await axios.post(`${tymt_backend_url}/users/by-roles`, body, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
  }

  static async createMutedList(body: IReqCreateMutedList) {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    return await axios.post(`${tymt_backend_url}/users/muted`, body, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
  }

  static async deleteMutedList(body: IReqDeleteMutedList) {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    return await axios.delete(`${tymt_backend_url}/users/muted`, {
      data: body,
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
  }

  static async fetchMutedList() {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    return await axios.get(`${tymt_backend_url}/users/muted/list`, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
  }

  static async fetchAvatar(user_id: string) {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    return await axios.get(`${tymt_backend_url}/users/get-avatar/${user_id}`, {
      headers: {
        "x-token": saltTokenStore.token,
        "Cache-Control": "no-cache",
      },
      responseType: "blob",
    });
  }

  static async updateUser(userId: string, body: IReqUpdateUser) {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    return await axios.put(`${tymt_backend_url}/users/${userId}`, body, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
  }
}

export default UserAPI;
