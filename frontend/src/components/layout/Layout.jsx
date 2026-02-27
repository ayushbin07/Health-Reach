import Navbar from './Navbar';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen" style={{ background: '#F0FDFF' }}>
            {/* Blurred background orbs for depth */}
            <div style={{
                position: 'fixed', top: '-5%', right: '-5%', width: '400px', height: '400px',
                background: 'radial-gradient(circle, #BAE6FD 0%, transparent 70%)', zIndex: 0, pointerEvents: 'none'
            }} />
            <div style={{
                position: 'fixed', bottom: '-5%', left: '-5%', width: '500px', height: '500px',
                background: 'radial-gradient(circle, #CFFAFE 0%, transparent 70%)', zIndex: 0, pointerEvents: 'none'
            }} />

            <Navbar />

            <main style={{ position: 'relative', zIndex: 1 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
                {children}
            </main>
        </div>
    );
}
