import { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import ExportChatModal from "./ExportChatModal";

import { Modal, Box, Fade } from "@mui/material";

import { useSocket } from "../../providers/SocketProvider";

import { AppDispatch } from "../../store";
import { leaveGroupAsync, removeChatroomAsync } from "../../features/chat/ChatroomListSlice";
import { delOneSkeyList } from "../../features/chat/SKeyListSlice";
import { createMutedListAsync, deleteMutedListAsync, getMutedList } from "../../features/chat/MutedListSlice";

import { ISocketParamsLeaveMessageGroup, ISocketParamsSyncEvents } from "../../types/SocketTypes";
import { IChatroom, IChatroomList, IParamsLeaveGroup } from "../../types/ChatroomAPITypes";
import { IPoint } from "../../types/homeTypes";
import { IReqCreateMutedList, IReqDeleteMutedList } from "../../types/UserAPITypes";
import { IMyInfo } from "../../types/chatTypes";
import { getMyInfo } from "../../features/account/MyInfoSlice";
import { SyncEventNames } from "../../consts/SyncEventNames";

export interface IPropsGroupListItemContextMenu {
  view: boolean;
  setView: (_: boolean) => void;
  group: IChatroom;
  contextMenuPosition: IPoint;
}

const GroupListItemContextMenu = ({ view, setView, group, contextMenuPosition }: IPropsGroupListItemContextMenu) => {
  const { socket } = useSocket();

  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const mutedListStore: IChatroomList = useSelector(getMutedList);
  const myInfoStore: IMyInfo = useSelector(getMyInfo);

  const [openExportModal, setOpenExportModal] = useState<boolean>(false);

  const isMuted = useMemo(() => mutedListStore.chatrooms.some((chatroom) => chatroom._id === group._id), [mutedListStore]);

  const handleMuteClick = () => {
    try {
      const body: IReqCreateMutedList = {
        muted: group._id,
      };
      dispatch(createMutedListAsync(body)).then(() => {
        setView(false);
      });
      console.log("handleMuteClick", group);
    } catch (err) {
      console.error("Failed to handleMuteClick: ", err);
    }
  };

  const handleUnmuteClick = () => {
    try {
      const body: IReqDeleteMutedList = {
        muted: group._id,
      };
      dispatch(deleteMutedListAsync(body)).then(() => {
        setView(false);
      });
      console.log("handleUnmuteClick", group);
    } catch (err) {
      console.error("Failed to handleUnmuteClick: ", err);
    }
  };

  const handleLeaveGroupClick = useCallback(async () => {
    try {
      const data: IParamsLeaveGroup = {
        _groupId: group._id,
        _userId: myInfoStore?._id,
      };
      dispatch(leaveGroupAsync(data)).then(() => {
        dispatch(delOneSkeyList(group._id));

        if (socket.current && socket.current.connected) {
          const data: ISocketParamsLeaveMessageGroup = {
            room_id: group._id,
            joined_user_id: myInfoStore?._id,
          };
          socket.current.emit("leave-message-group", JSON.stringify(data));
          console.log("socket.current.emit > leave-message-group", data);
        }
      });

      console.log("handleLeaveGroupClick", group);
      setView(false);
    } catch (err) {
      console.error("Failed to handleLeaveGroupClick: ", err);
    }
  }, [myInfoStore, socket.current]);

  const handleRemoveGroupClick = useCallback(async () => {
    try {
      console.log("handleRemoveGroupClick");

      await dispatch(removeChatroomAsync(group._id));

      if (socket.current && socket.current.connected) {
        const memberIds = group.participants.map((participant) => participant.userId);
        const data_1: ISocketParamsSyncEvents = {
          sender_id: myInfoStore?._id,
          recipient_ids: memberIds,
          instructions: [SyncEventNames.UPDATE_CHATROOM_LIST],
          is_to_self: true,
        };
        socket.current.emit("sync-events", JSON.stringify(data_1));
        console.log("socket.current.emit > sync-events", data_1);
      }
    } catch (err) {
      console.error("Failed to handleRemoveGroupClick: ", err);
    }
  }, [socket.current, myInfoStore]);

  const handleExportClick = () => {
    setView(false);
    setOpenExportModal(true);
  };

  const handleOnClose = () => {
    setView(false);
  };

  return (
    <>
      <Modal open={view} onClose={handleOnClose}>
        <Fade in={view}>
          <Box
            sx={{
              position: "fixed",
              top: contextMenuPosition.y,
              left: contextMenuPosition.x,
              display: "block",
              flexDirection: "column",
              alignItems: "flex-start",
              cursor: "pointer",
              zIndex: 1000,
            }}
          >
            {isMuted ? (
              <Box className={"fs-16 white context_menu_up"} textAlign={"left"} sx={{ backdropFilter: "blur(10px)" }} onClick={handleUnmuteClick}>
                {t("cha-59_unmute")}
              </Box>
            ) : (
              <Box className={"fs-16 white context_menu_up"} textAlign={"left"} sx={{ backdropFilter: "blur(10px)" }} onClick={handleMuteClick}>
                {t("cha-58_mute")}
              </Box>
            )}
            <Box className={"fs-16 white context_menu_middle"} textAlign={"left"} sx={{ backdropFilter: "blur(10px)" }} onClick={handleExportClick}>
              {t("cha-60_export")}
            </Box>
            {myInfoStore.isAdmin && !group.isPrivate ? (
              <Box className={"fs-16 white context_menu_bottom"} textAlign={"left"} sx={{ backdropFilter: "blur(10px)" }} onClick={handleRemoveGroupClick}>
                {t("cha-64_remove-group")}
              </Box>
            ) : (
              <Box className={"fs-16 white context_menu_bottom"} textAlign={"left"} sx={{ backdropFilter: "blur(10px)" }} onClick={handleLeaveGroupClick}>
                {t("cha-51_leave-group")}
              </Box>
            )}
          </Box>
        </Fade>
      </Modal>
      <ExportChatModal view={openExportModal} setView={setOpenExportModal} group={group} />
    </>
  );
};

export default GroupListItemContextMenu;
