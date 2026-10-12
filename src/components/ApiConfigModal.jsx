import React, { useState, useEffect } from 'react';
import { X, Key, ShieldCheck, Check, Info, Sparkles, BookOpen, ExternalLink, Eye, EyeOff, AlertCircle, CheckCircle2, RefreshCw, Lock, Shield } from 'lucide-react';
import { getApiConfig, saveApiConfig } from '../services/socialPublisher';
import { testGeminiApiKey } from '../services/aiGenerator';
import { setAdminPin, hasCustomPinConfigured } from '../services/authService';

export default function ApiConfigModal({ isOpen, onClose }) {
    const [config, setConfig] = useState(getApiConfig());
    const [savedSuccess, setSavedSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState('credentials'); // 'credentials' | 'guide' | 'security'
    const [showTokens, setShowTokens] = useState({});
    const [testingGemini, setTestingGemini] = useState(false);
    const [geminiTestResult, setGeminiTestResult] = useState(null);
    const [pinInput, setPinInput] = useState('');
    const [pinConfirm, setPinConfirm] = useState('');
    const [pinMessage, setPinMessage] = useState({ text: '', isError: false });

    useEffect(() => {
        if (isOpen) {
            setConfig(getApiConfig());
            setSavedSuccess(false);
            setGeminiTestResult(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (key, val) => {
        setConfig(prev => ({ ...prev, [key]: val }));
    };

    const toggleShowToken = (key) => {
        setShowTokens(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleTestGemini = async () => {
        if (!config.geminiApiKey || !config.geminiApiKey.trim()) {
            setGeminiTestResult({ success: false, message: 'Please enter a Gemini API Key first.' });
            return;
        }
        setTestingGemini(true);
        setGeminiTestResult(null);
        try {
            const res = await testGeminiApiKey(config.geminiApiKey, config.geminiModel || 'gemini-2.0-flash');
            if (res.success) {
                if (res.workingModel && res.workingModel !== config.geminiModel) {
                    handleChange('geminiModel', res.workingModel);
                }
                setGeminiTestResult({ success: true, message: res.message });
            } else {
                setGeminiTestResult({ success: false, message: res.error });
            }
        } catch (e) {
            setGeminiTestResult({ success: false, message: e.message });
        } finally {
            setTestingGemini(false);
        }
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
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1.5rem'
        }}>
            <div className="glass-panel" style={{
                width: '100%',
                maxWidth: '680px',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '2rem',
                borderRadius: '20px',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                background: '#0B0F19',
                boxShadow: '0 25px 70px rgba(0,0,0,0.9)'
            }}>

                {/* Modal Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>
                            <Key size={22} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>API Settings & Credentials</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                Configure Gemini AI (Script/Copy), Meta Graph API, and LinkedIn API
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="btn-secondary" style={{ padding: '0.4rem', borderRadius: '50%' }}>
                        <X size={18} />
                    </button>
                </div>

                {/* Navigation Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.3rem', borderRadius: '12px' }}>
                    <button
                        type="button"
                        onClick={() => setActiveTab('credentials')}
                        style={{
                            flex: 1,
                            padding: '0.55rem',
                            borderRadius: '9px',
                            border: 'none',
                            background: activeTab === 'credentials' ? 'var(--primary-gradient)' : 'transparent',
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.4rem'
                        }}
                    >
                        <Key size={15} /> Credentials & Keys
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('security')}
                        style={{
                            flex: 1,
                            padding: '0.55rem',
                            borderRadius: '9px',
                            border: 'none',
                            background: activeTab === 'security' ? 'var(--primary-gradient)' : 'transparent',
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.4rem'
                        }}
                    >
                        <Shield size={15} /> Admin Security PIN
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('guide')}
                        style={{
                            flex: 1,
                            padding: '0.55rem',
                            borderRadius: '9px',
                            border: 'none',
                            background: activeTab === 'guide' ? 'var(--primary-gradient)' : 'transparent',
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.4rem'
                        }}
                    >
                        <BookOpen size={15} /> Step-by-Step API Guide
                    </button>
                </div>

                {/* Tab 1: Credentials Form */}
                {activeTab === 'credentials' && (
                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                        {/* Section 1: Google Gemini AI API */}
                        <div style={{
                            border: '1px solid rgba(168, 85, 247, 0.4)',
                            borderRadius: '14px',
                            padding: '1.25rem',
                            background: 'rgba(168, 85, 247, 0.04)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Sparkles size={18} color="#c084fc" />
                                    <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#c084fc' }}>
                                        Google Gemini AI (Script & Content Engine)
                                    </h4>
                                </div>
                                <a
                                    href="https://aistudio.google.com/app/apikey"
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ fontSize: '0.75rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}
                                >
                                    Get Gemini API Key <ExternalLink size={12} />
                                </a>
                            </div>

                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                                Powers the AI script generation, platform copy tailoring, headlines, and graphic copywriting for BytesCraft Studio.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                                        Gemini API Key
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showTokens.gemini ? 'text' : 'password'}
                                            value={config.geminiApiKey || ''}
                                            onChange={(e) => handleChange('geminiApiKey', e.target.value)}
                                            placeholder="AIzaSy..."
                                            style={{
                                                width: '100%',
                                                padding: '0.65rem 2.5rem 0.65rem 0.85rem',
                                                borderRadius: '8px',
                                                background: 'rgba(0,0,0,0.5)',
                                                border: '1px solid rgba(168, 85, 247, 0.3)',
                                                color: '#fff',
                                                fontSize: '0.85rem'
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => toggleShowToken('gemini')}
                                            style={{
                                                position: 'absolute',
                                                right: '8px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'none',
                                                border: 'none',
                                                color: 'var(--text-muted)',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {showTokens.gemini ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem', alignItems: 'flex-end' }}>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                                            Model
                                        </label>
                                        <select
                                            value={config.geminiModel || 'gemini-2.0-flash'}
                                            onChange={(e) => handleChange('geminiModel', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.65rem 0.8rem',
                                                borderRadius: '8px',
                                                background: 'rgba(0,0,0,0.7)',
                                                border: '1px solid var(--border-subtle)',
                                                color: '#fff',
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            <option value="gemini-2.0-flash">gemini-2.0-flash (Recommended & Ultra Fast)</option>
                                            <option value="gemini-2.5-flash">gemini-2.5-flash (Next Generation)</option>
                                            <option value="gemini-2.0-flash-lite">gemini-2.0-flash-lite (Cost Efficient)</option>
                                            <option value="gemini-1.5-flash-latest">gemini-1.5-flash-latest</option>
                                            <option value="gemini-1.5-pro">gemini-1.5-pro (Deep Reasoning)</option>
                                        </select>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleTestGemini}
                                        disabled={testingGemini}
                                        style={{
                                            padding: '0.65rem 1rem',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(168, 85, 247, 0.4)',
                                            background: 'rgba(168, 85, 247, 0.15)',
                                            color: '#e9d5ff',
                                            fontSize: '0.85rem',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.4rem',
                                            height: '38px'
                                        }}
                                    >
                                        {testingGemini ? (
                                            <>
                                                <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> Testing...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles size={14} /> Test Key
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Test Result Banner */}
                                {geminiTestResult && (
                                    <div style={{
                                        padding: '0.6rem 0.85rem',
                                        borderRadius: '8px',
                                        fontSize: '0.8rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        background: geminiTestResult.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                        border: `1px solid ${geminiTestResult.success ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                                        color: geminiTestResult.success ? '#34d399' : '#f87171'
                                    }}>
                                        {geminiTestResult.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                        <span>{geminiTestResult.message}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Section 2: Meta Graph API (Facebook & Instagram) */}
                        <div style={{ border: '1px solid rgba(24, 119, 242, 0.3)', borderRadius: '14px', padding: '1.25rem', background: 'rgba(24, 119, 242, 0.03)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#1877F2' }}>
                                    Meta Graph API (Facebook Page & Instagram)
                                </h4>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    Meta for Developers
                                </span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                                        Meta Page Access Token (Long-Lived)
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showTokens.meta ? 'text' : 'password'}
                                            value={config.metaAccessToken || ''}
                                            onChange={(e) => handleChange('metaAccessToken', e.target.value)}
                                            placeholder="EAAXXXX..."
                                            style={{
                                                width: '100%',
                                                padding: '0.6rem 2.5rem 0.6rem 0.8rem',
                                                borderRadius: '8px',
                                                background: 'rgba(0,0,0,0.5)',
                                                border: '1px solid var(--border-subtle)',
                                                color: '#fff',
                                                fontSize: '0.85rem'
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => toggleShowToken('meta')}
                                            style={{
                                                position: 'absolute',
                                                right: '8px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'none',
                                                border: 'none',
                                                color: 'var(--text-muted)',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {showTokens.meta ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                                            Facebook Page ID
                                        </label>
                                        <input
                                            type="text"
                                            value={config.facebookPageId || ''}
                                            onChange={(e) => handleChange('facebookPageId', e.target.value)}
                                            placeholder="1000987..."
                                            style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: '0.85rem' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                                            Instagram Account ID
                                        </label>
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

                        {/* Section 3: LinkedIn API */}
                        <div style={{ border: '1px solid rgba(10, 102, 194, 0.3)', borderRadius: '14px', padding: '1.25rem', background: 'rgba(10, 102, 194, 0.03)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0A66C2' }}>
                                    LinkedIn Community & Organization API
                                </h4>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    LinkedIn Developers
                                </span>
                            </div>

                            {/* 1-Click Connect LinkedIn Button */}
                            <button
                                type="button"
                                onClick={() => {
                                    const clientId = config.linkedinClientId || '77d70wiqbu6mmk';
                                    const redirectUri = encodeURIComponent(window.location.origin + '/api/auth/linkedin-callback');
                                    const scope = encodeURIComponent('w_member_social openid profile');
                                    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
                                    window.open(authUrl, 'LinkedInAuth', 'width=600,height=700,left=200,top=100');
                                }}
                                style={{
                                    width: '100%',
                                    padding: '0.7rem',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(135deg, #0A66C2, #004182)',
                                    border: 'none',
                                    color: '#fff',
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    marginBottom: '0.75rem',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <ExternalLink size={16} /> Connect with LinkedIn (1-Click OAuth)
                            </button>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                                        LinkedIn OAuth Access Token
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showTokens.linkedin ? 'text' : 'password'}
                                            value={config.linkedinAccessToken || ''}
                                            onChange={(e) => handleChange('linkedinAccessToken', e.target.value)}
                                            placeholder="AQVXXXX..."
                                            style={{
                                                width: '100%',
                                                padding: '0.6rem 2.5rem 0.6rem 0.8rem',
                                                borderRadius: '8px',
                                                background: 'rgba(0,0,0,0.5)',
                                                border: '1px solid var(--border-subtle)',
                                                color: '#fff',
                                                fontSize: '0.85rem'
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => toggleShowToken('linkedin')}
                                            style={{
                                                position: 'absolute',
                                                right: '8px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'none',
                                                border: 'none',
                                                color: 'var(--text-muted)',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {showTokens.linkedin ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                                        LinkedIn Client ID
                                    </label>
                                    <input
                                        type="text"
                                        value={config.linkedinClientId || '77d70wiqbu6mmk'}
                                        onChange={(e) => handleChange('linkedinClientId', e.target.value)}
                                        placeholder="77d70wiqbu6mmk"
                                        style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: '0.85rem' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                                        BytesCraft Studio Organization ID (Company ID)
                                    </label>
                                    <input
                                        type="text"
                                        value={config.linkedinOrganizationId || ''}
                                        onChange={(e) => handleChange('linkedinOrganizationId', e.target.value)}
                                        placeholder="e.g. 10293847"
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
                                    <Check size={18} /> Settings & Keys Saved!
                                </>
                            ) : (
                                <>
                                    <ShieldCheck size={18} /> Save & Apply Credentials
                                </>
                            )}
                        </button>

                    </form>
                )}

                {/* Tab: Admin Security & PIN */}
                {activeTab === 'security' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{
                            background: 'rgba(99, 102, 241, 0.08)',
                            border: '1px solid rgba(99, 102, 241, 0.3)',
                            borderRadius: '14px',
                            padding: '1.25rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                                <ShieldCheck size={20} color="#818cf8" />
                                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#818cf8' }}>
                                    Admin Security & Access Lock
                                </h4>
                            </div>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
                                Protect your social media automation studio, connected accounts, and API keys. Whenever someone visits your site, they must enter your master PIN to access the studio.
                            </p>

                            <div style={{
                                background: 'rgba(0, 0, 0, 0.4)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: '10px',
                                padding: '0.85rem 1rem',
                                marginBottom: '1.25rem',
                                fontSize: '0.82rem',
                                color: '#e2e8f0'
                            }}>
                                <div>🔐 <strong>Status:</strong> {hasCustomPinConfigured() ? <span style={{ color: '#10b981' }}>Active (Custom Admin PIN Set)</span> : <span style={{ color: '#f59e0b' }}>Active (Default Master PIN: 8899)</span>}</div>
                                <div style={{ marginTop: '0.3rem', color: 'var(--text-muted)' }}>
                                    Tip: You can lock the studio anytime by clicking the <strong>"Lock"</strong> button in the top navigation bar.
                                </div>
                            </div>

                            {pinMessage.text && (
                                <div style={{
                                    background: pinMessage.isError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                    border: `1px solid ${pinMessage.isError ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
                                    color: pinMessage.isError ? '#fca5a5' : '#6ee7b7',
                                    padding: '0.65rem 1rem',
                                    borderRadius: '8px',
                                    fontSize: '0.85rem',
                                    marginBottom: '1rem'
                                }}>
                                    {pinMessage.text}
                                </div>
                            )}

                            <form onSubmit={(e) => {
                                e.preventDefault();
                                setPinMessage({ text: '', isError: false });
                                if (pinInput.length < 4) {
                                    setPinMessage({ text: 'PIN must be at least 4 digits!', isError: true });
                                    return;
                                }
                                if (pinInput !== pinConfirm) {
                                    setPinMessage({ text: 'PIN confirmation does not match!', isError: true });
                                    return;
                                }
                                try {
                                    setAdminPin(pinInput);
                                    setPinMessage({ text: 'Admin PIN updated successfully! 🎉', isError: false });
                                    setPinInput('');
                                    setPinConfirm('');
                                } catch (err) {
                                    setPinMessage({ text: err.message, isError: true });
                                }
                            }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                                            New 4-6 Digit Admin PIN:
                                        </label>
                                        <input
                                            type="password"
                                            value={pinInput}
                                            onChange={(e) => setPinInput(e.target.value)}
                                            placeholder="Enter new PIN"
                                            maxLength={8}
                                            style={{
                                                width: '100%',
                                                padding: '0.65rem 0.85rem',
                                                borderRadius: '8px',
                                                background: 'rgba(0,0,0,0.5)',
                                                border: '1px solid var(--border-subtle)',
                                                color: '#fff',
                                                fontSize: '0.9rem',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                                            Confirm New PIN:
                                        </label>
                                        <input
                                            type="password"
                                            value={pinConfirm}
                                            onChange={(e) => setPinConfirm(e.target.value)}
                                            placeholder="Re-type new PIN"
                                            maxLength={8}
                                            style={{
                                                width: '100%',
                                                padding: '0.65rem 0.85rem',
                                                borderRadius: '8px',
                                                background: 'rgba(0,0,0,0.5)',
                                                border: '1px solid var(--border-subtle)',
                                                color: '#fff',
                                                fontSize: '0.9rem',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn-primary"
                                    style={{ justifyContent: 'center', padding: '0.75rem 1.5rem' }}
                                >
                                    <Lock size={15} /> Update Admin PIN
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Tab 2: Step-by-Step API Guide */}
                {activeTab === 'guide' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.86rem', lineHeight: 1.6 }}>

                        {/* Gemini Guide */}
                        <div style={{ background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '12px', padding: '1rem' }}>
                            <h4 style={{ color: '#c084fc', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Sparkles size={16} /> 1. Google Gemini AI API (Script Writing)
                            </h4>
                            <ol style={{ paddingLeft: '1.2rem', margin: 0, color: '#e2e8f0' }}>
                                <li>Open <strong><a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>Google AI Studio</a></strong>.</li>
                                <li>Sign in with your Google account and click <strong>"Create API Key"</strong>.</li>
                                <li>Copy the key (starts with <code>AIzaSy...</code>) and paste it into the <strong>Gemini API Key</strong> field.</li>
                                <li>Gemini 1.5 Flash is 100% free with 15 requests/min and generous daily quota!</li>
                            </ol>
                        </div>

                        {/* Meta Guide */}
                        <div style={{ background: 'rgba(24, 119, 242, 0.08)', border: '1px solid rgba(24, 119, 242, 0.3)', borderRadius: '12px', padding: '1rem' }}>
                            <h4 style={{ color: '#60a5fa', fontWeight: 700, marginBottom: '0.5rem' }}>
                                2. Meta (Facebook & Instagram) API Credentials
                            </h4>
                            <p style={{ color: '#cbd5e1', marginBottom: '0.5rem' }}>
                                Meta requires 3 items for publishing:
                            </p>
                            <ul style={{ paddingLeft: '1.2rem', margin: '0 0 0.5rem 0', color: '#e2e8f0' }}>
                                <li>
                                    <strong>Facebook Page ID:</strong> Go to your Facebook Page &gt; <em>About</em> &gt; <em>Page Transparency</em>, or check the URL (it is the number).
                                </li>
                                <li>
                                    <strong>Instagram Account ID:</strong> Must be an Instagram <em>Business / Creator</em> account connected to your Facebook Page in Meta Business Suite.
                                </li>
                                <li>
                                    <strong>Long-Lived Page Access Token:</strong>
                                    <ol style={{ marginTop: '0.3rem', paddingLeft: '1.2rem' }}>
                                        <li>Visit <strong>developers.facebook.com</strong> &gt; Create App (Type: <em>Business</em>).</li>
                                        <li>Go to <strong>Tools &gt; Graph API Explorer</strong>.</li>
                                        <li>Add permissions: <code>pages_manage_posts</code>, <code>pages_read_engagement</code>, <code>instagram_basic</code>, <code>instagram_content_publish</code>.</li>
                                        <li>Under <strong>User or Page</strong>, select your Facebook Page to generate a Page Token.</li>
                                        <li>Use the Access Token Tool to exchange it for a <strong>Long-Lived (never-expiring) Page Token</strong>.</li>
                                    </ol>
                                </li>
                            </ul>
                        </div>

                        {/* LinkedIn Guide */}
                        <div style={{ background: 'rgba(10, 102, 194, 0.08)', border: '1px solid rgba(10, 102, 194, 0.3)', borderRadius: '12px', padding: '1rem' }}>
                            <h4 style={{ color: '#38bdf8', fontWeight: 700, marginBottom: '0.5rem' }}>
                                3. LinkedIn Community API Credentials
                            </h4>
                            <ul style={{ paddingLeft: '1.2rem', margin: 0, color: '#e2e8f0' }}>
                                <li>
                                    <strong>Organization ID:</strong> Open your BytesCraft LinkedIn Company Page in admin mode. The URL is <code>https://www.linkedin.com/company/&lt;ORGANIZATION_ID&gt;/admin/</code>. That number is your Organization ID!
                                </li>
                                <li>
                                    <strong>OAuth Access Token:</strong>
                                    <ol style={{ marginTop: '0.3rem', paddingLeft: '1.2rem' }}>
                                        <li>Go to <strong>developer.linkedin.com</strong> &gt; Create App.</li>
                                        <li>Under <em>Company</em>, link your BytesCraft Studio LinkedIn Page and verify ownership.</li>
                                        <li>Request access to <strong>"Share on LinkedIn"</strong> or <strong>"Community Management API"</strong>.</li>
                                        <li>Generate an OAuth 2.0 token with scopes: <code>w_organization_social</code> and <code>r_organization_social</code>.</li>
                                    </ol>
                                </li>
                            </ul>
                        </div>

                        <button
                            type="button"
                            onClick={() => setActiveTab('credentials')}
                            className="btn-primary"
                            style={{ justifyContent: 'center', padding: '0.75rem', marginTop: '0.5rem' }}
                        >
                            Back to Credentials Input
                        </button>

                    </div>
                )}

            </div>
        </div>
    );
}
