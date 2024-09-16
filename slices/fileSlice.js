import { createSlice } from '@reduxjs/toolkit';

const fileSlice = createSlice({
  name: 'file',
  initialState: {
    uploading: false,
    progress: 0,
    downloadLink: '',
    fileContent: null, // Add fileContent to state
  },
  reducers: {
    setUploading(state, action) {
      state.uploading = action.payload;
    },
    setProgress(state, action) {
      state.progress = action.payload;
    },
    setDownloadLink(state, action) {
      state.downloadLink = action.payload;
    },
    setFileContent(state, action) { // Add reducer for fileContent
      state.fileContent = action.payload;
    },
  },
});

export const { setUploading, setProgress, setDownloadLink, setFileContent } = fileSlice.actions;
export default fileSlice.reducer;
