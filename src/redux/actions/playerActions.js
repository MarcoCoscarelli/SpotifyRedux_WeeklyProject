export const selectSong = (song) => {
    return {
      type: 'SELECT_SONG',
      payload: song,
    };
  };
  
  export const setPlaylist = (playlist) => ({
    type: 'SET_PLAYLIST',
    payload: playlist,
  });