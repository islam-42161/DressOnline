import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  connected: true,
}

const GlobalSlice = createSlice({
  name: 'global_states',
  initialState,
  reducers: {
    setConnection:(state,action)=>{
        state.connected = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setConnection } = GlobalSlice.actions;

export default GlobalSlice.reducer