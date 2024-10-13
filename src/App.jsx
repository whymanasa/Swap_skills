import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import './components/footer.css'
import Footer from './components/footer'

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Footer/>
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
