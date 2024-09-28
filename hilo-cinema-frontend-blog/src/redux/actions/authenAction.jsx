import { SAVE_ACCOUNT_SESSION } from "../actionTypes";

export const saveAccountSession = (data) => ({
        type: SAVE_ACCOUNT_SESSION,
        payload: data
});