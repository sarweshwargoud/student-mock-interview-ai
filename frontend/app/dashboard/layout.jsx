import React from 'react';

function DashboardLayout({ children }) {
  return (
    <div className="pt-24">
      <main className="container mx-auto px-4">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
