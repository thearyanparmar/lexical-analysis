import { configureStore } from '@reduxjs/toolkit';
import tabReducer from '../features/tabs/tabsSlicer';
import codeReducer from '../features/tabs/codeSlicer'

export default configureStore({
  reducer: {
    tab: tabReducer,
    code: codeReducer
  },
});
