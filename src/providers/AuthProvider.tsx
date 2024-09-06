import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

import GuestCompleteSnackbar from "../components/snackbars/GuestCompleteSnackbar";

import { getLogin } from "../features/account/LoginSlice";
import { getMyInfo } from "../features/account/MyInfoSlice";

import { ILogin } from "../types/accountTypes";
import { IMyInfo } from "../types/chatTypes";
import MoneyReceivedSnackbar from "../components/snackbars/MoneyReceivedSnackbar";

export const AuthProvider = () => {
  const navigate = useNavigate();

  const myInfoStore: IMyInfo = useSelector(getMyInfo);
  const loginStore: ILogin = useSelector(getLogin);

  useEffect(() => {
    if (!loginStore?.isLoggedIn) {
      navigate("/start");
    }
  }, [loginStore, myInfoStore]);

  return (
    <>
      <Outlet />
      <GuestCompleteSnackbar />
      <MoneyReceivedSnackbar />
    </>
  );
};
