import { BYTESCRAFT_SERVICES } from './templates';
import { getApiConfig } from './socialPublisher';

/**
 * Autonomous Content Generator Engine for BytesCraft Studio
 * Supports Google Gemini AI (1.5 Flash / 2.0 Flash / Pro) with seamless fallback
 */

export async function generateSocialPostBundle({ serviceId, goalId, customPrompt, sourceData, themeId = 'cyber-dark' }) {
    const config = getApiConfig();
    const service = BYTESCRAFT_SERVICES.find(s => s.id === serviceId) || BYTESCRAFT_SERVICES[0];

    // If user provided a Gemini API Key, generate with Google Gemini
    if (config.geminiApiKey && config.geminiApiKey.trim()) {
        try {
            const geminiResult = await generateWithGemini({
                apiKey: config.geminiApiKey.trim(),
                model: config.geminiModel || 'gemini-1.5-flash',
                service,
                goalId,
                customPrompt,
                sourceData,
                themeId
            });
            if (geminiResult) {
                return geminiResult;
            }
        } catch (err) {
            console.warn('[Gemini AI] Call failed, switching to smart fallback template:', err.message);
        }
    }

    // Fallback: Built-in high performance template generator
    return generateFallbackSocialPostBundle({ serviceId, goalId, customPrompt, themeId });
}

/**
 * Direct Google Gemini REST API Generator
 */
