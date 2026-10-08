import { BYTESCRAFT_SERVICES } from './templates';

/**
 * Autonomous Content Generator Engine for BytesCraft Studio
 */
export function generateSocialPostBundle({ serviceId, goalId, customPrompt, themeId = 'cyber-dark' }) {
    const service = BYTESCRAFT_SERVICES.find(s => s.id === serviceId) || BYTESCRAFT_SERVICES[0];

    // Base topic determination
    const topicTitle = customPrompt ? customPrompt : `${service.name}: Scalable Tech Solutions for Modern Startups`;

    // Script / Core Idea
    const scriptContent = generateCoreScript(service, goalId, topicTitle);

    // Platform Specific Copies
    const linkedinCopy = generateLinkedInCopy(service, scriptContent, topicTitle);
    const instagramCopy = generateInstagramCopy(service, scriptContent, topicTitle);
    const facebookCopy = generateFacebookCopy(service, scriptContent, topicTitle);

    // Optimized Hashtags & CTA
    const hashtags = generateHashtags(service, goalId);
    const callToAction = "🚀 Ready to build high-performance software? Let's talk: https://www.bytescraftstudio.com/";

    // Visual Graphic Configuration for Canvas Generator
    const graphicConfig = {
        title: topicTitle,
        subtitle: service.tagline,
        serviceName: service.name,
        category: service.category,
        badgeText: service.badge,
        theme: themeId,
        accentColor: service.accent,
        watermark: 'BYTESCRAFT STUDIO',
        domain: 'www.bytescraftstudio.com'
    };

    return {
        id: 'post-' + Date.now(),
        createdAt: new Date().toISOString(),
        service,
        goalId,
        topicTitle,
        scriptContent,
        graphicConfig,
        platforms: {
            linkedin: { text: `${linkedinCopy}\n\n${callToAction}\n\n${hashtags.linkedin.join(' ')}` },
            instagram: { text: `${instagramCopy}\n\n${callToAction}\n\n${hashtags.instagram.join(' ')}` },
            facebook: { text: `${facebookCopy}\n\n${callToAction}\n\n${hashtags.facebook.join(' ')}` }
        },
        hashtags,
        status: 'draft' // 'draft', 'scheduled', 'published'
    };
}

function generateCoreScript(service, goalId, topicTitle) {
    if (goalId === 'spotlight') {
        return `In 2026, slow software kills user acquisition. At BytesCraft Studio, our ${service.name} engineering ensures sub-second load times, modular architecture, and zero launch-day stress. We don't just write code — we engineer scalable digital assets designed for measurable business growth.`;
    } else if (goalId === 'case-study') {
        return `Client Transformation Highlight: A fast-growing tech startup needed to overhaul their legacy setup. By deploying BytesCraft's ${service.name} stack, we improved server response time by 4.2x, reduced bounce rates by 38%, and cut monthly cloud infrastructure spend by 25%.`;
    } else if (goalId === 'tech-insights') {
        return `Tech Tip from BytesCraft Engineers: When scaling ${service.name}, prioritize stateless backend architectures, smart edge caching, and modular components. Clean code today prevents expensive refactoring tomorrow.`;
    } else {
        return `Building a startup is hard; building buggy software shouldn't make it harder. BytesCraft Studio was built on full-stack craftsmanship. From ${service.keywords.slice(0, 3).join(', ')} to production rollout — we deliver digital products people actually love to use.`;
    }
}

function generateLinkedInCopy(service, script, topicTitle) {
    return `💡 ${topicTitle.toUpperCase()}

${script}

Key Takeaways for Founders & Tech Leaders:
✔ Full-stack engineering with ${service.keywords[0]} & ${service.keywords[1]}
✔ Built for maximum performance, security & infinite scalability
✔ Zero compromise on user experience and speed

At BytesCraft Studio, we help ambitious companies turn complex ideas into production-ready software.`;
}

function generateInstagramCopy(service, script, topicTitle) {
    return `⚡ ${topicTitle} ⚡

${script}

🔥 What we deliver:
👉 ${service.tagline}
👉 Production AI & Modern Architecture
👉 Clean UI/UX & High-Speed APIs

Drop a 💬 or DM us "BUILD" to discuss your next project!`;
}

function generateFacebookCopy(service, script, topicTitle) {
    return `🚀 ${topicTitle}

Looking for a trusted software development partner to scale your business? 

${script}

Our core engineering stack includes:
• ${service.name}
• ${service.tagline}
• Custom AI Workflows & Modern SaaS Architectures

Visit our studio or reach out today to get started!`;
}

function generateHashtags(service, goalId) {
    const base = ['#BytesCraftStudio', '#TechStartup', '#SoftwareEngineering', '#FullStackDev', '#Innovation'];
    const serviceTags = service.keywords.map(k => '#' + k.replace(/\s+/g, ''));

    return {
        linkedin: [...base, ...serviceTags, '#TechLeaders', '#WebDevelopment'].slice(0, 8),
        instagram: [...base, ...serviceTags, '#SoftwareHouse', '#AITools', '#WebDev', '#CoderLife', '#DevCommunity'].slice(0, 12),
        facebook: [...base, ...serviceTags, '#CustomSoftware', '#SoftwareCompany'].slice(0, 6)
    };
}
