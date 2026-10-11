import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardOverview from './components/DashboardOverview';
import PostGenerator from './components/PostGenerator';
import GraphicCanvasDesigner from './components/GraphicCanvasDesigner';
import MultiChannelPreview from './components/MultiChannelPreview';
import SchedulerQueue from './components/SchedulerQueue';
import ApiConfigModal from './components/ApiConfigModal';
import { generateSocialPostBundle, generateFallbackSocialPostBundle } from './services/aiGenerator';
import { getQueue, saveQueue, publishPostToPlatforms } from './services/socialPublisher';

export default function App() {
    const [activeTab, setActiveTab] = useState('generator'); // 'generator', 'queue', 'overview'
    const [isApiModalOpen, setIsApiModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);
    const [renderedImageDataUrl, setRenderedImageDataUrl] = useState(null);
    const [queue, setQueue] = useState([]);

    useEffect(() => {
        // Load existing post queue from storage or set initial demo item
        const savedQueue = getQueue();
        if (savedQueue && savedQueue.length > 0) {
            setQueue(savedQueue);
            setCurrentPost(savedQueue[0]);
        } else {
            // Auto-generate initial post for BytesCraft Studio on launch
            const demoPost = generateFallbackSocialPostBundle({
                serviceId: 'web-apps',
                goalId: 'spotlight',
                themeId: 'cyber-dark'
            });
            setCurrentPost(demoPost);
            setQueue([demoPost]);
            saveQueue([demoPost]);
        }
    }, []);

    const handleGeneratePost = async (params) => {
        setIsGenerating(true);
        try {
            const bundle = await generateSocialPostBundle(params);
            setCurrentPost(bundle);

            // Add to local queue list
            setQueue(prevQueue => {
                const updated = [bundle, ...prevQueue];
                saveQueue(updated);
                return updated;
            });
        } catch (err) {
            console.error('Post generation failed:', err);
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePublishSuccess = (publishedPost) => {
        const updated = queue.map(item => item.id === publishedPost.id ? publishedPost : item);
        setQueue(updated);
        saveQueue(updated);
        if (currentPost?.id === publishedPost.id) {
            setCurrentPost(publishedPost);
        }
    };

    const handlePublishItem = async (item) => {
        const res = await publishPostToPlatforms(item, ['facebook', 'instagram', 'linkedin']);
        handlePublishSuccess(res.post);
    };

    const handleDeleteItem = (id) => {
        const updated = queue.filter(item => item.id !== id);
        setQueue(updated);
        saveQueue(updated);
        if (currentPost?.id === id) {
            setCurrentPost(updated[0] || null);
        }
    };

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '3rem' }}>
            <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '0 1rem' }}>

                {/* Navigation Bar */}
                <Navbar
                    onOpenApiConfig={() => setIsApiModalOpen(true)}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

                {/* Main Content Areas */}
                {activeTab === 'overview' && (
                    <DashboardOverview
                        queue={queue}
                        onNewPost={() => setActiveTab('generator')}
                        onConfigureApi={() => setIsApiModalOpen(true)}
                    />
                )}

                {activeTab === 'generator' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 450px) 1fr', gap: '1.75rem' }}>

                        {/* Left Column: Post Generator Form */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <PostGenerator
                                onGenerate={handleGeneratePost}
                                isGenerating={isGenerating}
                                onOpenApiConfig={() => setIsApiModalOpen(true)}
                            />

                            {currentPost && (
                                <GraphicCanvasDesigner
                                    config={currentPost.graphicConfig}
                                    onCanvasRendered={(dataUrl) => setRenderedImageDataUrl(dataUrl)}
                                />
                            )}
                        </div>

                        {/* Right Column: Multi-Channel Feed Preview & Direct Publisher */}
                        <div>
                            {currentPost ? (
                                <MultiChannelPreview
                                    post={currentPost}
                                    imageDataUrl={renderedImageDataUrl}
                                    onPublishSuccess={handlePublishSuccess}
                                />
                            ) : (
                                <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
                                    <h3>Select a BytesCraft Studio Service to Generate Content</h3>
                                </div>
                            )}
                        </div>

                    </div>
                )}

                {activeTab === 'queue' && (
                    <SchedulerQueue
                        queue={queue}
                        onPublishItem={handlePublishItem}
                        onDeleteItem={handleDeleteItem}
                    />
                )}

                {/* API Credentials Configuration Modal */}
                <ApiConfigModal
                    isOpen={isApiModalOpen}
                    onClose={() => setIsApiModalOpen(false)}
                />

            </div>
        </div>
    );
}
