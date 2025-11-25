'use client';

// This is a placeholder for the admin dashboard.
// A real implementation would fetch summary data from the API.

const AdminDashboardPage = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-christmas-blue">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card text-center">
          <h3 className="text-xl font-semibold text-christmas-blue">Total Teams</h3>
          <p className="text-4xl font-bold text-christmas-blue mt-2">--</p>
        </div>
        <div className="card text-center">
          <h3 className="text-xl font-semibold text-christmas-blue">Total Players</h3>
          <p className="text-4xl font-bold text-christmas-blue mt-2">--</p>
        </div>
        <div className="card text-center">
          <h3 className="text-xl font-semibold text-christmas-blue">Upcoming Matches</h3>
          <p className="text-4xl font-bold text-christmas-blue mt-2">--</p>
        </div>
         <div className="card text-center">
          <h3 className="text-xl font-semibold text-christmas-blue">Live Matches</h3>
          <p className="text-4xl font-bold text-red-500 mt-2">--</p>
        </div>
      </div>
       <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-4 text-christmas-blue">Quick Actions</h3>
            <div className="flex space-x-4">
                <button className="bg-christmas-blue text-white font-bold py-2 px-4 rounded hover:bg-blue-700">Create New Match</button>
                <button className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600">Manage Live Games</button>
            </div>
        </div>
    </div>
  );
};

export default AdminDashboardPage;
