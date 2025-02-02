import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { compareJSONStructure } from "../../lib/helper/JSONHelper";
import { IChatroomList } from "../../types/ChatroomAPITypes";
import {
  createDM,
  createGroup,
  fetchChatroomList,
  addParticipant,
  removeParticipant,
  joinPublicGroup,
  leaveGroup,
  addOneToChatroomList,
  updateGroupAvatar,
  updateGroupName,
  removeChatroom,
} from "./ChatroomListApi";

const init: IChatroomList = {
  chatrooms: [],
};

const loadChatroomList: () => IChatroomList = () => {
  const data = tymtStorage.get(`chatroomList`);
  if (!data || !compareJSONStructure(JSON.parse(data), init)) {
    tymtStorage.set(`chatroomList`, JSON.stringify(init));
    return init;
  } else {
    return JSON.parse(data);
  }
};

const initialState = {
  data: loadChatroomList(),
  status: "chatroomList",
  msg: "",
};

export const fetchChatroomListAsync = createAsyncThunk("chatroomList/fetchChatroomListAsync", fetchChatroomList);
export const addOneToChatroomListAsync = createAsyncThunk("chatroomList/addOneToChatroomListAsync", addOneToChatroomList);
export const createGroupAsync = createAsyncThunk("chatroomList/createGroupAsync", createGroup);
export const createDMAsync = createAsyncThunk("chatroomList/createDMAsync", createDM);
export const addParticipantAsync = createAsyncThunk("chatroomList/addParticipantAsync", addParticipant);
export const removeParticipantAsync = createAsyncThunk("chatroomList/removeParticipantAsync", removeParticipant);
export const joinPublicGroupAsync = createAsyncThunk("chatroomList/joinPublicGroupAsync", joinPublicGroup);
export const leaveGroupAsync = createAsyncThunk("chatroomList/leaveGroupAsync", leaveGroup);
export const updateGroupAvatarAsync = createAsyncThunk("chatroomList/updateGroupAvatarAsync", updateGroupAvatar);
export const updateGroupNameAsync = createAsyncThunk("chatroomList/updateGrounNameAsync", updateGroupName);
export const removeChatroomAsync = createAsyncThunk("chatroomList/removeChatroomAsync", removeChatroom);

export const chatroomListSlice = createSlice({
  name: "chatroomList",
  initialState,
  reducers: {
    setChatroomList: (state, action) => {
      state.data = action.payload;
      tymtStorage.set(`chatroomList`, JSON.stringify(state.data));
      console.log("setChatroomList", state.data);
    },
    delOneFromChatroomList: (state, action) => {
      const restOfChatrooms = state.data.chatrooms.filter((element) => element._id !== action.payload);
      state.data.chatrooms = [...restOfChatrooms];
      tymtStorage.set(`chatroomList`, JSON.stringify(state.data));
      console.log("delOneFromChatroomList", action.payload, state.data);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchChatroomListAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchChatroomListAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          console.error("Failed to fetchGroupListAsync: ", action.payload);
          return;
        }
        state.data.chatrooms = action.payload;
        tymtStorage.set(`chatroomList`, JSON.stringify(state.data));
        state.status = "chatroomList";
      })
      .addCase(addOneToChatroomListAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(addOneToChatroomListAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          console.error("Failed to addOneToChatroomListAsync: ", action.payload);
          return;
        }
        const restOfChatrooms = state.data.chatrooms.filter((element) => element._id !== action.payload?._id);
        state.data.chatrooms = [...restOfChatrooms, action.payload];
        tymtStorage.set(`chatroomList`, JSON.stringify(state.data));
        state.status = "chatroomList";
      })
      .addCase(createGroupAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(createGroupAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          console.error("Failed to createGroupAsync: ", action.payload);
          return;
        }
        state.data.chatrooms = [...state.data.chatrooms, action.payload];
        tymtStorage.set(`chatroomList`, JSON.stringify(state.data));
        state.status = "chatroomList";
      })
      .addCase(createDMAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(createDMAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          console.error("Failed to createDMAsync: ", action.payload);
          return;
        }
        state.data.chatrooms = [...state.data.chatrooms, action.payload];
        tymtStorage.set(`chatroomList`, JSON.stringify(state.data));
        state.status = "chatroomList";
      })
      .addCase(addParticipantAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(addParticipantAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          console.error("Failed to addParticipantAsync: ", action.payload);
          return;
        }
        const restOfChatrooms = state.data.chatrooms.filter((element) => element._id !== action.payload?._id);
        state.data.chatrooms = [...restOfChatrooms, action.payload];
        tymtStorage.set(`chatroomList`, JSON.stringify(state.data));
        state.status = "chatroomList";
      })
      .addCase(removeParticipantAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(removeParticipantAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          console.error("Failed to removeParticipantAsync: ", action.payload);
          return;
        }
        const restOfChatrooms = state.data.chatrooms.filter((element) => element._id !== action.payload?._id);
        state.data.chatrooms = [...restOfChatrooms, action.payload];
        tymtStorage.set(`chatroomList`, JSON.stringify(state.data));
        state.status = "chatroomList";
      })
      .addCase(joinPublicGroupAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(joinPublicGroupAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          console.error("Failed to joinPublicGroupAsync: ", action.payload);
          return;
        }
        const restOfChatrooms = state.data.chatrooms.filter((element) => element._id !== action.payload?._id);
        state.data.chatrooms = [...restOfChatrooms, action.payload];
        tymtStorage.set(`chatroomList`, JSON.stringify(state.data));
        state.status = "chatroomList";
      })
      .addCase(leaveGroupAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(leaveGroupAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          console.error("Failed to leaveGroupAsync: ", action.payload);
          return;
        }
        const restOfChatrooms = state.data.chatrooms.filter((element) => element._id !== action.payload?._id);
        state.data.chatrooms = [...restOfChatrooms];
        tymtStorage.set(`chatroomList`, JSON.stringify(state.data));
        state.status = "chatroomList";
      })
      .addCase(updateGroupAvatarAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(updateGroupAvatarAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          console.error("Failed to updateGroupAvatarAsync: ", action.payload);
          return;
        }
        const restOfChatrooms = state.data.chatrooms.filter((element) => element._id !== action.payload?._id);
        state.data.chatrooms = [...restOfChatrooms, action.payload];
        tymtStorage.set(`chatroomList`, JSON.stringify(state.data));
        state.status = "chatroomList";
      })
      .addCase(updateGroupNameAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(updateGroupNameAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          console.error("Failed to updateGroupNameAsync: ", action.payload);
          return;
        }
        const restOfChatrooms = state.data.chatrooms.filter((element) => element._id !== action.payload?._id);
        state.data.chatrooms = [...restOfChatrooms, action.payload];
        tymtStorage.set(`chatroomList`, JSON.stringify(state.data));
        state.status = "chatroomList";
      })
      .addCase(removeChatroomAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(removeChatroomAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          console.error("Failed to removeChatroomAsync: ", action.payload);
          return;
        }
        const restOfChatrooms = state.data.chatrooms.filter((element) => element._id !== action.payload?._id);
        state.data.chatrooms = [...restOfChatrooms, action.payload];
        tymtStorage.set(`chatroomList`, JSON.stringify(state.data));
        state.status = "chatroomList";
      });
  },
});

export const getChatroomList = (state: any) => state.chatroomList.data;
export const { setChatroomList, delOneFromChatroomList } = chatroomListSlice.actions;

export default chatroomListSlice.reducer;
