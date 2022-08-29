import React from 'react'
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom'

import LayerExample from './pages/LayerExample'
import LoaderExample from './pages/LoaderExample'
import MarkerExample from './pages/MarkerExample'

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <div>
          <h1>Home</h1>
          <nav>
            <Link to="/">Layer</Link>
            &nbsp;|&nbsp;
            <Link to="/loader">Loader</Link>
            &nbsp;|&nbsp;
            <Link to="/marker">Marker</Link>
          </nav>
        </div>
        <Routes>
          <Route path="/" element={<LayerExample />}></Route>
          <Route path="/loader" element={<LoaderExample />} />
          <Route path="/marker" element={<MarkerExample />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
