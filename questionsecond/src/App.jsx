import { useState } from 'react'
import './App.css'
import CommentsPage from "./pages/CommentsPage.js";
import PostsPage from "./pages/PostsPage.js";
import UsersPage from "./pages/UsersPage.js";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <h1>Social media analytics</h1>
        <UsersPage />
        <PostsPage />
        <CommentsPage />
      </div>
    </>
  )
}

export default App
