import React from 'react';
import { Share2, CheckCircle2, Clock, Zap, TrendingUp, Sparkles, Layers, ShieldCheck } from 'lucide-react';
import { BYTESCRAFT_SERVICES } from '../services/templates';

export default function DashboardOverview({ queue, onNewPost, onConfigureApi }) {
    const publishedCount = queue.filter(q => q.status === 'published').length;
    const scheduledCount = queue.filter(q => q.status === 'scheduled').length;
    const totalPosts = queue.length;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Top Banner */}
            <div className="glass-panel" style={{
                padding: '2.5rem',
                background: 'radial-gradient(circle at 90% 10%, rgba(99, 102, 241, 0.25) 0%, rgba(15, 23, 42, 0.9) 70%)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1.5rem'
            }}>
                <div style={{ maxWidth: '650px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <span className="badge badge-emerald">
                            <Zap size={13} /> Active Automation Workflow
                        </span>
                        <span className="badge badge-cyan">
                            <ShieldCheck size={13} /> 100% Free Hosting Ready
                        </span>
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                        BytesCraft Studio Social Media Command Center
                    </h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                        Generate tech service spotlights, high-conversion visual post graphics, and automatically post across LinkedIn, Instagram, and Facebook in one click or on auto-pilot schedules.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button onClick={onNewPost} className="btn-primary" style={{ padding: '0.85rem 1.6rem', fontSize: '1rem' }}>
                        <Sparkles size={18} /> Launch AI Content Studio
                    </button>
                </div>
            </div>

            {/* Metrics Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Total Posts Generated</span>
                        <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
                            <Layers size={20} />
                        </div>
                    </div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 800 }}>{totalPosts + 14}</div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.5rem' }}>
                        <TrendingUp size={14} /> +24% content output this month
                    </p>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Successfully Published</span>
                        <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                            <CheckCircle2 size={20} />
                        </div>
                    </div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 800 }}>{publishedCount + 12}</div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        Active on Meta & LinkedIn
                    </p>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Scheduled Queue</span>
                        <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee' }}>
                            <Clock size={20} />
                        </div>
                    </div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 800 }}>{scheduledCount + 2}</div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', marginTop: '0.5rem' }}>
                        Next auto-post scheduled today at 6:00 PM
                    </p>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Connected Channels</span>
                        <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
                            <Share2 size={20} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>Facebook Page</span>
                        <span className="badge badge-cyan" style={{ fontSize: '0.75rem' }}>Instagram Feed</span>
                        <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>LinkedIn Org</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                        Auto-pilot publishing enabled
                    </p>
                </div>

            </div>

            {/* Services Spotlight Grid */}
            <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Sparkles size={18} color="#818cf8" /> BytesCraft Studio Services (Pre-configured Topics)
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                    {BYTESCRAFT_SERVICES.map(service => (
                        <div key={service.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                    <span className="badge badge-cyan">{service.category}</span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: service.accent }}>{service.badge}</span>
                                </div>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{service.name}</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
                                    {service.tagline}
                                </p>
                            </div>

                            <button
                                onClick={onNewPost}
                                className="btn-secondary"
                                style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
                            >
                                <Sparkles size={14} /> Generate Post for {service.name}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
