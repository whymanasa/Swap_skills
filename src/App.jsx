import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/sign-up" element={<SignUp />} /> */}
        </Routes>
        
      </div>
    </Router>
  );
}

export default App;
