import callApi from '../../api/index';

export const fetchTheatersRequest = () => ({
    type: "FETCH_THEATERS_REQUEST"
});

export const fetchTheatersSuccess = (theaters) => ({
    type: "FETCH_THEATERS_SUCCESS",
    payload: theaters
});

export const fetchTheatersFailure = (error) => ({
    type: "FETCH_THEATERS_FAILURE",
    payload: error
});

export const fetchTheaters = () => {
    return (dispatch) => {
        dispatch(fetchTheatersRequest());
        return callApi('TheaterService', 'GET', null)
            .then(response => {
                dispatch(fetchTheatersSuccess(response.data));
            })
            .catch(error => {
                console.error('API call failed: ', error);
                dispatch(fetchTheatersFailure(error));
            });
    };
};
