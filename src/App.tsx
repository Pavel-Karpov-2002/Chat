import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import { Login } from './components/Login';
import { Chat } from './components/Chat';
import React, { useEffect, useState, Component } from 'react';

export const ThemeContext = React.createContext('');
export const ws = new WebSocket("ws://localhost:9000");

function App() {

  const [themeContext, setTheme] = useState('');

  useEffect(() => {
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', event => {
        const colorScheme = event.matches ? "dark" : "light";
        setTheme(colorScheme);
      });
  }, []);
  
  const chatName : string = "hello";

  return (
    <ThemeContext.Provider value={themeContext}>
        <Routes>
          <Route path='/' element={ <Login /> }/>
          <Route path='/Chat/*' element={ <Chat /> }/>
        </Routes>
    </ThemeContext.Provider>
  );
}

export default App;