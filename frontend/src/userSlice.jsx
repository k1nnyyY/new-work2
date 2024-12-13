import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  username: null,
  dayOfBirth: null,
  gender: null,
  maritalStatus: null,
  whatIsJob: null,
  yourObjective: null,
  star: null,
  subscription: null,
  expiredSubscription: null,
  job: null,
  firstName: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      return { ...state, ...action.payload };
    },
    clearUser() {
      return initialState;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
