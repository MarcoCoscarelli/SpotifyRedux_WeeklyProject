const initialState = {
    selectedSong: {},
    playlist: [], 
  };
  
  const playerReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SELECT_SONG':
        return {
          ...state,
          selectedSong: action.payload,
        };
      case 'SET_PLAYLIST':
        return {
          ...state,
          playlist: action.payload, 
        };
      default:
        return state;
    }
  };
  
  export default playerReducer;
  