// import logo from './logo.svg';
// import './App.css';
// import json from '../build/contracts/ValToten.json';
import React from 'react';
import Content from './views/Content';
import {Provider} from 'react-redux';
import store from './redux/store';
export default function App(){
  return(
    <Provider store={store}>
      <Content></Content>
    </Provider>
  )
}
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
