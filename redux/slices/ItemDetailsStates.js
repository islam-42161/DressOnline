import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: 0,
  data: null,
  wishlisted: false,
  modalVisible: false,
}

const ItemDetailsStates = createSlice({
  name: 'states',
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload
    },
    setData: (state, action) => {
      state.data = action.payload
    },
    toggleWishlisted: (state) => {
      state.wishlisted = !state.wishlisted
    },
    setModalVisible: (state, action) => {
      state.modalVisible = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setItems, setData, toggleWishlisted, setModalVisible } = ItemDetailsStates.actions;

export default ItemDetailsStates.reducer