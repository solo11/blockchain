
import './App.css';


import Register from './components/Register';

import Nav from './components/Navigation';
import UploadPage from './components/MintNft';
import Profile from './components/Profile';
import Home from './components/Home';



import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router > 
      <Nav />
        <Routes>
        <Route path='/' element={<Home/>} />
          <Route path='/home' element={<Home/>} />
          <Route  path='/profile' element={<Profile/>}/>
          <Route  path='/upload' element={<UploadPage/>} />
          <Route  path='/register' element={<Register/>} />
        </Routes>
 
      </Router>

    </div>
  );
}

export default App;
