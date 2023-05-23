import {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";

import {selectVisibleTodos, toggleTodo, removeTodo, loadTodos} from './todos-slice';
import {toast, ToastContainer} from "react-toastify";

import "react-toastify/dist/ReactToastify.min.css";

export const TodoList = () => {
  const activeFilter = useSelector(state => state.filter)
  const todos = useSelector(state => selectVisibleTodos(state, activeFilter));
  const dispatch = useDispatch();
  const {error, loading} = useSelector(state => state.todos);
  useEffect(() => {

    const promise = dispatch(loadTodos())
      // unwrap - помогает сделать catch
      .unwrap()
      .then(() => {
        toast("All todos are fetched")
      })
      .catch((err) => {
        toast(err)
      })
  return () => {
   promise.abort();
  }
  }, [dispatch]);

  return (
    <>
      <ToastContainer/>
      <ul>
        {error && <h3>{error}</h3>}
        {loading === "loading" && <h3>Loading..</h3>}
        {loading === "idle" && !error && todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => dispatch(toggleTodo(todo.id))}
            />{" "}
            {todo.title}{" "}
            <button onClick={() => dispatch(removeTodo(todo.id))}>delete</button>
          </li>
        ))}
      </ul>
    </>
  );
};
