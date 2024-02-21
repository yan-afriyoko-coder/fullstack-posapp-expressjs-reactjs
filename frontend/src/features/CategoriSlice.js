import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import secureLocalStorage from "react-secure-storage";
import { axiosInstance } from "../auth/AxiosConfig.jsx";

let headersList = {
  Authorization: "Bearer " + secureLocalStorage.getItem("acessToken"),
  "Content-Type": "application/json",
};

let reqOptionsGetAll = {
  url: "/api/categorys",
  method: "GET",
  headers: headersList,
};

export const getAllCategory = createAsyncThunk(
  "category/getAllCategory",
  async () => {
    try {
      const response = await axiosInstance.request(reqOptionsGetAll);
      return response.data.result;
    } catch (error) {
      const data = JSON.parse(error.request.response);
      throw new Error(data ? data.message : error.message);
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAllCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default categorySlice.reducer;
