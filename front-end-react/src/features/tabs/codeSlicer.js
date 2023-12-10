import { createSlice } from '@reduxjs/toolkit';

const codeSlice = createSlice({
    name: 'code',
    initialState: {
      value: null
    },
    reducers: {
      changeCode: (state, action) =>{
        state.value = action.payload
      }
    }
  })

  export const { changeCode } = codeSlice.actions;
  export const selectCode = (state) => state.code.value;
  export default codeSlice.reducer;