import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IGameList } from "../../types/GameTypes";
import tymtStorage from "../../lib/Storage";
import { fetchAllComingGameList, fetchComingGameList } from "./ComingGameListApi";

const init: IGameList = {
  games: [],
};

const loadComingGameList = () => {
  const data = tymtStorage.get(`comingGameList`);
  if (!data) {
    tymtStorage.set(`comingGameList`, JSON.stringify(init));
    return init;
  }
  return JSON.parse(data);
};

const initialState = {
  data: loadComingGameList(),
  status: "comingGameList",
  msg: "",
};

export const fetchComingGameListAsync = createAsyncThunk("comingGameList/fetchComingGameListAsync", fetchComingGameList);
export const fetchAllComingGameListAsync = createAsyncThunk("comingGameList/fetchAllComingGameListAsync", fetchAllComingGameList);

const comingGameListSlice = createSlice({
  name: "comingGameList",
  initialState,
  reducers: {
    setComingGameList(state, action) {
      state.data = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchComingGameListAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchComingGameListAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          console.error("Failed to fetchComingGameListAsync: action.payload undefined!");
          return;
        }
        state.data = action.payload;
        tymtStorage.set(`comingGameList`, JSON.stringify(state.data));
        state.status = "fetchComingGameListAsync";
      })
      .addCase(fetchAllComingGameListAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchAllComingGameListAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          console.error("Failed to fetchAllComingGameListAsync: action.payload undefined!");
          return;
        }
        state.data = action.payload;
        tymtStorage.set(`gameList`, JSON.stringify(state.data));
        state.status = "fetchAllComingGameListAsync";
      });
  },
});

export const getComingGameList = (state: any) => state.comingGameList.data;

export default comingGameListSlice.reducer;

export const { setComingGameList } = comingGameListSlice.actions;
