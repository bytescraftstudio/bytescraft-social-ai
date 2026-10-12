import React, { useRef, useEffect, useState } from 'react';
import { Download, Sparkles, Image as ImageIcon, LayoutList, Monitor } from 'lucide-react';
import { GRAPHIC_THEMES } from '../services/templates';

export default function GraphicCanvasDesigner({ config, onCanvasRendered }) {
    const canvasRef = useRef(null);
    const [layoutMode, setLayoutMode] = useState('infographic'); // 'infographic' (like screenshot) | 'cyber-banner'
    const [colorMode, setColorMode] = useState('light'); // 'light' (clean white like screenshot) | 'dark'

    useEffect(() => {
        if (!config || !canvasRef.current) return;
        renderCanvas();
    }, [config, layoutMode, colorMode]);

    const renderCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const width = 1080;
        const height = 1080;
        canvas.width = width;
        canvas.height = height;

        if (layoutMode === 'infographic') {
            renderInfographicLayout(ctx, width, height, config, colorMode);
        } else {
            renderCyberBannerLayout(ctx, width, height, config);
        }

        if (onCanvasRendered) {
            onCanvasRendered(canvas.toDataURL('image/png'));
        }
    };

    const handleDownload = () => {
        if (!canvasRef.current) return;
        const link = document.createElement('a');
        link.download = `bytescraft-${(config.title || 'post').toLowerCase().replace(/\s+/g, '-')}.png`;
        link.href = canvasRef.current.toDataURL('image/png');
        link.click();
    };

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ImageIcon size={18} color="#818cf8" />
                    <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Branded Graphic Designer (1080x1080)</h4>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '2px' }}>
                        <button
                            type="button"
                            onClick={() => setLayoutMode('infographic')}
                            style={{
                                padding: '0.35rem 0.65rem',
                                borderRadius: '8px',
                                border: 'none',
                                background: layoutMode === 'infographic' ? 'var(--primary-gradient)' : 'transparent',
                                color: '#fff',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.3rem'
                            }}
                        >
                            <LayoutList size={13} /> Infographic Steps
                        </button>
                        <button
                            type="button"
                            onClick={() => setLayoutMode('cyber-banner')}
                            style={{
                                padding: '0.35rem 0.65rem',
                                borderRadius: '8px',
                                border: 'none',
                                background: layoutMode === 'cyber-banner' ? 'var(--primary-gradient)' : 'transparent',
                                color: '#fff',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.3rem'
                            }}
                        >
                            <Monitor size={13} /> Cyber Banner
                        </button>
                    </div>

                    {layoutMode === 'infographic' && (
                        <button
                            type="button"
                            onClick={() => setColorMode(colorMode === 'light' ? 'dark' : 'light')}
                            className="btn-secondary"
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                        >
                            {colorMode === 'light' ? '🌙 Dark' : '☀️ Light'}
                        </button>
                    )}

                    <button onClick={handleDownload} className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                        <Download size={13} /> Download
                    </button>
                </div>
            </div>

            <div style={{
                width: '100%',
                maxWidth: '430px',
                aspectRatio: '1/1',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 15px 45px rgba(0,0,0,0.6)',
                border: '1px solid var(--border-subtle)',
                background: colorMode === 'light' && layoutMode === 'infographic' ? '#F8FAFC' : '#070913'
            }}>
                <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
            </div>
        </div>
    );
}

/**
 * 1. Infographic Stepped Roadmap Layout (Matches User Screenshot Style)
 */
