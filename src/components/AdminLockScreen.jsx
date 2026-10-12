import React, { useState } from 'react';
import { Shield, ShieldAlert, Lock, Unlock, KeyRound, Eye, EyeOff, Bot, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import { loginSession, setAdminPin, hasCustomPinConfigured } from '../services/authService';

export default function AdminLockScreen({ onUnlock }) {
    const [pin, setPin] = useState('');
    const [showPin, setShowPin] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [isShaking, setIsShaking] = useState(false);
    const [isSettingMode, setIsSettingMode] = useState(!hasCustomPinConfigured());
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [setupSuccess, setSetupSuccess] = useState('');

    const triggerShake = () => {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
    };

    const handleUnlock = (e) => {
        if (e) e.preventDefault();
        setErrorMsg('');

        if (!pin.trim()) {
            setErrorMsg('Please enter your Admin PIN');
            triggerShake();
            return;
        }

        const res = loginSession(pin.trim(), rememberMe);
        if (res.success) {
            onUnlock();
        } else {
            setErrorMsg('Incorrect PIN! Try again or use master PIN 8899');
            triggerShake();
            setPin('');
        }
    };

    const handleCreateCustomPin = (e) => {
        if (e) e.preventDefault();
        setErrorMsg('');

        if (newPin.length < 4) {
            setErrorMsg('PIN must be at least 4 digits');
            triggerShake();
            return;
        }
        if (newPin !== confirmPin) {
            setErrorMsg('PINs do not match');
            triggerShake();
            return;
        }

        try {
            setAdminPin(newPin);
            loginSession(newPin, rememberMe);
            setSetupSuccess('Custom PIN set successfully!');
            setTimeout(() => {
                onUnlock();
            }, 600);
        } catch (err) {
            setErrorMsg(err.message);
            triggerShake();
        }
    };

    const handleKeypadPress = (val) => {
        setErrorMsg('');
        if (isSettingMode) {
            if (val === 'C') {
                setNewPin('');
                setConfirmPin('');
            } else if (val === 'DEL') {
                if (confirmPin.length > 0) {
                    setConfirmPin(prev => prev.slice(0, -1));
                } else {
                    setNewPin(prev => prev.slice(0, -1));
                }
            } else {
                if (newPin.length < 6) {
                    setNewPin(prev => prev + val);
                } else if (confirmPin.length < 6) {
                    setConfirmPin(prev => prev + val);
                }
            }
        } else {
            if (val === 'C') {
                setPin('');
            } else if (val === 'DEL') {
                setPin(prev => prev.slice(0, -1));
            } else {
                if (pin.length < 10) {
                    setPin(prev => prev + val);
                }
            }
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            position: 'relative',
            zIndex: 9999
        }}>
            {/* Background glowing orbs */}
            <div style={{
                position: 'fixed',
                top: '20%',
                left: '25%',
                width: '350px',
                height: '350px',
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
                filter: 'blur(50px)',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'fixed',
                bottom: '20%',
                right: '25%',
                width: '350px',
                height: '350px',
                background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
                filter: 'blur(50px)',
                pointerEvents: 'none'
            }} />

            <div
                className="glass-panel"
                style={{
                    width: '100%',
                    maxWidth: '430px',
                    padding: '2.5rem 2rem',
                    borderRadius: '24px',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 35px rgba(99, 102, 241, 0.2)',
                    textAlign: 'center',
                    animation: isShaking ? 'shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both' : 'none'
                }}
            >
                {/* Brand Header */}
                <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '18px',
                    background: 'var(--primary-gradient)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                    boxShadow: '0 0 30px rgba(99, 102, 241, 0.5)'
                }}>
                    <Lock size={30} color="#fff" />
                </div>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }} className="text-gradient">
                        BytesCraft Social AI
                    </h2>
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
                    {isSettingMode
                        ? 'Set a Master PIN to protect your accounts and API keys'
                        : 'Admin Security Lock: Enter PIN to access studio'}
                </p>

                {errorMsg && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        color: '#fca5a5',
                        padding: '0.65rem 1rem',
                        borderRadius: '10px',
                        fontSize: '0.85rem',
                        marginBottom: '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                    }}>
                        <ShieldAlert size={16} />
                        {errorMsg}
                    </div>
                )}

                {setupSuccess && (
                    <div style={{
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                        color: '#6ee7b7',
                        padding: '0.65rem 1rem',
                        borderRadius: '10px',
                        fontSize: '0.85rem',
                        marginBottom: '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                    }}>
                        <CheckCircle size={16} />
                        {setupSuccess}
                    </div>
                )}

                {!isSettingMode ? (
                    /* UNLOCK MODE */
                    <form onSubmit={handleUnlock}>
                        <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                            <input
                                type={showPin ? 'text' : 'password'}
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                placeholder="Enter 4-6 digit PIN"
                                autoFocus
                                maxLength={12}
                                style={{
                                    width: '100%',
                                    padding: '0.85rem 3rem 0.85rem 1.25rem',
                                    fontSize: '1.25rem',
                                    letterSpacing: showPin ? '0.1em' : '0.25em',
                                    textAlign: 'center',
                                    background: 'rgba(0, 0, 0, 0.4)',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: '14px',
                                    color: '#fff',
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                    boxSizing: 'border-box'
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPin(!showPin)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* Quick NumPad Buttons */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '0.5rem',
                            marginBottom: '1.25rem'
                        }}>
                            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'DEL'].map((btn) => (
                                <button
                                    key={btn}
                                    type="button"
                                    onClick={() => handleKeypadPress(btn)}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.04)',
                                        border: '1px solid var(--border-subtle)',
                                        color: btn === 'C' ? '#f87171' : btn === 'DEL' ? '#94a3b8' : '#f8fafc',
                                        fontSize: btn === 'DEL' ? '0.8rem' : '1.15rem',
                                        fontWeight: 600,
                                        padding: '0.65rem 0',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        transition: 'all 0.15s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'}
                                >
                                    {btn === 'DEL' ? '⌫' : btn}
                                </button>
                            ))}
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '1.25rem',
                            fontSize: '0.82rem',
                            color: 'var(--text-muted)'
                        }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    style={{ accentColor: '#6366f1' }}
                                />
                                Remember this browser (7 days)
                            </label>
                            <button
                                type="button"
                                onClick={() => { setIsSettingMode(true); setErrorMsg(''); }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#818cf8',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                    fontSize: '0.8rem'
                                }}
                            >
                                Change PIN
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
                        >
                            <Unlock size={18} /> Unlock Studio
                        </button>

                        <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            🔒 Default Master PIN: <strong style={{ color: '#818cf8' }}>8899</strong> (you can change it anytime)
                        </div>
                    </form>
                ) : (
                    /* SETUP / CHANGE PIN MODE */
                    <form onSubmit={handleCreateCustomPin}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '1.25rem' }}>
                            <div style={{ textAlign: 'left' }}>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>
                                    New 4-6 Digit Admin PIN:
                                </label>
                                <input
                                    type="password"
                                    value={newPin}
                                    onChange={(e) => setNewPin(e.target.value)}
                                    placeholder="e.g. 1234 or 8899"
                                    maxLength={8}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        fontSize: '1rem',
                                        background: 'rgba(0, 0, 0, 0.4)',
                                        border: '1px solid var(--border-subtle)',
                                        borderRadius: '12px',
                                        color: '#fff',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div style={{ textAlign: 'left' }}>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>
                                    Confirm New PIN:
                                </label>
                                <input
                                    type="password"
                                    value={confirmPin}
                                    onChange={(e) => setConfirmPin(e.target.value)}
                                    placeholder="Re-type PIN"
                                    maxLength={8}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        fontSize: '1rem',
                                        background: 'rgba(0, 0, 0, 0.4)',
                                        border: '1px solid var(--border-subtle)',
                                        borderRadius: '12px',
                                        color: '#fff',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            {hasCustomPinConfigured() && (
                                <button
                                    type="button"
                                    onClick={() => { setIsSettingMode(false); setErrorMsg(''); }}
                                    className="btn-secondary"
                                    style={{ flex: 1, justifyContent: 'center' }}
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                className="btn-primary"
                                style={{ flex: 2, justifyContent: 'center' }}
                            >
                                <Shield size={16} /> Save & Unlock
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <style>{`
                @keyframes shake {
                    10%, 90% { transform: translate3d(-1px, 0, 0); }
                    20%, 80% { transform: translate3d(2px, 0, 0); }
                    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                    40%, 60% { transform: translate3d(4px, 0, 0); }
                }
            `}</style>
        </div>
    );
}
