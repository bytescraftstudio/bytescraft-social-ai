import React from 'react';
import { Calendar, Clock, CheckCircle2, Share2, Trash2, Zap, Play } from 'lucide-react';

export default function SchedulerQueue({ queue, onPublishItem, onDeleteItem }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Header Info */}
            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={20} color="#818cf8" /> Auto-Pilot Content Calendar & Queue
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Review pending scheduled posts, view publish timestamps, and track platform logs.
                    </p>
                </div>
                <span className="badge badge-emerald">
                    <Zap size={14} /> Cron Auto-Publishing Active
                </span>
            </div>

            {/* Queue List */}
            {queue.length === 0 ? (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                    <Clock size={40} color="#94a3b8" style={{ marginBottom: '1rem' }} />
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>No Posts in Queue Yet</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Generate your first post using the AI Studio tab to populate the scheduler!
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {queue.map(item => (
                        <div key={item.id} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {item.status === 'published' ? (
                                        <span className="badge badge-emerald"><CheckCircle2 size={13} /> Published</span>
                                    ) : (
                                        <span className="badge badge-cyan"><Clock size={13} /> Scheduled</span>
                                    )}
                                    <span className="badge badge-purple">{item.service?.name}</span>
                                </div>

                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    Created: {new Date(item.createdAt).toLocaleString()}
                                </div>
                            </div>

                            {/* Title & Content Snippet */}
                            <div>
                                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem' }}>{item.topicTitle}</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, maxHeight: '60px', overflow: 'hidden' }}>
                                    {item.scriptContent}
                                </p>
                            </div>

                            {/* Target Platforms */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    <Share2 size={15} /> Targeted:
                                    <span style={{ color: '#0A66C2', fontWeight: 600 }}>LinkedIn</span> •
                                    <span style={{ color: '#E4405F', fontWeight: 600 }}>Instagram</span> •
                                    <span style={{ color: '#1877F2', fontWeight: 600 }}>Facebook</span>
                                </div>

                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {item.status !== 'published' && (
                                        <button
                                            onClick={() => onPublishItem(item)}
                                            className="btn-primary"
                                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                        >
                                            <Play size={13} /> Publish Now
                                        </button>
                                    )}
                                    <button
                                        onClick={() => onDeleteItem(item.id)}
                                        className="btn-secondary"
                                        style={{ padding: '0.4rem 0.6rem', color: '#f87171', borderColor: 'rgba(248, 113, 113, 0.2)' }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}
