import { createSlice } from "@reduxjs/toolkit";

import tymtStorage from "../../lib/Storage";
import { scrollDownType } from "../../types/chatTypes";
import { compareJSONStructure } from "../../lib/api/JSONHelper";

const init: scrollDownType = {
  down: false,
};

const loadData: () => scrollDownType = () => {
  const data = tymtStorage.get(`scrolldown`);
  if (data === null || data === "" || !compareJSONStructure(data, init)) {
    return init;
  } else {
    return JSON.parse(data);
  }
};

const initialState = {
  data: loadData(),
  status: "scrolldown",
  msg: "",
};

const scrollDownSlice = createSlice({
  name: "scrolldown",
  initialState,
  reducers: {
    setdownState(state, action) {
      state.data = action.payload;
      // tymtStorage.set("navigation", JSON.stringify(action.payload));
    },
  },
});

export const getdownState = (state: any) => state.scrolldown.data;

export default scrollDownSlice.reducer;

export const { setdownState } = scrollDownSlice.actions;
