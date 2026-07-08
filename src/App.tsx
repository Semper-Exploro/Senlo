import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Home } from './pages/Home';
import { Residents } from './pages/Residents';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { PostDetail } from './pages/PostDetail';
import { AIAdmin } from './pages/AIAdmin';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/residents" element={<Residents />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/ai-admin" element={<AIAdmin />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
