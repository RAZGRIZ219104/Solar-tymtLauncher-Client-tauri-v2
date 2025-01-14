import axios from "axios";
import { tymt_backend_url } from "../../configs";
import { ISaltToken } from "../../types/accountTypes";
import tymtStorage from "../../lib/Storage";
import { IAlertList, IFetchAlertListParam, IUpdateFriendRequest } from "../../types/alertTypes";
import { IReqReadMultipleAlerts } from "../../types/AlertAPITypes";
import AlertAPI from "../../lib/api/AlertAPI";

export const fetchUnreadAlertList = async ({ userId, page, limit }: IFetchAlertListParam) => {
  try {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    const res = await axios.get(`${tymt_backend_url}/alerts/alerts-unread-for-user/${userId}?page=${page}&limit=${limit}`, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
    if (res?.status === 200) {
      console.log("fetchUnreadAlertList");
      return {
        unread: res?.data?.unreadAlerts ?? [],
        unreadCount: res?.data?.unreadCount ?? 0,
      };
    } else {
      console.log("fetchUnreadAlertList", res?.status);
      return {
        unread: [],
        unreadCount: 0,
      };
    }
  } catch (err) {
    console.log("Failed to fetchUnreadAlertList: ", err);
    return {
      unread: [],
      unreadCount: 0,
    };
  }
};

export const fetchReadAlertList = async ({ userId, page, limit }: IFetchAlertListParam) => {
  try {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    const res = await axios.get(`${tymt_backend_url}/alerts/alerts-read-for-user/${userId}?page=${page}&limit=${limit}`, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
    if (res?.status === 200) {
      console.log("fetchReadAlertList");
      return {
        read: res?.data?.readAlerts ?? [],
        readCount: res?.data?.readCount ?? 0,
      };
    } else {
      console.log("fetchReadAlertList res.status !== 200");
      return {
        read: [],
        readCount: 0,
      };
    }
  } catch (err) {
    console.error("Failed to fetchReadAlertList: ", err);
    return {
      read: [],
      readCount: 0,
    };
  }
};

export const fetchAlertList = async (userId: string) => {
  try {
    const param: IFetchAlertListParam = {
      userId: userId,
      page: 1,
      limit: 20,
    };
    const res = await Promise.all([fetchUnreadAlertList(param), fetchReadAlertList(param)]);
    const res1: IAlertList = {
      unread: res[0]?.unread,
      unreadCount: res[0]?.unreadCount,
      read: res[1]?.read,
      readCount: res[1]?.readCount,
    };
    console.log("fetchAlertList");
    return res1;
  } catch (err) {
    console.error("Failed to getAlertList: ", err);
    return {
      read: [],
      readCount: 0,
      unread: [],
      unreadCount: 0,
    };
  }
};

export const fetchCountUnreadAlertList = async (userid: string) => {
  try {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    const res = await axios.get(`${tymt_backend_url}/alerts/alerts-count-unread-for-user/${userid}`, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
    if (res?.status === 200) {
      console.log("fetchCountUnreadAlertList");
      return res?.data?.count;
    } else {
      console.log("fetchCountUnreadAlertList res.status !== 200");
      return 0;
    }
  } catch (err) {
    console.error("Failed to fetchCountUnreadAlertList: ", err);
    return 0;
  }
};

interface updateAlertReadStatusPayload {
  alertId: string;
  userId: string;
}
export const updateAlertReadStatus = async (payload: updateAlertReadStatusPayload) => {
  try {
    const { alertId, userId } = payload;
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    const res = await axios.put(
      `${tymt_backend_url}/alerts/add-reader/${alertId}`,
      {
        reader: `${userId}`,
      },
      {
        headers: {
          "x-token": saltTokenStore.token,
          "Content-Type": "application/json",
        },
      }
    );
    if (res?.status === 200) {
      console.log("updateAlertReadstatus");
      return res?.data?.result;
    } else {
      console.log("updateAlertReadstatus res.status !== 200");
      return null;
    }
  } catch (err) {
    console.error("Failed to updateAlertReadstatus: ", err);
    return null;
  }
};

export const updateAllAlertReadStatus = async () => {
  try {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    const res = await axios.put(
      `${tymt_backend_url}/alerts/all-alerts-unread`,
      {},
      {
        headers: {
          "x-token": saltTokenStore.token,
          "Content-Type": "application/json",
        },
      }
    );
    if (res?.status === 200 && res?.data?.msg === "All unread alerts are successfully read") {
      console.log("updateAllAlertReadStatus");
      return true;
    } else {
      console.log("updateAllAlertReadStatus res.status !== 200");
      return false;
    }
  } catch (err) {
    console.error("Failed to updateAllAlertReadStatus: ", err);
    return false;
  }
};

export const updateFriendRequest = async ({ alertId, status }: IUpdateFriendRequest) => {
  try {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    const res = await axios.put(
      `${tymt_backend_url}/alerts/updateFriendRequest/${alertId}`,
      {
        status: status,
      },
      {
        headers: {
          "x-token": saltTokenStore.token,
          "Content-Type": "application/json",
        },
      }
    );
    if (res?.status === 200) {
      console.log("updateFriendRequest");
      return res?.data?.result;
    } else {
      console.log("updateFriendRequest: ", res?.status);
      return null;
    }
  } catch (err) {
    console.error("Failed to updateFriendRequest: ", err);
    return null;
  }
};

export const readMultipleAlerts = async (body: IReqReadMultipleAlerts) => {
  try {
    const res = await AlertAPI.readMultipleAlerts(body);
    if (!res || res.status !== 200) {
      console.error("Failed to readMultipleAlerts: response undefined! ", res);
      return null;
    }
    console.log("readMultipleAlerts", res);
    return null;
  } catch (err) {
    console.error("Failed to readMultipleAlerts: ", err);
    return null;
  }
};
