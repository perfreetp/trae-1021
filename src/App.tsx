import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import PoolList from './pages/Pools';
import PoolDetail from './pages/Pools/PoolDetail';
import Tasks from './pages/Tasks';
import Quality from './pages/Quality';
import Energy from './pages/Energy';
import Batches from './pages/Batches';
import Reports from './pages/Reports';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pools" element={<PoolList />} />
          <Route path="/pool/:poolId" element={<PoolDetail />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/quality" element={<Quality />} />
          <Route path="/energy" element={<Energy />} />
          <Route path="/batches" element={<Batches />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Routes>
    </Router>
  );
}
