import React, { useRef, useEffect } from 'react';
import { Download, Sparkles, Image as ImageIcon } from 'lucide-react';
import { GRAPHIC_THEMES } from '../services/templates';

export default function GraphicCanvasDesigner({ config, onCanvasRendered }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!config || !canvasRef.current) return;
        renderCanvas();
    }, [config]);

    const renderCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Canvas size (1080x1080 HD social square)
        const width = 1080;
        const height = 1080;
        canvas.width = width;
        canvas.height = height;

        // Theme selection
        const themeObj = GRAPHIC_THEMES.find(t => t.id === config.theme) || GRAPHIC_THEMES[0];
        const colors = themeObj.bgGradient;

        // Background Gradient
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        bgGrad.addColorStop(0, colors[0]);
        bgGrad.addColorStop(0.5, colors[1]);
        bgGrad.addColorStop(1, colors[2]);
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Decorative Ambient Glowing Circles
        drawGlowCircle(ctx, 200, 200, 300, config.accentColor || '#6366F1', 0.15);
        drawGlowCircle(ctx, 900, 900, 400, '#06B6D4', 0.12);

        // Grid Pattern Backdrop (Subtle)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 60) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        for (let y = 0; y < height; y += 60) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Glass Card Center Container
        const margin = 80;
        const cardW = width - margin * 2;
        const cardH = height - margin * 2;
        drawRoundRect(ctx, margin, margin, cardW, cardH, 32, 'rgba(15, 23, 42, 0.65)', 'rgba(255, 255, 255, 0.12)', 2);

        // Top Brand Badge & Logo
        const brandX = margin + 50;
        const brandY = margin + 70;

        // Logo Icon Box
        drawRoundRect(ctx, brandX, brandY, 60, 60, 16, config.accentColor || '#6366F1');
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 30px sans-serif';
        ctx.fillText('B', brandX + 20, brandY + 42);

        // Brand Name Text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 32px "Space Grotesk", sans-serif';
        ctx.fillText('BYTESCRAFT STUDIO', brandX + 80, brandY + 40);

        // Badge Pill
        const categoryText = (config.category || 'Tech Service').toUpperCase();
        ctx.font = 'bold 20px "Space Grotesk", sans-serif';
        const catWidth = ctx.measureText(categoryText).width;
        const badgeX = cardW + margin - 50 - catWidth - 30;
        drawRoundRect(ctx, badgeX, brandY + 10, catWidth + 30, 40, 20, 'rgba(99, 102, 241, 0.25)', config.accentColor || '#6366F1', 1);
        ctx.fillStyle = config.accentColor || '#38BDF8';
        ctx.fillText(categoryText, badgeX + 15, brandY + 36);

        // Main Headline Title (Wrapped text)
        const titleY = margin + 220;
        ctx.fillStyle = '#F8FAFC';
        ctx.font = 'bold 54px "Space Grotesk", sans-serif';
        const lines = wrapText(ctx, config.title || 'High-Speed Web Apps', cardW - 100);

        let currentY = titleY;
        lines.forEach(line => {
            ctx.fillText(line, brandX, currentY);
            currentY += 70;
        });

        // Subtitle / Tagline Box
        currentY += 20;
        ctx.fillStyle = '#94A3B8';
        ctx.font = '400 30px "Plus Jakarta Sans", sans-serif';
        const subLines = wrapText(ctx, config.subtitle || 'Full-Stack Craftsmanship, Done Right.', cardW - 100);
        subLines.forEach(line => {
            ctx.fillText(line, brandX, currentY);
            currentY += 44;
        });

        // Bottom Call To Action Banner
        const footerY = margin + cardH - 100;
        drawRoundRect(ctx, brandX, footerY, cardW - 100, 70, 16, 'rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.1)', 1);

        ctx.fillStyle = config.accentColor || '#38BDF8';
        ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('🌐 ' + (config.domain || 'www.bytescraftstudio.com'), brandX + 30, footerY + 44);

        ctx.fillStyle = '#F8FAFC';
        ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('Custom Tech & AI Solutions', brandX + cardW - 380, footerY + 44);

        // Send rendered data URL to parent
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ImageIcon size={18} color="#818cf8" /> Branded Graphic Visual (1080x1080)
                </h4>
                <button onClick={handleDownload} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                    <Download size={14} /> Download Image
                </button>
            </div>

            <div style={{
                width: '100%',
                maxWidth: '420px',
                aspectRatio: '1/1',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
                border: '1px solid var(--border-subtle)',
                background: '#070913'
            }}>
                <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
            </div>
        </div>
    );
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
