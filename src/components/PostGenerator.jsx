import React, { useState } from 'react';
import { Sparkles, Wand2, RefreshCw, Palette, Layers, Target, FileText } from 'lucide-react';
import { BYTESCRAFT_SERVICES, GRAPHIC_THEMES, CONTENT_GOALS } from '../services/templates';

export default function PostGenerator({ onGenerate, isGenerating }) {
    const [selectedService, setSelectedService] = useState(BYTESCRAFT_SERVICES[0].id);
    const [selectedGoal, setSelectedGoal] = useState(CONTENT_GOALS[0].id);
    const [selectedTheme, setSelectedTheme] = useState(GRAPHIC_THEMES[0].id);
    const [customPrompt, setCustomPrompt] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onGenerate({
            serviceId: selectedService,
            goalId: selectedGoal,
            themeId: selectedTheme,
            customPrompt: customPrompt.trim()
        });
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'var(--primary-gradient)', color: '#fff' }}>
                    <Wand2 size={20} />
                </div>
                <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>AI Post & Script Creator</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Select BytesCraft service spotlight or enter custom prompt for auto-generation.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Step 1: Select Service */}
                <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                        <Layers size={16} color="#818cf8" /> Select Service / Focus Area
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                        {BYTESCRAFT_SERVICES.map(s => (
                            <button
                                key={s.id}
                                type="button"
                                onClick={() => setSelectedService(s.id)}
                                style={{
                                    padding: '0.75rem',
                                    borderRadius: '12px',
                                    background: selectedService === s.id ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                                    border: `1px solid ${selectedService === s.id ? '#6366f1' : 'rgba(255, 255, 255, 0.08)'}`,
                                    color: selectedService === s.id ? '#fff' : 'var(--text-muted)',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    fontWeight: selectedService === s.id ? 700 : 500,
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '0.2rem' }}>{s.category}</div>
                                <div>{s.name}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Step 2: Select Content Goal */}
                <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                        <Target size={16} color="#22d3ee" /> Content Strategy Goal
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                        {CONTENT_GOALS.map(g => (
                            <button
                                key={g.id}
                                type="button"
                                onClick={() => setSelectedGoal(g.id)}
                                style={{
                                    padding: '0.75rem',
                                    borderRadius: '12px',
                                    background: selectedGoal === g.id ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                                    border: `1px solid ${selectedGoal === g.id ? '#06b6d4' : 'rgba(255, 255, 255, 0.08)'}`,
                                    color: selectedGoal === g.id ? '#fff' : 'var(--text-muted)',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <div style={{ fontWeight: 600 }}>{g.name}</div>
                                <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.2rem' }}>{g.description}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Step 3: Visual Theme */}
                <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                        <Palette size={16} color="#c084fc" /> Graphic Style Theme
                    </label>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {GRAPHIC_THEMES.map(t => (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => setSelectedTheme(t.id)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '10px',
                                    background: selectedTheme === t.id ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                                    border: `1px solid ${selectedTheme === t.id ? '#a855f7' : 'rgba(255, 255, 255, 0.08)'}`,
                                    color: selectedTheme === t.id ? '#fff' : 'var(--text-muted)',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <span style={{
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    background: t.accentColor,
                                    display: 'inline-block'
                                }} />
                                {t.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Optional Custom Topic Prompt */}
                <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                        <FileText size={16} color="#34d399" /> Custom Headline / Topic (Optional)
                    </label>
                    <input
                        type="text"
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder="e.g. Why Next.js 15 is a game-changer for BytesCraft clients..."
                        style={{
                            width: '100%',
                            padding: '0.85rem 1rem',
                            borderRadius: '12px',
                            background: 'rgba(0, 0, 0, 0.4)',
                            border: '1px solid var(--border-subtle)',
                            color: '#fff',
                            fontSize: '0.9rem',
                            outline: 'none'
                        }}
                    />
                </div>

                {/* Generate Button */}
                <button
                    type="submit"
                    disabled={isGenerating}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1.05rem', marginTop: '0.5rem' }}
                >
                    {isGenerating ? (
                        <>
                            <RefreshCw size={20} className="spin" style={{ animation: 'spin 1s linear infinite' }} /> Synthesizing Script & Visual Banners...
                        </>
                    ) : (
                        <>
                            <Sparkles size={20} /> Generate Post & Visual Graphics
                        </>
                    )}
                </button>

            </form>
        </div>
    );
}
