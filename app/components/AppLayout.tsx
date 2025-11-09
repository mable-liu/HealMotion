'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import './AppLayout.css';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarVisible, setSidebarVisible] = useState(false);

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    return (
        <div className="app-container">
            <button className="menu-toggle" onClick={toggleSidebar}>
                ☰
            </button>
            <div className={`sidebar ${isSidebarVisible ? 'visible' : 'hidden'}`}>
                <h2>HealMotion</h2>
                <ul>
                    <li><Link href="/" onClick={toggleSidebar}>Home</Link></li>
                    <li><Link href="/profile" onClick={toggleSidebar}>Profile</Link></li>
                    <li><Link href="/workout" onClick={toggleSidebar}>Workout Assistant</Link></li>
                    <li><Link href="/diet" onClick={toggleSidebar}>Nutrition</Link></li>
                </ul>
            </div>
            <div className="main-content">
                {children}
            </div>
        </div>
    );
}
