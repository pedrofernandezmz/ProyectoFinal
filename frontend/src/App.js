import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link} from "react-router-dom";
import "./App.css";
import Home from "./Home"
import Login from "./Login"
import Cart from "./Cart"
import Publications from "./Publications"

function App(){
return (
    <Router>
      <Routes>
        <Route exact path = "/" element={<Home/>}/>
        <Route path= "/login" element={<Login/>}/>
        <Route path= "/cart" element={<Cart/>}/>
        <Route path= "/publications" element={<Publications/>}/>
      </Routes>
    </Router>
  );
}

export default App;
