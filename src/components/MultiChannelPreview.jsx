import React, { useState } from 'react';
import { Send, Calendar, CheckCircle2, Copy, ThumbsUp, MessageSquare, Share2, Heart, Bookmark } from 'lucide-react';
import confetti from 'canvas-confetti';
import { publishPostToPlatforms } from '../services/socialPublisher';

export default function MultiChannelPreview({ post, imageDataUrl, onPublishSuccess }) {
    const [activePlatform, setActivePlatform] = useState('linkedin');
    const [isPublishing, setIsPublishing] = useState(false);
    const [selectedPlatforms, setSelectedPlatforms] = useState(['facebook', 'instagram', 'linkedin']);

    if (!post) return null;

    const togglePlatform = (p) => {
        if (selectedPlatforms.includes(p)) {
            if (selectedPlatforms.length === 1) return; // keep at least one
            setSelectedPlatforms(selectedPlatforms.filter(x => x !== p));
        } else {
            setSelectedPlatforms([...selectedPlatforms, p]);
        }
    };

    const handlePublishNow = async () => {
        setIsPublishing(true);
        try {
            const res = await publishPostToPlatforms(post, selectedPlatforms, imageDataUrl);

            // Celebrate with confetti effect
            try {
                confetti({
                    particleCount: 80,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            } catch (e) { }

            if (onPublishSuccess) {
                onPublishSuccess(res.post);
            }
        } catch (e) {
            alert("Error publishing: " + e.message);
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Header & Platform Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                        Multi-Platform Social Live Preview
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Formatted specifically for each platform's algorithms & best practices.
                    </p>
                </div>

                {/* Platform View Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.25rem', borderRadius: '10px' }}>
                    <button
                        onClick={() => setActivePlatform('linkedin')}
                        style={{
                            padding: '0.4rem 0.8rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: activePlatform === 'linkedin' ? '#0A66C2' : 'transparent',
                            color: '#fff',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        LinkedIn
                    </button>
                    <button
                        onClick={() => setActivePlatform('instagram')}
                        style={{
                            padding: '0.4rem 0.8rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: activePlatform === 'instagram' ? '#E4405F' : 'transparent',
                            color: '#fff',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        Instagram
                    </button>
                    <button
                        onClick={() => setActivePlatform('facebook')}
                        style={{
                            padding: '0.4rem 0.8rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: activePlatform === 'facebook' ? '#1877F2' : 'transparent',
                            color: '#fff',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        Facebook
                    </button>
                </div>
            </div>

            {/* Realistic Card Mockup Container */}
            <div style={{ background: '#090D16', borderRadius: '16px', padding: '1.25rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>

                {/* Mock Header (Company Profile) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: 'var(--primary-gradient)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1rem',
                        color: '#fff'
                    }}>
                        BC
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            BytesCraft Studio
                            <CheckCircle2 size={15} color="#06B6D4" />
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {activePlatform === 'linkedin' && '12,450 followers • Promoted'}
                            {activePlatform === 'instagram' && 'bytescraftstudio • Original Audio'}
                            {activePlatform === 'facebook' && 'Software Development Company • Just now'}
                        </div>
                    </div>
                </div>

                {/* Text Post Copy */}
                <div style={{
                    whiteSpace: 'pre-line',
                    fontSize: '0.88rem',
                    lineHeight: 1.6,
                    color: '#E2E8F0',
                    marginBottom: '1rem',
                    maxHeight: '260px',
                    overflowY: 'auto'
                }}>
                    {post.platforms[activePlatform]?.text}
                </div>

                {/* Graphic Image Preview */}
                {imageDataUrl && (
                    <div style={{
                        borderRadius: '12px',
                        overflow: 'hidden',
                        marginBottom: '1rem',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        maxHeight: '340px'
                    }}>
                        <img src={imageDataUrl} alt="Visual Banner" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                )}

                {/* Platform Engagement Buttons */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    paddingTop: '0.75rem',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)'
                }}>
                    {activePlatform === 'linkedin' && (
                        <>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><ThumbsUp size={15} /> Like</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MessageSquare size={15} /> Comment</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Share2 size={15} /> Repost</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Send size={15} /> Send</span>
                        </>
                    )}
                    {activePlatform === 'instagram' && (
                        <>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <Heart size={18} color="#E4405F" />
                                <MessageSquare size={18} />
                                <Send size={18} />
                            </div>
                            <Bookmark size={18} />
                        </>
                    )}
                    {activePlatform === 'facebook' && (
                        <>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><ThumbsUp size={15} color="#1877F2" /> Like</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MessageSquare size={15} /> Comment</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Share2 size={15} /> Share</span>
                        </>
                    )}
                </div>

            </div>

            {/* Target Channels Checkboxes & Direct Publish Controls */}
            <div style={{
                background: 'rgba(99, 102, 241, 0.08)',
                padding: '1.25rem',
                borderRadius: '12px',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    Select Target Channels for Direct Auto-Posting:
                </div>

                <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                        <input
                            type="checkbox"
                            checked={selectedPlatforms.includes('linkedin')}
                            onChange={() => togglePlatform('linkedin')}
                            style={{ accentColor: '#0A66C2', width: '16px', height: '16px' }}
                        />
                        <span style={{ color: '#0A66C2', fontWeight: 600 }}>LinkedIn</span> (Org Page)
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                        <input
                            type="checkbox"
                            checked={selectedPlatforms.includes('instagram')}
                            onChange={() => togglePlatform('instagram')}
                            style={{ accentColor: '#E4405F', width: '16px', height: '16px' }}
                        />
                        <span style={{ color: '#E4405F', fontWeight: 600 }}>Instagram</span> (Business Feed)
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                        <input
                            type="checkbox"
                            checked={selectedPlatforms.includes('facebook')}
                            onChange={() => togglePlatform('facebook')}
                            style={{ accentColor: '#1877F2', width: '16px', height: '16px' }}
                        />
                        <span style={{ color: '#1877F2', fontWeight: 600 }}>Facebook</span> (Company Page)
                    </label>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    <button
                        onClick={handlePublishNow}
                        disabled={isPublishing}
                        className="btn-primary"
                        style={{ flex: 1, justifyContent: 'center', padding: '0.85rem' }}
                    >
                        {isPublishing ? (
                            'Publishing across selected networks...'
                        ) : (
                            <>
                                <Send size={18} /> Publish Now to {selectedPlatforms.length} Selected Platforms
                            </>
                        )}
                    </button>
                </div>
            </div>

        </div>
    );
}
