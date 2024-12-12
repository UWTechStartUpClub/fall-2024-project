import { Routes, Route } from 'react-router-dom';
import { ProtectedRoutes } from "./routes/ProtectedRoutes"
import Home from './routes/Home';
import About from './routes/About';
import TermsAndConds from './routes/TermsAndConds';
import Contact from './routes/Contact';
import Register from './components/Forms/Register';
import Login from './components/Forms/Login';
import UserProfile from './routes/UserProfile';
import Dashboard from  './routes/Dashboard';
import Stock from './routes/Stock';
import AllStocks from './routes/AllStocks';
import StockGraph from './routes/StockGraph';
import Search from './routes/Search';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/t&c" element={<TermsAndConds />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoutes />}> {/* Anything within this tag is protected */}
        <Route path="/profile/:userId" element={<UserProfile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/stocks" element={<AllStocks />} />
        <Route path="/stock/:symbol/graph" element={<StockGraph />} />
        <Route path="/stock/:symbol" element={<Stock />} />
        <Route path="/search" element={<Search />} />
      </Route>
    </Routes>
  );
}

export default App;