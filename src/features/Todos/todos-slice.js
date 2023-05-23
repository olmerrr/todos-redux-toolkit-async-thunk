import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {resetToDefault} from '../Reset/reset-action';
export const loadTodos = createAsyncThunk(
  "@@todos/load-all",
    // параметр нужен если мне чтото нужно передать из UI
    async () => {
    // параметр нужен если мне чтото нужно передать из UI
    const res = await fetch("http://localhost:3001/todos");
    const data =  await res.json();
    console.log(data)
    return  data;
  }
)
export const createTodo = createAsyncThunk(
  "@@todos/create-todo",
  async (title) => {

    const res = await fetch("http://localhost:3001/todos", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({title, completed: false})
    })
   return await res.json();
  }
);
export const toggleTodo = createAsyncThunk(
  '@@todos/toggle-todo',
  async (id, {getState}) => {
    const todo = getState().todos.entities.find(item => item.id === id);

    const res = await fetch('http://localhost:3001/todos/' + id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({completed: !todo.completed})
    })

    const data = await res.json();

    return data;
  }
);

export const removeTodo = createAsyncThunk(
  "@@todos/remove-todo",
  async (id) => {
    const res = await fetch('http://localhost:3001/todos/' + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    })

    await res.json();

    return id;
  }
)

const todoSlice = createSlice({
  name: '@@todos',
  initialState: {
    entities: [],
    loading: "idle",  // "loading"
    error: null
  },
  reducers: {

    addTodo: {
      reducer: (state, action) => {
        state.push(action.payload)
      },
      prepare: (title) => ({
        payload: {
          title,
          completed: false
        }
      })
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(resetToDefault, () => {
        return []
      })
      .addCase(loadTodos.pending, (state, action) => {
        state.loading = "loading";
        state.error = null
      })
      .addCase(loadTodos.rejected, (state) => {
        state.loading = "idle";
        state.error = "Some error"
      })
      .addCase(loadTodos.fulfilled, (state, action) => {
        state.entities = action.payload;
        state.loading = "idle";
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.entities.push(action.payload)
      })
      .addCase(toggleTodo.fulfilled, (state, action) => {
        const updatedTodo = action.payload;

        const index = state.entities.findIndex(todo => todo.id === updatedTodo.id)
        state.entities[index] = updatedTodo;
      })
      .addCase(removeTodo.fulfilled, (state, action) => {
        state.entities = state.entities.filter(todo => todo.id !== action.payload)
      })
  }
});
export const todoReducer = todoSlice.reducer;
export const selectVisibleTodos = (state, filter) => {
  switch (filter) {
    case 'all': {
      return state.todos.entities;
    }
    case 'active': {
      return state.todos.entities.filter(todo => !todo.completed);
    }
    case 'completed': {
      return state.todos.entities.filter(todo => todo.completed);
    }
    default: {
      return state.todos;
    }
  }
}