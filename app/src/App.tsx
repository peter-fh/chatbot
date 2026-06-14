import { Route, Routes } from "react-router"
import { Chat } from "./Chat"

export function App() {
  return (
    <Routes>
      <Route path="/:cid?" element={<Chat/>}/>
    </Routes>
  )

}

export default App
