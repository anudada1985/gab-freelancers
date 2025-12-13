export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-black">
      {/* Header */}
      <header className="bg-blue-600 text-white px-6 py-4">
        <h1 className="text-2xl font-bold">
          Gab Freelancers Dashboard
        </h1>
      </header>

      {/* Main Layout */}
      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 text-white p-4">
          <ul className="space-y-3">
            <li className="font-semibold">Dashboard</li>
            <li className="opacity-80">Jobs</li>
            <li className="opacity-80">Freelancers</li>
            <li className="opacity-80">Wallet</li>
            <li className="opacity-80">Settings</li>
          </ul>
        </aside>

        {/* Content */}
        <main className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">
              Welcome 👋
            </h2>

            <p className="text-gray-700 mb-6">
              Your dashboard is now rendering correctly on Vercel.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-100 rounded">
                <p className="font-semibold">Total Jobs</p>
                <p className="text-2xl font-bold">12</p>
              </div>

              <div className="p-4 bg-yellow-100 rounded">
                <p className="font-semibold">Active Freelancers</p>
                <p className="text-2xl font-bold">8</p>
              </div>

              <div className="p-4 bg-blue-100 rounded">
                <p className="font-semibold">Wallet Balance</p>
                <p className="text-2xl font-bold">$1,250</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
