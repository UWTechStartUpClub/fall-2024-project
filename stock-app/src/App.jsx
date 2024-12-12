
import { Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import Stock from './routes/Stock';

function App() {
  return (
   <>
   <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/stock/:symbol" element={<Stock />} />
   </Routes>
   </>
  );
}

export default App;