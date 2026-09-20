import React from 'react';
import LogoutButton from './LogoutButton';
import { Bell, Search, User } from 'lucide-react';

const Navbar = () => {
    return (
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200/80 bg-white/80 px-4 sm:px-6 backdrop-blur-md transition-all">
            {/* Left side / Title */}
            <div className="flex items-center gap-4">
                <h2 className="text-base font-bold tracking-tight text-gray-800 sm:text-xl">Dashboard</h2>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 sm:gap-5">
                {/* Search - Example placeholder */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100/80 hover:bg-gray-200/60 rounded-full transition-colors cursor-pointer text-gray-500">
                  <Search className="h-4 w-4" />
                  <span className="text-sm font-medium">Search...</span>
                  <span className="ml-2 text-[10px] bg-white px-1.5 py-0.5 rounded border border-gray-200 shadow-sm font-mono font-bold">⌘K</span>
                </div>

                {/* Notifications */}
                <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                    <Bell className="h-5 w-5" strokeWidth={2} />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                </button>

                <div className="hidden h-6 w-px bg-gray-200 sm:block"></div>

                {/* User Profile */}
                <div className="flex items-center gap-2 pl-1 sm:gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-sm font-bold text-white shadow-sm ring-2 ring-white cursor-pointer hover:shadow-md transition-shadow">
                        Y
                    </div>
                    <div className="hidden sm:block cursor-pointer">
                        <p className="text-sm font-bold text-gray-700 leading-none">Admin</p>
                        <p className="text-[11px] font-medium text-gray-500 mt-1">Administrator</p>
                    </div>
                    <div className="ml-0 sm:ml-2">
                        <LogoutButton />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar;