async function generateWithGemini({ apiKey, model, service, goalId, customPrompt, sourceData, themeId }) {
    const topicInstruction = customPrompt && customPrompt.trim()
        ? `Focus Topic: "${customPrompt.trim()}"`
        : `Focus Service: "${service.name}" (${service.tagline})`;

    const sourceDataInstruction = sourceData && sourceData.trim()
        ? `Source Data / Reference Material to Process:\n"""\n${sourceData.trim()}\n"""\nIMPORTANT: Extract key insights from the Source Data provided above and use them as the primary context for the post content.`
        : '';

    const promptText = `
You are the Lead Content Strategist and Tech Evangelist for BytesCraft Studio (https://www.bytescraftstudio.com).
BytesCraft Studio is a top-tier software engineering agency specializing in high-speed web apps, mobile apps, practical AI workflows, SaaS platforms, UI/UX, and cloud infrastructure.

Target Service: ${service.name} (${service.category})
Tagline: ${service.tagline}
Key Tech: ${service.keywords.join(', ')}
Strategy Goal: ${goalId}
${topicInstruction}

${sourceDataInstruction}

Generate a viral, authoritative, high-conversion multi-channel social media post bundle.
You MUST respond with valid JSON matching EXACTLY this structure (do not wrap in markdown or anything else):
{
  "topicTitle": "Crisp headline (6 to 10 words)",
  "scriptContent": "Core narrative script or technical hook explaining why BytesCraft Studio delivers superior engineering (3-4 punchy sentences)",
  "linkedinCopy": "Full professional LinkedIn post with hook, bullet points of technical takeaways/ROI, and strong business CTA",
  "instagramCopy": "Full Instagram caption with eye-catching emojis, bullet highlights, and engaging call-to-action",
  "facebookCopy": "Full Facebook post formatted for business decision makers and founders",
  "hashtags": {
    "linkedin": ["#BytesCraftStudio", "#SoftwareEngineering", "#WebDev", "#TechLeaders"],
    "instagram": ["#BytesCraftStudio", "#CodingLife", "#FullStack", "#DevCommunity", "#TechStartup"],
    "facebook": ["#BytesCraftStudio", "#CustomSoftware", "#SoftwareCompany"]
  },
  "graphicTitle": "Short title for banner graphic (max 4 words)",
  "graphicSubtitle": "Short subheader for banner graphic (max 7 words)",
  "badgeText": "Short badge tag (e.g. HIGH PERFORMANCE, CLOUD SCALING, AI AGENTS)"
}
`;

    const candidateModels = [
        model || 'gemini-2.0-flash',
        'gemini-2.0-flash',
        'gemini-2.5-flash',
        'gemini-2.0-flash-lite',
        'gemini-1.5-flash-latest'
    ].filter((m, idx, arr) => m && arr.indexOf(m) === idx);

    let candidateText = null;
    let lastErrorMsg = '';

    for (const activeModel of candidateModels) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${activeModel}:generateContent?key=${apiKey}`;
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: promptText }] }],
                    generationConfig: {
                        temperature: 0.7,
                        responseMimeType: 'application/json'
                    }
                })
            });

            if (res.ok) {
                const data = await res.json();
                candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (candidateText) {
                    model = activeModel;
                    break;
                }
            } else {
                const errorData = await res.json().catch(() => ({}));
                lastErrorMsg = errorData.error?.message || `Gemini status ${res.status}`;
            }
        } catch (e) {
            lastErrorMsg = e.message;
        }
    }

    if (!candidateText) {
        throw new Error(lastErrorMsg || 'No content received from Gemini API');
    }

    const parsed = parseGeminiJson(candidateText);
    const callToAction = "🚀 Ready to build high-performance software? Let's talk: https://www.bytescraftstudio.com/";

    const topicTitle = parsed.topicTitle || (customPrompt ? customPrompt : `${service.name}: Scalable Tech Solutions`);
    const graphicConfig = {
        title: parsed.graphicTitle || topicTitle,
        subtitle: parsed.graphicSubtitle || service.tagline,
        serviceName: service.name,
        category: service.category,
        badgeText: parsed.badgeText || service.badge,
        theme: themeId,
        accentColor: service.accent,
        watermark: 'BYTESCRAFT STUDIO',
        domain: 'www.bytescraftstudio.com'
    };

    const linkedinTags = (parsed.hashtags?.linkedin || ['#BytesCraftStudio', '#SoftwareEngineering']).join(' ');
    const instagramTags = (parsed.hashtags?.instagram || ['#BytesCraftStudio', '#AITools', '#WebDev']).join(' ');
    const facebookTags = (parsed.hashtags?.facebook || ['#BytesCraftStudio', '#TechInnovation']).join(' ');

    return {
        id: 'post-' + Date.now(),
        createdAt: new Date().toISOString(),
        service,
        goalId,
        topicTitle,
        scriptContent: parsed.scriptContent || '',
        graphicConfig,
        platforms: {
            linkedin: { text: `${parsed.linkedinCopy}\n\n${callToAction}\n\n${linkedinTags}` },
            instagram: { text: `${parsed.instagramCopy}\n\n${callToAction}\n\n${instagramTags}` },
            facebook: { text: `${parsed.facebookCopy}\n\n${callToAction}\n\n${facebookTags}` }
        },
        hashtags: parsed.hashtags || { linkedin: [], instagram: [], facebook: [] },
        aiEngine: `Gemini (${model})`,
        status: 'draft'
    };
}

/**
 * Test a Gemini API key
 */
export async function testGeminiApiKey(apiKey, requestedModel = 'gemini-2.0-flash') {
    if (!apiKey || !apiKey.trim()) {
        return { success: false, error: 'API key is empty' };
    }

    const cleanKey = apiKey.trim();
    const candidateModels = [
        requestedModel,
        'gemini-2.0-flash',
        'gemini-2.5-flash',
        'gemini-2.0-flash-lite',
        'gemini-1.5-flash-latest'
    ].filter((m, i, arr) => m && arr.indexOf(m) === i);

    let lastError = '';

    for (const model of candidateModels) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cleanKey}`;
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: 'Ping. Respond with valid JSON: {"status": "ok"}' }] }],
                    generationConfig: { responseMimeType: 'application/json' }
                })
            });

            if (res.ok) {
                return {
                    success: true,
                    workingModel: model,
                    message: `Successfully connected to Gemini API (${model})!`
                };
            }

            const data = await res.json().catch(() => ({}));
            lastError = data.error?.message || `HTTP ${res.status}: ${res.statusText}`;
        } catch (err) {
            lastError = err.message || 'Network connection failed';
        }
    }

    return { success: false, error: lastError };
}

/**
 * Built-in fallback template generator
 */
export function generateFallbackSocialPostBundle({ serviceId, goalId, customPrompt, themeId = 'cyber-dark' }) {
    const service = BYTESCRAFT_SERVICES.find(s => s.id === serviceId) || BYTESCRAFT_SERVICES[0];
    const topicTitle = customPrompt ? customPrompt : `${service.name}: Scalable Tech Solutions for Modern Startups`;
    const scriptContent = generateCoreScript(service, goalId, topicTitle);

    const linkedinCopy = generateLinkedInCopy(service, scriptContent, topicTitle);
    const instagramCopy = generateInstagramCopy(service, scriptContent, topicTitle);
    const facebookCopy = generateFacebookCopy(service, scriptContent, topicTitle);

    const hashtags = generateHashtags(service, goalId);
    const callToAction = "🚀 Ready to build high-performance software? Let's talk: https://www.bytescraftstudio.com/";

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
        aiEngine: 'Built-in Engine',
        status: 'draft'
    };
}

function parseGeminiJson(rawText) {
    let clean = rawText.trim();
    if (clean.startsWith('```json')) {
        clean = clean.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
    } else if (clean.startsWith('```')) {
        clean = clean.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    return JSON.parse(clean);
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
