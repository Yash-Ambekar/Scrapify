import { useState } from 'react'
import PreviewComp from './components/PreviewComp'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <PreviewComp/>
    </div>
  )
}

export default App
