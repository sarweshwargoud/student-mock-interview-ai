import React from 'react';
import WelcomeEmailTrigger from './_components/WelcomeEmailTrigger';

function DashboardLayout({ children }) {
  return (
    <div className="pt-24">
      <WelcomeEmailTrigger />
      <main className="container mx-auto px-4">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;