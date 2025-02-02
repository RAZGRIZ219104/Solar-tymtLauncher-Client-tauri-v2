import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Box, Button, Divider, Stack } from "@mui/material";

import { useNotification } from "../../providers/NotificationProvider";
import SwitchComp from "../../components/SwitchComp";

import { AppDispatch } from "../../store";
import { selectChat } from "../../features/settings/ChatSlice";
import { getMyInfo } from "../../features/account/MyInfoSlice";

import { propsType, chatType, notificationType } from "../../types/settingTypes";
import { selectNotification, setNotification } from "../../features/settings/NotificationSlice";
import { IMyInfo } from "../../types/chatTypes";

import { updateUsernotificationStatus } from "../../features/chat/ContactListApi";

import backIcon from "../../assets/settings/back-icon.svg";
import arrowImg from "../../assets/settings/arrow-right.svg";

const ChatSettinginRoom = ({ view, setView }: propsType) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const chatStore: chatType = useSelector(selectChat);
  const notificationStore: notificationType = useSelector(selectNotification);
  const myInfoStore: IMyInfo = useSelector(getMyInfo);

  const { setNotificationStatus, setNotificationTitle, setNotificationDetail, setNotificationOpen, setNotificationLink } = useNotification();

  const putUserStatus = useCallback(async () => {
    try {
      await updateUsernotificationStatus(myInfoStore?._id, notificationStore.alert);
      dispatch(
        setNotification({
          ...notificationStore,
          alert: !notificationStore.alert,
        })
      );
    } catch (err) {
      console.error("Failed to putUserStatus: ", err);
    }
  }, [myInfoStore, notificationStore]);

  return (
    <>
      {view === "chatroom-chatsetting" && (
        <Stack direction={"column"}>
          <Stack flexDirection={"row"} justifyContent={"flex-start"} gap={"10px"} alignItems={"center"} textAlign={"center"} sx={{ padding: "20px" }}>
            <Button className={"setting-back-button"} onClick={() => setView("chatMainRoom")}>
              <Box component={"img"} src={backIcon}></Box>
            </Button>
            <Box className={"fs-h3 white"}>{t("set-18_chat-settings")}</Box>
          </Stack>
          <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
          <Stack direction={"column"} justifyContent={""}>
            <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"} padding={"20px"}>
              <Stack direction={"column"} justifyContent={"flex-start"} gap={1} textAlign={"left"}>
                <Box className={"fs-h5 white"}>{t("set-19_do-not-disturb")}</Box>
                <Box className={"fs-14-regular light"}>{t("set-20_disable-all-notifications")}</Box>
              </Stack>
              <Stack direction={"row"} justifyContent={"flex-end"} textAlign={"center"} gap={1}>
                <SwitchComp
                  checked={!notificationStore.alert}
                  onClick={() => {
                    putUserStatus();
                    setNotificationStatus("success");
                    setNotificationTitle(!notificationStore.alert ? t("cha-28_not-disturb-disabled") : t("cha-29_not-disturb-enabled"));
                    setNotificationDetail(!notificationStore.alert ? t("cha-30_disabled-not-disturb") : t("cha-31_switched-not-disturb"));
                    setNotificationOpen(true);
                    setNotificationLink(null);
                  }}
                />
              </Stack>
            </Stack>
            <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
            <Button
              className={"common-btn"}
              sx={{ padding: "20px" }}
              onClick={() => {
                setView("chatroom-message");
              }}
            >
              <Stack direction={"column"} gap={"10px"}>
                <Stack direction={"column"} justifyContent={"flex-start"} textAlign={"left"}>
                  <Box className={"fs-h5 white"}>{t("set-21_receive-messages")}</Box>
                  <Box className={"fs-14-regular light"}>{t("set-22_pick-who-message")}</Box>
                </Stack>
                <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"}>
                  <Box className={"fs-h4 white"}>
                    {chatStore.message == "anyone" && t("set-23_anyone")}
                    {chatStore.message == "noone" && t("set-26_no-one")}
                    {chatStore.message == "friend" && t("set-27_friends")}
                  </Box>
                  <Box className={"enter-align"}>
                    <img src={arrowImg} />
                  </Box>
                </Stack>
              </Stack>
            </Button>
            <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
            <Button
              className={"common-btn"}
              sx={{ padding: "20px" }}
              onClick={() => {
                setView("chatroom-friend");
              }}
            >
              <Stack direction={"column"} gap={"10px"}>
                <Stack direction={"column"} justifyContent={"flex-start"} gap={"5px"} textAlign={"left"}>
                  <Box className={"fs-h5 white"}>{t("set-24_receiving-friend-request")}</Box>
                  <Box className={"fs-14-regular light"}>{t("set-25_pick-who-friend")}</Box>
                </Stack>
                <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"}>
                  <Box className={"fs-h4 white"}>
                    {chatStore.friend == "anyone" && t("set-23_anyone")}
                    {chatStore.friend == "noone" && t("set-26_no-one")}
                  </Box>
                  <Box className={"center-align"}>
                    <img src={arrowImg} />
                  </Box>
                </Stack>
              </Stack>
            </Button>
            <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default ChatSettinginRoom;
