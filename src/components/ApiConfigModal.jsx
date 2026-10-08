import React, { useState, useEffect } from 'react';
import { X, Key, ShieldCheck, Check, Info, Server } from 'lucide-react';
import { getApiConfig, saveApiConfig } from '../services/socialPublisher';

export default function ApiConfigModal({ isOpen, onClose }) {
    const [config, setConfig] = useState(getApiConfig());
    const [savedSuccess, setSavedSuccess] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setConfig(getApiConfig());
            setSavedSuccess(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (key, val) => {
        setConfig(prev => ({ ...prev, [key]: val }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        saveApiConfig(config);
        setSavedSuccess(true);
        setTimeout(() => {
            onClose();
        }, 1200);
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1.5rem'
        }}>
            <div className="glass-panel" style={{
                width: '100%',
                maxWidth: '580px',
                padding: '2rem',
                borderRadius: '20px',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                background: '#0B0F19',
                boxShadow: '0 20px 60px rgba(0,0,0,0.8)'
            }}>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>
                            <Key size={20} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Social API Credentials</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                Connect Meta Graph API (FB/IG) & LinkedIn Share API
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="btn-secondary" style={{ padding: '0.4rem', borderRadius: '50%' }}>
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                    {/* Note Box */}
                    <div style={{
                        background: 'rgba(6, 182, 212, 0.1)',
                        border: '1px solid rgba(6, 182, 212, 0.3)',
                        borderRadius: '12px',
                        padding: '0.85rem',
                        fontSize: '0.82rem',
                        color: '#22d3ee',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.5rem'
                    }}>
                        <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                            The system operates on an <strong>Autonomous Smart Fallback Mode</strong> out of the box! When you add your Meta or LinkedIn API keys below, it seamlessly switches to live social network posting.
                        </div>
                    </div>

                    {/* Meta Graph API (Facebook & Instagram) */}
                    <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem', background: 'rgba(255, 255, 255, 0.02)' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: '#1877F2' }}>
                            Meta Graph API (Facebook & Instagram)
                        </h4>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div>
                                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Meta Access Token (Page / User)</label>
                                <input
                                    type="password"
                                    value={config.metaAccessToken || ''}
                                    onChange={(e) => handleChange('metaAccessToken', e.target.value)}
                                    placeholder="EAAXXXX..."
                                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: '0.85rem' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Facebook Page ID</label>
                                    <input
                                        type="text"
                                        value={config.facebookPageId || ''}
                                        onChange={(e) => handleChange('facebookPageId', e.target.value)}
                                        placeholder="1000987..."
                                        style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: '0.85rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Instagram Account ID</label>
                                    <input
                                        type="text"
                                        value={config.instagramAccountId || ''}
                                        onChange={(e) => handleChange('instagramAccountId', e.target.value)}
                                        placeholder="178414..."
                                        style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: '0.85rem' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* LinkedIn API */}
                    <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem', background: 'rgba(255, 255, 255, 0.02)' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: '#0A66C2' }}>
                            LinkedIn Community API
                        </h4>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div>
                                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>LinkedIn OAuth Access Token</label>
                                <input
                                    type="password"
                                    value={config.linkedinAccessToken || ''}
                                    onChange={(e) => handleChange('linkedinAccessToken', e.target.value)}
                                    placeholder="AQVXXXX..."
                                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: '0.85rem' }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Organization ID (BytesCraft Studio)</label>
                                <input
                                    type="text"
                                    value={config.linkedinOrganizationId || ''}
                                    onChange={(e) => handleChange('linkedinOrganizationId', e.target.value)}
                                    placeholder="89765432"
                                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: '0.85rem' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '0.95rem', marginTop: '0.5rem' }}
                    >
                        {savedSuccess ? (
                            <>
                                <Check size={18} /> Settings Saved & Connected!
                            </>
                        ) : (
                            <>
                                <ShieldCheck size={18} /> Save & Apply Credentials
                            </>
                        )}
                    </button>

                </form>
            </div>
        </div>
    );
}
