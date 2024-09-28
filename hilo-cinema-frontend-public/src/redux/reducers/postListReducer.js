const initialState = {

}

const postListReducer = (state = initialState, action) => {
    switch (action.type) {
      case "...": {
        return {
            ...state,
            
          };
      }
      default:
        return state;
    }
}

export default postListReducer;