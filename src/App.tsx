import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PaginaPrincipal from './Pages/PaginaPrincipal/PaginaPrincipal';
import './App.css';
import Carrito from './Pages/Carrito/Carrito';
import AñadirProducto from './Pages/AñadirProducto/AñadirProducto';
import DetalleProducto from './Pages/DetalleProducto/DetalleProducto';
import Header  from './Pages/PaginaPrincipal/Header';
function App() {


  return (
    <Router >
      <div className="App">
        <Header/>     
           <Routes>
        <Route path="/" element={<PaginaPrincipal />} />
        <Route path="/paginaprincipal" element={<PaginaPrincipal  />} />
        <Route path='/carrito' element={<Carrito />}></Route>
          <Route path='/añadirProducto' element={<AñadirProducto />} />
          <Route path='/detalleProducto/:id' element={<DetalleProducto />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
