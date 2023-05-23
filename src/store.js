import { configureStore } from "@reduxjs/toolkit";

import {filterReducer} from './features/Filters/filter-slice';
import {todoReducer} from './features/Todos/todos-slice';

export const store = configureStore({
  reducer: {
    todos: todoReducer,
    filter: filterReducer,
  },
  devTools: true,
});