function renderInfographicLayout(ctx, width, height, config, colorMode = 'light') {
    const isLight = colorMode === 'light';
    const bgColor = isLight ? '#FAFAF9' : '#0B0F19';
    const textMain = isLight ? '#0F172A' : '#F8FAFC';
    const textMuted = isLight ? '#64748B' : '#94A3B8';
    const cardBg = isLight ? '#FFFFFF' : 'rgba(30, 41, 59, 0.7)';
    const cardBorder = isLight ? '#E2E8F0' : 'rgba(255, 255, 255, 0.1)';
    const victoryBg = isLight ? '#ECFDF5' : 'rgba(16, 185, 129, 0.18)';
    const victoryBorder = isLight ? '#6EE7B7' : '#10B981';
    const victoryText = isLight ? '#059669' : '#34D399';
    const accentGreen = '#10B981';

    // 1. Background fill
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // 2. Subtle Watermark Background Code Elements
    ctx.save();
    ctx.fillStyle = isLight ? 'rgba(226, 232, 240, 0.65)' : 'rgba(255, 255, 255, 0.04)';
    ctx.font = '500 24px "Space Grotesk", monospace';
    ctx.fillText('function debug() {', 80, 240);
    ctx.fillText('  if (bug) {', 80, 280);
    ctx.fillText('    find();', 80, 320);
    ctx.fillText('    fix();', 80, 360);
    ctx.fillText('  }', 80, 400);
    ctx.fillText('}', 80, 440);

    // Subtle right side brackets & symbols
    ctx.font = '300 110px monospace';
    ctx.fillText('{', 880, 480);
    ctx.fillText('}', 880, 640);
    ctx.font = '600 60px monospace';
    ctx.fillText('</>', 80, 820);

    // Subtle grid dots
    const dotColor = isLight ? 'rgba(203, 213, 225, 0.45)' : 'rgba(255, 255, 255, 0.04)';
    ctx.fillStyle = dotColor;
    for (let dx = 820; dx <= 980; dx += 40) {
        for (let dy = 260; dy <= 380; dy += 40) {
            ctx.beginPath();
            ctx.arc(dx, dy, 3.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    ctx.restore();

    // 3. Header Section (Centered)
    const title = config.title || 'The 5 Stages of Software Debugging';
    const highlightWord = config.highlightWord || 'Debugging';

    ctx.textAlign = 'center';
    ctx.fillStyle = textMain;
    ctx.font = '800 58px "Space Grotesk", sans-serif';

    // Break title into lines (Line 1: "The 5 Stages of", Line 2: "Software Debugging")
    if (title.toLowerCase().includes('stages') || title.toLowerCase().includes('steps') || title.toLowerCase().includes('rules')) {
        const parts = title.split(/ of /i);
        if (parts.length > 1) {
            ctx.fillText(parts[0] + ' of', width / 2, 130);
            renderHighlightedTitleLine(ctx, parts[1], highlightWord, width / 2, 195, textMain, accentGreen);
        } else {
            renderHighlightedTitleLine(ctx, title, highlightWord, width / 2, 160, textMain, accentGreen);
        }
    } else {
        const lines = wrapText(ctx, title, 900);
        if (lines.length > 1) {
            ctx.fillText(lines[0], width / 2, 130);
            renderHighlightedTitleLine(ctx, lines[1], highlightWord, width / 2, 195, textMain, accentGreen);
        } else {
            renderHighlightedTitleLine(ctx, title, highlightWord, width / 2, 160, textMain, accentGreen);
        }
    }

    // 4. Stepped Cards Setup
    const stages = (config.stages && config.stages.length >= 3) ? config.stages : [
        { num: 1, title: 'Denial', icon: '😑', isFinal: false },
        { num: 2, title: 'Anger', icon: '😠', isFinal: false },
        { num: 3, title: 'Bargaining', icon: '🤝', isFinal: false },
        { num: 4, title: 'Despair', icon: '😞', isFinal: false },
        { num: 5, title: 'Victory', icon: '✅', isFinal: true }
    ];

    const cardWidth = 500;
    const cardHeight = 84;
    const cardGap = 20;
    const cardX = (width - cardWidth) / 2;
    const startY = 260;

    // 5. Vertical Connected Timeline Line (runs behind the number circles)
    const circleCenterX = cardX + 54;
    const lineStartY = startY + 42;
    const lineEndY = startY + (stages.length - 1) * (cardHeight + cardGap) + 42;

    ctx.strokeStyle = isLight ? '#CBD5E1' : '#334155';
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(circleCenterX, lineStartY);
    ctx.lineTo(circleCenterX, lineEndY);
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash

    // 6. Draw each Stage Card
    stages.forEach((stage, idx) => {
        const cy = startY + idx * (cardHeight + cardGap);
        const isVictory = stage.isFinal || idx === stages.length - 1;

        // Card Container Box
        ctx.save();
        if (isLight) {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.05)';
            ctx.shadowBlur = 16;
            ctx.shadowOffsetY = 6;
        } else {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
            ctx.shadowBlur = 20;
            ctx.shadowOffsetY = 8;
        }

        drawRoundRect(
            ctx,
            cardX,
            cy,
            cardWidth,
            cardHeight,
            18,
            isVictory ? victoryBg : cardBg,
            isVictory ? victoryBorder : cardBorder,
            isVictory ? 2.5 : 1.5
        );
        ctx.restore();

        // Left Number Circle
        const numCircleX = cardX + 54;
        const numCircleY = cy + 42;
        const numRadius = 26;

        ctx.beginPath();
        ctx.arc(numCircleX, numCircleY, numRadius, 0, Math.PI * 2);
        ctx.fillStyle = isVictory ? accentGreen : (isLight ? '#E2E8F0' : '#1E293B');
        ctx.fill();

        ctx.fillStyle = isVictory ? '#FFFFFF' : textMain;
        ctx.font = 'bold 26px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(stage.num || (idx + 1), numCircleX, numCircleY);

        // Stage Title Text
        ctx.textAlign = 'left';
        ctx.fillStyle = isVictory ? victoryText : textMain;
        ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(stage.title, cardX + 105, cy + 44);

        // Right Status Emoji / Icon Container
        const iconCircleX = cardX + cardWidth - 54;
        const iconCircleY = cy + 42;

        if (isVictory) {
            // Victory green checkmark circle
            ctx.beginPath();
            ctx.arc(iconCircleX, iconCircleY, 26, 0, Math.PI * 2);
            ctx.strokeStyle = accentGreen;
            ctx.lineWidth = 3.5;
            ctx.stroke();

            ctx.fillStyle = accentGreen;
            ctx.font = 'bold 26px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('✓', iconCircleX, iconCircleY + 1);
        } else {
            // Emotion icon/circle
            ctx.beginPath();
            ctx.arc(iconCircleX, iconCircleY, 26, 0, Math.PI * 2);
            ctx.strokeStyle = isLight ? '#94A3B8' : '#475569';
            ctx.lineWidth = 2.5;
            ctx.stroke();

            // Emoji / icon character
            ctx.font = '24px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(stage.icon || '•', iconCircleX, iconCircleY + 1);
        }
    });

    // 7. Official BytesCraft Studio Footer Logo
    const footerY = 960;

    // 3-Cube Brand Mark
    const logoCubeX = width / 2;
    const logoCubeY = footerY;
    const cSize = 16;
    const cGap = 5;

    // Top Left Cube (mint)
    drawRoundRect(ctx, logoCubeX - cSize - cGap / 2, logoCubeY - cSize - 8, cSize, cSize, 4, '#6EE7B7');
    // Top Right Cube (emerald)
    drawRoundRect(ctx, logoCubeX + cGap / 2, logoCubeY - cSize - 8, cSize, cSize, 4, '#34D399');
    // Bottom Center Cube (dark emerald)
    drawRoundRect(ctx, logoCubeX - cSize / 2, logoCubeY + 4 - 8, cSize, cSize, 4, '#059669');

    // Logo Text: BytesCraft Studio
    ctx.textAlign = 'center';
    ctx.font = 'bold 30px "Space Grotesk", sans-serif';
    ctx.fillStyle = textMain;
    const brandName = 'BytesCraft ';
    const brandStudio = 'Studio';
    const totalW = ctx.measureText(brandName + brandStudio).width;
    const startTextX = width / 2 - totalW / 2;

    ctx.textAlign = 'left';
    ctx.fillStyle = textMain;
    ctx.fillText(brandName, startTextX, footerY + 45);
    ctx.fillStyle = accentGreen;
    ctx.fillText(brandStudio, startTextX + ctx.measureText(brandName).width, footerY + 45);
}

/**
 * Helper to highlight a specific keyword in the title with vivid accent
 */
function renderHighlightedTitleLine(ctx, lineText, highlightWord, centerX, y, defaultColor, highlightColor) {
    if (!highlightWord || !lineText.toLowerCase().includes(highlightWord.toLowerCase())) {
        ctx.fillStyle = defaultColor;
        ctx.fillText(lineText, centerX, y);
        return;
    }

    const regex = new RegExp(`(${highlightWord})`, 'i');
    const parts = lineText.split(regex);

    // Measure total width
    let totalWidth = 0;
    parts.forEach(part => {
        totalWidth += ctx.measureText(part).width;
    });

    let currentX = centerX - totalWidth / 2;
    ctx.textAlign = 'left';

    parts.forEach(part => {
        if (part.toLowerCase() === highlightWord.toLowerCase()) {
            ctx.fillStyle = highlightColor;
        } else {
            ctx.fillStyle = defaultColor;
        }
        ctx.fillText(part, currentX, y);
        currentX += ctx.measureText(part).width;
    });
}

/**
 * 2. Original Cyber Banner Layout
 */
function renderCyberBannerLayout(ctx, width, height, config) {
    const themeObj = GRAPHIC_THEMES.find(t => t.id === config.theme) || GRAPHIC_THEMES[0];
    const colors = themeObj.bgGradient;

    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, colors[0]);
    bgGrad.addColorStop(0.5, colors[1]);
    bgGrad.addColorStop(1, colors[2]);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    drawGlowCircle(ctx, 200, 200, 300, config.accentColor || '#6366F1', 0.15);
    drawGlowCircle(ctx, 900, 900, 400, '#06B6D4', 0.12);

    const margin = 80;
    const cardW = width - margin * 2;
    const cardH = height - margin * 2;
    drawRoundRect(ctx, margin, margin, cardW, cardH, 32, 'rgba(15, 23, 42, 0.65)', 'rgba(255, 255, 255, 0.12)', 2);

    const brandX = margin + 50;
    const brandY = margin + 70;

    drawRoundRect(ctx, brandX, brandY, 60, 60, 16, config.accentColor || '#6366F1');
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('B', brandX + 20, brandY + 42);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px "Space Grotesk", sans-serif';
    ctx.fillText('BYTESCRAFT STUDIO', brandX + 80, brandY + 40);

    const titleY = margin + 220;
    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'bold 54px "Space Grotesk", sans-serif';
    const lines = wrapText(ctx, config.title || 'High-Speed Web Apps', cardW - 100);

    let currentY = titleY;
    lines.forEach(line => {
        ctx.fillText(line, brandX, currentY);
        currentY += 70;
    });

    currentY += 20;
    ctx.fillStyle = '#94A3B8';
    ctx.font = '400 30px "Plus Jakarta Sans", sans-serif';
    const subLines = wrapText(ctx, config.subtitle || 'Full-Stack Craftsmanship, Done Right.', cardW - 100);
    subLines.forEach(line => {
        ctx.fillText(line, brandX, currentY);
        currentY += 44;
    });

    const footerY = margin + cardH - 100;
    drawRoundRect(ctx, brandX, footerY, cardW - 100, 70, 16, 'rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.1)', 1);

    ctx.fillStyle = config.accentColor || '#38BDF8';
    ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('🌐 ' + (config.domain || 'www.bytescraftstudio.com'), brandX + 30, footerY + 44);

    ctx.fillStyle = '#F8FAFC';
    ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Custom Tech & AI Solutions', brandX + cardW - 380, footerY + 44);
}

function drawGlowCircle(ctx, x, y, r, color, alpha) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, 'transparent');
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function drawRoundRect(ctx, x, y, w, h, r, fill, stroke, strokeWidth = 1) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
    }
    if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = strokeWidth;
        ctx.stroke();
    }
}

function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + ' ' + word).width;
        if (width < maxWidth) {
            currentLine += ' ' + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}
