import { RootState } from "../store";

export const selectErrorMsg = (state: RootState) => state.error.errorMsg;