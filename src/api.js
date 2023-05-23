const BASE_URL = 'http://localhost:3001/todos';

export const loadTodos = async () => {
  const res = await fetch(BASE_URL);
  const data = await res.json();

  return data;
}
export const createTodo = async (title) => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({title, completed: false})
  })
  const data = await res.json();

  return data;
}
export const toggleTodo = async (id, fields) => {
  const res = await fetch('http://localhost:3001/todos/' + id, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(fields)
  })

  const data = await res.json();

  return data;
}
export const removeTodo = async (id) => {
  const res = await fetch('http://localhost:3001/todos/' + id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
  })

  await res.json();

  return id;
}