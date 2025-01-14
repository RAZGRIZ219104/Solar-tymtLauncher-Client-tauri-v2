import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { fetchTransactionList, initializeTransactionList } from "./TransactionListApi";

import { ITransactionList } from "../../types/walletTypes";

const init: ITransactionList = {
  list: [],
};

const loadTransactionList: () => ITransactionList = () => {
  const data = sessionStorage.getItem(`transactionList`);
  if (!data) {
    sessionStorage.setItem(`transactionList`, JSON.stringify(init));
    return init;
  }
  return JSON.parse(data);
};

const initialState = {
  data: loadTransactionList(),
  status: "transactionList",
  msg: "",
};

export const fetchTransactionListAsync = createAsyncThunk("transactionList/fetchTransactionListAsync", fetchTransactionList);
export const addTransactionListAsync = createAsyncThunk("transactionList/addTransactionListAsync", fetchTransactionList);
export const initializeTransactionListAsync = createAsyncThunk("transactionList/initializeTransactionListAsync", initializeTransactionList);

export const transactionListSlice = createSlice({
  name: "transactionList",
  initialState,
  reducers: {
    setTransactionList: (state, action) => {
      state.data.list = action.payload;
      sessionStorage.setItem(`transactionList`, JSON.stringify(state.data));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactionListAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTransactionListAsync.fulfilled, (state, action: PayloadAction<any>) => {
        const data = action.payload;
        if (!data) return;
        state.data.list = data;
        sessionStorage.setItem(`transactionList`, JSON.stringify(state.data));
        state.status = "transactionList";
      })
      .addCase(addTransactionListAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addTransactionListAsync.fulfilled, (state, action: PayloadAction<any>) => {
        const data = action.payload;
        if (!data) return;
        state.data.list = [...state.data.list, ...data];
        sessionStorage.setItem(`transactionList`, JSON.stringify(state.data));
        state.status = "transactionList";
      })
      .addCase(initializeTransactionListAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(initializeTransactionListAsync.fulfilled, (state, action: PayloadAction<any>) => {
        const data = action.payload;
        state.data.list = data;
        sessionStorage.setItem(`transactionList`, JSON.stringify(state.data));
        state.status = "transactionList";
      });
  },
});

export const getTransactionList = (state: any) => state.transactionList.data;
export const { setTransactionList } = transactionListSlice.actions;

export default transactionListSlice.reducer;
