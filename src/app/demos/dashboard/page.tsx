'use client';

import { useState } from 'react';

type User = {
  id: number;
  name: string;
  email: string;
  status: 'Active' | 'Inactive' | 'Pending';
  lastActive: string;
  plan: string;
};

const users: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', status: 'Active', lastActive: '2 hours ago', plan: 'Pro' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', status: 'Active', lastActive: '5 minutes ago', plan: 'Enterprise' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', status: 'Inactive', lastActive: '3 days ago', plan: 'Basic' },
  { id: 4, name: 'David Brown', email: 'david@example.com', status: 'Active', lastActive: '1 hour ago', plan: 'Pro' },
  { id: 5, name: 'Eve Davis', email: 'eve@example.com', status: 'Pending', lastActive: 'Never', plan: 'Basic' },
  { id: 6, name: 'Frank Miller', email: 'frank@example.com', status: 'Active', lastActive: '30 minutes ago', plan: 'Enterprise' },
];

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Revenue', value: '$45,231', change: '+12.5%', positive: true },
    { label: 'Active Users', value: '2,345', change: '+8.2%', positive: true },
    { label: 'New Signups', value: '234', change: '-2.4%', positive: false },
    { label: 'Conversion Rate', value: '3.24%', change: '+0.5%', positive: true },
  ];

  const recentActivity = [
    { id: 1, user: 'Alice Johnson', action: 'Upgraded to Pro plan', time: '2 hours ago' },
    { id: 2, user: 'Bob Smith', action: 'Completed onboarding', time: '5 hours ago' },
    { id: 3, user: 'Carol White', action: 'Updated payment method', time: '1 day ago' },
    { id: 4, user: 'David Brown', action: 'Invited 3 team members', time: '2 days ago' },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-background-secondary border-r-2 border-border
                   theme-transition flex-shrink-0 relative`}
        aria-label="Main navigation"
      >
        <div className="p-4 border-b-2 border-border">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <h1 className="text-foreground font-[family-name:var(--font-display)] text-xl font-bold">
                SaaS Dashboard
              </h1>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-background rounded-[var(--radius-md)] theme-transition
                       focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              aria-expanded={sidebarOpen}
            >
              {sidebarOpen ? '◀' : '▶'}
            </button>
          </div>
        </div>

        <nav className="p-4" aria-label="Sidebar navigation">
          <ul className="space-y-2">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'users', label: 'Users', icon: '👥' },
              { id: 'analytics', label: 'Analytics', icon: '📈' },
              { id: 'settings', label: 'Settings', icon: '⚙️' },
            ].map(item => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)]
                           theme-transition focus:outline-none focus:ring-2 focus:ring-accent
                           ${activeTab === item.id
                             ? 'bg-primary text-primary-foreground'
                             : 'text-foreground-muted hover:bg-background hover:text-foreground'
                           }`}
                  aria-current={activeTab === item.id ? 'page' : undefined}
                >
                  <span role="img" aria-hidden="true" className="text-xl">{item.icon}</span>
                  {sidebarOpen && <span className="font-semibold">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-background-secondary border-b-2 border-border px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-foreground font-[family-name:var(--font-display)] text-2xl font-bold capitalize">
                {activeTab}
              </h2>
              <p className="text-foreground-muted text-sm mt-1">
                {activeTab === 'overview' && 'Monitor your key metrics and performance'}
                {activeTab === 'users' && 'Manage your user base and permissions'}
                {activeTab === 'analytics' && 'Deep dive into your data'}
                {activeTab === 'settings' && 'Configure your account settings'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                className="px-4 py-2 bg-background border-2 border-border rounded-[var(--radius-md)]
                         text-foreground font-semibold theme-transition
                         hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label="View notifications"
              >
                🔔 Notifications
              </button>
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 bg-primary text-primary-foreground rounded-full
                               flex items-center justify-center font-bold"
                      aria-label="User profile">
                  JD
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          {activeTab === 'overview' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-background-secondary border-2 border-border rounded-[var(--radius-lg)]
                             p-6 theme-transition hover:shadow-[var(--shadow-md)]"
                  >
                    <h3 className="text-foreground-muted text-sm font-semibold mb-2">
                      {stat.label}
                    </h3>
                    <div className="flex items-baseline justify-between">
                      <span className="text-foreground font-[family-name:var(--font-display)] text-3xl font-bold">
                        {stat.value}
                      </span>
                      <span
                        className={`text-sm font-semibold ${
                          stat.positive ? 'text-green-500' : 'text-red-500'
                        }`}
                        aria-label={`${stat.positive ? 'Increased' : 'Decreased'} by ${stat.change}`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-background-secondary border-2 border-border rounded-[var(--radius-lg)] p-6">
                  <h3 className="text-foreground font-[family-name:var(--font-display)] text-xl font-bold mb-4">
                    Revenue Trend
                  </h3>
                  {/* Simplified chart visualization */}
                  <div className="h-64 flex items-end justify-between gap-2" role="img" aria-label="Revenue trend bar chart">
                    {[40, 65, 55, 80, 70, 90, 85, 95].map((height, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-primary rounded-t-[var(--radius-sm)] theme-transition
                                   hover:opacity-80"
                          style={{ height: `${height}%` }}
                          aria-label={`Week ${i + 1}: ${height}%`}
                        />
                        <span className="text-foreground-muted text-xs mt-2">W{i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-background-secondary border-2 border-border rounded-[var(--radius-lg)] p-6">
                  <h3 className="text-foreground font-[family-name:var(--font-display)] text-xl font-bold mb-4">
                    User Activity
                  </h3>
                  <div className="space-y-4">
                    {recentActivity.map(activity => (
                      <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-border last:border-0">
                        <div className="w-10 h-10 bg-accent text-background rounded-full
                                      flex items-center justify-center font-bold flex-shrink-0">
                          {activity.user.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-foreground font-semibold truncate">{activity.user}</p>
                          <p className="text-foreground-muted text-sm">{activity.action}</p>
                          <p className="text-foreground-muted text-xs mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'users' && (
            <div className="bg-background-secondary border-2 border-border rounded-[var(--radius-lg)] overflow-hidden">
              <div className="p-6 border-b-2 border-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-foreground font-[family-name:var(--font-display)] text-xl font-bold">
                    User Management
                  </h3>
                  <button
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-[var(--radius-md)]
                             font-semibold theme-transition hover:opacity-90
                             focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    + Add User
                  </button>
                </div>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-background border-b-2 border-border">
                      <th className="px-6 py-4 text-left text-foreground font-semibold">Name</th>
                      <th className="px-6 py-4 text-left text-foreground font-semibold">Email</th>
                      <th className="px-6 py-4 text-left text-foreground font-semibold">Status</th>
                      <th className="px-6 py-4 text-left text-foreground font-semibold">Plan</th>
                      <th className="px-6 py-4 text-left text-foreground font-semibold">Last Active</th>
                      <th className="px-6 py-4 text-left text-foreground font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} className="border-b border-border hover:bg-background theme-transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full
                                          flex items-center justify-center font-bold text-sm">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="text-foreground font-semibold">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-foreground-muted">{user.email}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-[var(--radius-sm)] text-sm font-semibold
                              ${user.status === 'Active' ? 'bg-green-500/20 text-green-500' : ''}
                              ${user.status === 'Inactive' ? 'bg-red-500/20 text-red-500' : ''}
                              ${user.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-500' : ''}
                            `}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-foreground">{user.plan}</td>
                        <td className="px-6 py-4 text-foreground-muted">{user.lastActive}</td>
                        <td className="px-6 py-4">
                          <button
                            className="text-accent hover:text-foreground theme-transition font-semibold
                                     focus:outline-none focus:ring-2 focus:ring-accent rounded"
                            aria-label={`Edit ${user.name}`}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="bg-background-secondary border-2 border-border rounded-[var(--radius-lg)] p-6">
                <h3 className="text-foreground font-[family-name:var(--font-display)] text-xl font-bold mb-4">
                  Performance Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-foreground-muted text-sm mb-2">Average Session Duration</p>
                    <p className="text-foreground font-[family-name:var(--font-display)] text-3xl font-bold">
                      12m 34s
                    </p>
                  </div>
                  <div>
                    <p className="text-foreground-muted text-sm mb-2">Page Views</p>
                    <p className="text-foreground font-[family-name:var(--font-display)] text-3xl font-bold">
                      142,503
                    </p>
                  </div>
                  <div>
                    <p className="text-foreground-muted text-sm mb-2">Bounce Rate</p>
                    <p className="text-foreground font-[family-name:var(--font-display)] text-3xl font-bold">
                      32.4%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-background-secondary border-2 border-border rounded-[var(--radius-lg)] p-6">
                <h3 className="text-foreground font-[family-name:var(--font-display)] text-xl font-bold mb-4">
                  Traffic Sources
                </h3>
                <div className="space-y-4">
                  {[
                    { source: 'Direct', percentage: 45, color: 'bg-blue-500' },
                    { source: 'Organic Search', percentage: 30, color: 'bg-green-500' },
                    { source: 'Social Media', percentage: 15, color: 'bg-purple-500' },
                    { source: 'Referral', percentage: 10, color: 'bg-orange-500' },
                  ].map(item => (
                    <div key={item.source}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-foreground font-semibold">{item.source}</span>
                        <span className="text-foreground-muted">{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-background h-3 rounded-full overflow-hidden">
                        <div
                          className={`${item.color} h-full theme-transition`}
                          style={{ width: `${item.percentage}%` }}
                          role="progressbar"
                          aria-valuenow={item.percentage}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${item.source}: ${item.percentage}%`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl">
              <form className="bg-background-secondary border-2 border-border rounded-[var(--radius-lg)] p-6 space-y-6">
                <h3 className="text-foreground font-[family-name:var(--font-display)] text-xl font-bold">
                  Account Settings
                </h3>

                <div>
                  <label htmlFor="company-name" className="block text-foreground font-semibold mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company-name"
                    defaultValue="Acme Corporation"
                    className="w-full px-4 py-2 bg-background border-2 border-border rounded-[var(--radius-md)]
                             text-foreground theme-transition focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label htmlFor="email-address" className="block text-foreground font-semibold mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email-address"
                    defaultValue="admin@acme.com"
                    className="w-full px-4 py-2 bg-background border-2 border-border rounded-[var(--radius-md)]
                             text-foreground theme-transition focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label htmlFor="timezone" className="block text-foreground font-semibold mb-2">
                    Timezone
                  </label>
                  <select
                    id="timezone"
                    className="w-full px-4 py-2 bg-background border-2 border-border rounded-[var(--radius-md)]
                             text-foreground theme-transition focus:outline-none focus:border-accent"
                  >
                    <option>UTC-8 (Pacific Time)</option>
                    <option>UTC-5 (Eastern Time)</option>
                    <option>UTC+0 (GMT)</option>
                    <option>UTC+1 (Central European Time)</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-5 h-5 text-accent border-border rounded focus:ring-accent"
                    />
                    <span className="text-foreground">Enable email notifications</span>
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-[var(--radius-md)]
                             font-semibold theme-transition hover:opacity-90
                             focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="px-6 py-2 bg-background border-2 border-border text-foreground
                             rounded-[var(--radius-md)] font-semibold theme-transition
                             hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
