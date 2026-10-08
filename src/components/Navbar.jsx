import React from 'react';
import { Bot, Sparkles, Settings, Zap, Globe, Share2 } from 'lucide-react';

export default function Navbar({ onOpenApiConfig, activeTab, setActiveTab }) {
    return (
        <header className="glass-panel" style={{ borderRadius: '0 0 20px 20px', borderTop: 'none', padding: '1rem 2rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>

                {/* Brand Logo & Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        background: 'var(--primary-gradient)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
                    }}>
                        <Bot size={26} color="#fff" />
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }} className="text-gradient">
                                BytesCraft Social AI
                            </h1>
                            <span className="badge badge-purple">
                                <Sparkles size={12} /> Auto-Pilot 2.0
                            </span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Autonomous Content Engine & Multi-Platform Publisher
                        </p>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.35rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                    <button
                        onClick={() => setActiveTab('generator')}
                        className={activeTab === 'generator' ? 'btn-primary' : 'btn-secondary'}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                    >
                        <Sparkles size={16} /> AI Studio
                    </button>
                    <button
                        onClick={() => setActiveTab('queue')}
                        className={activeTab === 'queue' ? 'btn-primary' : 'btn-secondary'}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                    >
                        <Share2 size={16} /> Schedule & Logs
                    </button>
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                    >
                        <Zap size={16} /> Dashboard
                    </button>
                </nav>

                {/* Actions & Site Link */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <a
                        href="https://www.bytescraftstudio.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="btn-secondary"
                        style={{ fontSize: '0.85rem', padding: '0.5rem 0.9rem' }}
                    >
                        <Globe size={15} /> Website
                    </a>
                    <button
                        onClick={onOpenApiConfig}
                        className="btn-secondary"
                        style={{ fontSize: '0.85rem', padding: '0.5rem 0.9rem', borderColor: 'rgba(99, 102, 241, 0.4)' }}
                    >
                        <Settings size={15} color="#818cf8" /> API Settings
                    </button>
                </div>

            </div>
        </header>
    );
}
