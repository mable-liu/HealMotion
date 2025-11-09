import Link from 'next/link';
import './home.css';

export default function Home() {
    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Welcome to HealMotion</h1>
                <p>Your personal guide to fitness and rehabilitation.</p>
            </header>
            <main className="home-main">
                <div className="category-grid">
                    <Link href="/profile" className="category-card">
                        <h2>Profile</h2>
                    </Link>
                    <Link href="/workout" className="category-card">
                        <h2>Workout</h2>
                    </Link>
                    <Link href="/diet" className="category-card">
                        <h2>Diet</h2>
                    </Link>
                </div>
            </main>
        </div>
    );
}
