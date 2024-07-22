import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Box, Button, Divider, Stack, Tooltip } from "@mui/material";

import { useNotification } from "../../providers/NotificationProvider";

import InputText from "../../components/account/InputText";
import GroupAvatar from "../../components/chat/GroupAvatar";

import { AppDispatch } from "../../store";
import { getCurrentChatroom, setCurrentChatroom } from "../../features/chat/CurrentChatroomSlice";
import { updateGroupAvatarAsync, updateGroupNameAsync } from "../../features/chat/ChatroomListSlice";

import SettingStyle from "../../styles/SettingStyle";
import backIcon from "../../assets/settings/back-icon.svg";
import editIcon from "../../assets/settings/edit-icon.svg";

import { propsType } from "../../types/settingTypes";
import { IChatroom, IReqChatroomUpdateGroupName } from "../../types/ChatroomAPITypes";

const ChatGroupEdit = ({ view, setView }: propsType) => {
  const classname = SettingStyle();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const currentChatroomStore: IChatroom = useSelector(getCurrentChatroom);
  const [groupName, setGroupName] = useState<string>("");

  const { setNotificationStatus, setNotificationTitle, setNotificationDetail, setNotificationOpen, setNotificationLink } = useNotification();

  const handleBrowseClick = () => {
    try {
      const fileInput = document.getElementById("file-input-group-avatar");
      if (fileInput) {
        fileInput.click();
      }
      console.log("handleBrowseClick");
    } catch (err) {
      console.error("Failed to handleBrowseClick: ", err);
    }
  };

  const uploadGroupAvatar = useCallback(() => {
    try {
      const fileInput = document.getElementById("file-input-group-avatar") as HTMLInputElement;
      const file = fileInput.files ? fileInput.files[0] : null;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("room_id", currentChatroomStore._id);
      dispatch(updateGroupAvatarAsync(formData)).then((action) => {
        if (action.type.endsWith("/fulfilled")) {
          const newCurrentChatroom = action.payload as IChatroom;
          dispatch(setCurrentChatroom(newCurrentChatroom));
          setNotificationStatus("success");
          setNotificationTitle(t("alt-32_avatar-saved"));
          setNotificationDetail(t("alt-33_avatar-saved-intro"));
          setNotificationOpen(true);
          setNotificationLink(null);
        }
      });
      console.log("uploadGroupAvatar", file, currentChatroomStore._id);
    } catch (err) {
      console.error("Failed to uploadGroupAvatar: ", err);
      setNotificationStatus("failed");
      setNotificationTitle(t("alt-34_avatar-notsaved"));
      setNotificationDetail(err.toString());
      setNotificationOpen(true);
      setNotificationLink(null);
    }
  }, [currentChatroomStore]);

  const handleSaveClick = useCallback(() => {
    try {
      const body: IReqChatroomUpdateGroupName = {
        room_id: currentChatroomStore._id,
        room_name: groupName,
      };
      dispatch(updateGroupNameAsync(body)).then((action) => {
        if (action.type.endsWith("/fulfilled")) {
          const newCurrentChatroom: IChatroom = action.payload as IChatroom;
          dispatch(setCurrentChatroom(newCurrentChatroom));
          setNotificationStatus("success");
          setNotificationTitle(t("cha-56_group-image-saved"));
          setNotificationDetail(t("cha-57_group-image-success"));
          setNotificationOpen(true);
          setNotificationLink(null);
        }
      });

      console.log("handleSaveClick", groupName, currentChatroomStore._id);
    } catch (err) {
      console.error("Failed to handleSaveClick:", err);
    }
  }, [groupName, currentChatroomStore]);

  useEffect(() => {
    if (view === "chatGroupEdit") {
      setGroupName(currentChatroomStore.room_name);
    }
  }, [view]);

  return (
    <>
      {view === "chatGroupEdit" && (
        <Stack direction={"column"}>
          <input type="file" id="file-input-group-avatar" onChange={uploadGroupAvatar} style={{ display: "none" }} />
          <Stack flexDirection={"row"} justifyContent={"flex-start"} gap={"10px"} alignItems={"center"} textAlign={"center"} sx={{ padding: "20px" }}>
            <Button className={"setting-back-button"} onClick={() => setView("chatGroupMemberList")}>
              <Box component={"img"} src={backIcon} />
            </Button>
            <Box className="fs-h3 white">{t("cha-54_edit-group")}</Box>
          </Stack>
          <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
          <Stack direction={"column"}>
            <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"} padding={"30px"}>
              <Stack direction={"row"} justifyContent={"center"} textAlign={"right"} alignItems={"center"} gap={"10px"}>
                <Box className="center-align">
                  <GroupAvatar size={92} url={currentChatroomStore.room_image} />
                </Box>
                <Box className="fs-h5 white">{t("set-68_change-avatar")}</Box>
              </Stack>
              <Box className="center-align">
                <Box sx={{ display: "flex" }} className="common-btn" onClick={handleBrowseClick}>
                  <Tooltip title={t("set-82_edit")} classes={{ tooltip: classname.tooltip }}>
                    <img src={editIcon} style={{ cursor: "pointer" }} />
                  </Tooltip>
                </Box>
              </Box>
            </Stack>
            <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
            <Stack direction={"column"} justifyContent={"flex-start"} textAlign={"center"} padding={"20px"}>
              <Box className="fs-h4 white">
                <InputText id="change-group-name" label={t("cha-55_change-group-name")} type="text" value={groupName} setValue={setGroupName} />
              </Box>
            </Stack>
            <Box padding={"20px"} width={"90%"} sx={{ position: "absolute", bottom: "30px" }}>
              <Button fullWidth className={classname.action_button} onClick={handleSaveClick}>
                {t("set-57_save")}
              </Button>
            </Box>
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default ChatGroupEdit;