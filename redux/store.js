import { configureStore } from '@reduxjs/toolkit'
import ItemDetailsStates from './slices/ItemDetailsStates'

export const store = configureStore({
  reducer: {
    states:ItemDetailsStates
  },
})