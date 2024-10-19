import { BrowserRouter as Router, Routes, Route , Link} from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
           <Route  path="/About" element={<About />} />
        
        </Routes>
      </div>
    </Router>
  );
}

export default App;
