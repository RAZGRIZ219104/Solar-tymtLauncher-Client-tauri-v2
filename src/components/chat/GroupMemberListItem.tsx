import { useSelector } from "react-redux";

import { Box, Grid, Stack } from "@mui/material";

import Avatar from "../home/Avatar";
import MemberRemoveButton from "./MemberRemoveButton";
import MemberInviteButton from "./MemberInviteButton";

import { ICurrentChatroomMember } from "../../features/chat/CurrentChatroomMembersSlice";
import { IActiveUserList, getActiveUserList } from "../../features/chat/ActiveUserListSlice";
import { getCurrentChatroom } from "../../features/chat/CurrentChatroomSlice";
import { getMyInfo } from "../../features/account/MyInfoSlice";

import { IMyInfo } from "../../types/chatTypes";
import { IChatroom } from "../../types/ChatroomAPITypes";

export interface IPropsGroupMemberListItem {
  member: ICurrentChatroomMember;
  index: number;
  invited: boolean;
}

const GroupMemberListItem = ({ member, index, invited }: IPropsGroupMemberListItem) => {
  const activeUserListStore: IActiveUserList = useSelector(getActiveUserList);
  const myInfoStore: IMyInfo = useSelector(getMyInfo);
  const currentChatroomStore: IChatroom = useSelector(getCurrentChatroom);

  return (
    <Box key={`${index}-${new Date().toISOString()}`}>
      <Grid
        item
        xs={12}
        container
        sx={{
          overflowX: "hidden",
          height: "64px",
          flexDirection: "row",
          justifyContent: "left",
          alignItems: "center",
          padding: "12px 5px 12px 5px",
          cursor: "pointer",
          "&:hover": {
            borderRadius: "5px",
            borderTopRightRadius: "0",
            borderBottomRightRadius: "0",
            backgroundColor: "#FFFFFF1A",
          },
          "&:active": {
            backgroundColor: "#52E1F21A",
          },
        }}
      >
        <Avatar onlineStatus={activeUserListStore.users.some((user) => user === member._id)} url={member.avatar} size={40} status={member.notificationStatus} />
        <Stack flexDirection={"row"} alignItems={"center"} justifyContent={"space-between"} display={"flex"} sx={{ marginLeft: "25px", width: "320px" }}>
          <Box>
            <Stack direction={"column"} justifyContent={"flex-start"} spacing={1}>
              <Box className={"fs-16 white"}>{member.nickName}</Box>
              <Box className={"fs-12-light gray"}>{member.sxpAddress}</Box>
            </Stack>
          </Box>

          {invited && myInfoStore?._id !== member._id && !(!myInfoStore?.isAdmin && !currentChatroomStore?.isPrivate) && <MemberRemoveButton member={member} />}
          {!invited && myInfoStore?._id !== member._id && !(!myInfoStore?.isAdmin && !currentChatroomStore?.isPrivate) && (
            <MemberInviteButton member={member} />
          )}
          {/* <Box
            className={"unread-dot fs-10-light"}
            sx={{
              display: numberOfUnreadMessages > 0 ? "block" : "none",
            }}
          >
            {numberOfUnreadMessages}
          </Box> */}
        </Stack>
      </Grid>
    </Box>
  );
};

export default GroupMemberListItem;
