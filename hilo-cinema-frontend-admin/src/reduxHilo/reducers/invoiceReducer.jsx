import { 
    FETCH_INVOICES_REQUEST, FETCH_INVOICES_SUCCESS, 
    FETCH_INVOICES_FAILURE,
    EDIT_INVOICES_SUCCESS, EDIT_INVOICES_FAILURE,
    ADD_INVOICES_SUCCESS, ADD_INVOICES_FAILURE,
    FETCH_INVOICES_COUNT_SUCCESS,
    FETCH_INVOICES_COUNT_FAILURE
} from "../types/type";

const initialState = {
    loading: false,
    invoices: [],
    count : 0,
    error: null
};

const invoiceReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_INVOICES_REQUEST:
            return {
                ...state,
                loading: true
            };
        case FETCH_INVOICES_SUCCESS:
            return {
                ...state,
                loading: false,
                invoices: action.payload
            };
        case FETCH_INVOICES_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case ADD_INVOICES_SUCCESS:
            return {
                ...state,
                loading: false,
                invoices: [...state.invoices, action.payload], // Thêm invoice mới vào danh sách
            };
        case ADD_INVOICES_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case FETCH_INVOICES_COUNT_SUCCESS:
            return {
                ...state,
                count: action.payload,  // Cập nhật count khi fetch thành công
            };
        case FETCH_INVOICES_COUNT_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default invoiceReducer;
