import Header from '@/components/ui/header'
import React from 'react'
import { Outlet } from 'react-router-dom'

const AppLayout = () => {
  return (
    <div className="relative min-h-screen">
      <div className="grid-background-broken fixed inset-0 w-full h-full z-[-1]"></div>
      <main className="container mx-auto min-h-screen">
        <Header />
        <Outlet />
      </main>
      <div className="p-10 text-center bg-gray-900 mt-10">Made by Simar</div>
    </div>
  );
};

export default AppLayout
