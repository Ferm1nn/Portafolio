import { useState, useEffect, useRef } from 'react';

export const useTypewriter = (text: string, speed: number = 20) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const index = useRef(0);

    useEffect(() => {
        // Reset when text changes
        setDisplayedText('');
        setIsTyping(true);
        index.current = 0;

        if (!text) {
            setIsTyping(false);
            return;
        }

        const intervalId = setInterval(() => {
            if (index.current < text.length) {
                setDisplayedText((prev) => prev + text.charAt(index.current));
                index.current++;
            } else {
                setIsTyping(false);
                clearInterval(intervalId);
            }
        }, speed);

        return () => clearInterval(intervalId);
    }, [text, speed]);

    return { displayedText, isTyping };
};
