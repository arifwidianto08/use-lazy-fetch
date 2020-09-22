# use-lazy-fetch

> Performing Fetch Data without initializing state and worrying about useEffect

[![NPM](https://img.shields.io/npm/v/use-lazy-fetch.svg)](https://www.npmjs.com/package/use-lazy-fetch) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save use-lazy-fetch
```

## Usage

```tsx
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
```

## License

MIT © [arifwidianto08](https://github.com/arifwidianto08)
