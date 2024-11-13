
import { Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import Register from './components/Forms/Register';
import Login from './components/Forms/Login';
import Stock from './routes/Stock';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="/stock/:symbol" element={<Stock />} />
        {/* <Route path="/about" element={<About />} />
        <Route path="/t&c" element={<TermsAndConds />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile/:userId" element={<UserProfile />} />
        <Route path="/stock/" element={<AllStocks />} />
        <Route path="/stock/:symbol/graph" element={<StockGraph />} />
        <Route path="/stock/:symbol" element={<Stock />} />
        <Route path="/search" element={<Search />} /> */}
      </Routes>
    </>
  );
}

export default App;