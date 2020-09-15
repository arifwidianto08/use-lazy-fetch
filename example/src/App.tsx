import React from 'react'

import { useLazyFetch } from 'use-lazy-fetch'

interface Todo {
  data: Array<{
    userId: number
    id: number
    title: string
    completed: boolean
  }>
}

const App = () => {
  const fetchTodos = () => {
    return fetch('https://jsonplaceholder.typicode.com/todos')
      .then((res) => res.json())
      .then((val) => val)
  }
  const { query, isLoading } = useLazyFetch()
  const { data } = query<Todo>(fetchTodos, [], {
    withEffect: true
  })

  if (isLoading) {
    return <div>'Loading...'</div>
  }
  return (
    <div>{data && data.map((todo) => <p key={todo.id}>{todo.title}</p>)}</div>
  )
}

export default App
