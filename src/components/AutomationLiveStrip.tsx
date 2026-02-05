import React, { useState, useEffect } from 'react';

/**
 * Paste this component at the VERY BOTTOM of your Automation & Systems card.
 * It simulates a live micro-terminal showing system activity.
 */
const AutomationLiveStrip: React.FC = () => {
    const logs = [
        "> System Check: All Nodes Operational",
        "> Python Worker: Processing Webhook...",
        "> n8n: Data Sync Complete (200 OK)",
        "> Watchdog: Monitoring Active Threads",
        "> Deploying: v2.4.1-stable...",
        "> Cache: Cleared successfully"
    ];

    const [currentLogIndex, setCurrentLogIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(50);


    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;

        const currentFullText = logs[currentLogIndex];

        const handleTyping = () => {
            if (isDeleting) {
                setDisplayedText(prev => prev.substring(0, prev.length - 1));
                setTypingSpeed(30);
            } else {
                setDisplayedText(prev => currentFullText.substring(0, prev.length + 1));
                setTypingSpeed(Math.random() * 50 + 50);
            }
        };

        if (!isDeleting && displayedText === currentFullText) {
            timeout = setTimeout(() => setIsDeleting(true), 2000);
        } else if (isDeleting && displayedText === "") {
            setIsDeleting(false);
            setCurrentLogIndex((prev) => (prev + 1) % logs.length);
        } else {
            timeout = setTimeout(handleTyping, typingSpeed);
        }

        return () => clearTimeout(timeout);
    }, [displayedText, isDeleting, logs, currentLogIndex, typingSpeed]); // Added all dependencies



    return (
        <div className="w-full h-8 bg-black/40 border-t border-white/5 flex items-center px-4 overflow-hidden rounded-b-xl">
            <div className="flex items-center gap-2 w-full">
                {/* Blinking Cursor Block */}
                <div className="w-1.5 h-3 bg-green-500/50 animate-pulse"></div>

                <p className="font-mono text-[10px] text-gray-400 truncate w-full">
                    <span className="text-green-500/70 mr-2">$</span>
                    {displayedText}
                    <span className="animate-blink border-r-2 border-green-500 ml-0.5 h-3 inline-block align-middle"></span>
                </p>
            </div>
        </div>
    );
};

export default AutomationLiveStrip;
