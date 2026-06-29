import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { Dashboard } from '@/components/Dashboard';

export default function Page() {
  return (
    <div className="app">
      <Sidebar active="dashboard" />
      <div className="main">
        <Topbar title="Dashboard" />
        <main className="page">
          <div className="page-inner">
            <Dashboard />
          </div>
        </main>
      </div>
    </div>
  );
}
