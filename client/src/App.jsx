import Editor from "./pages/Editor"
import "./App.css"
import Header from "./components/Header"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { v4 as uuid } from 'uuid'

function App() {

  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' element={<Navigate replace to ={`/doc/${uuid()}`} /> } />
          <Route path='/doc/:id' element={<Editor />} />
        </Routes>
      </BrowserRouter>
    </> 
  )
}

export default App
