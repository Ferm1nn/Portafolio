import { useState, useEffect, useRef, useCallback } from 'react';

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*";

export function useScrambleText(text: string, speed: number = 40) {
    const [displayText, setDisplayText] = useState(text);
    const intervalRef = useRef<number | null>(null);

    const triggerAnimation = useCallback(() => {
        let iterations = 0;

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = window.setInterval(() => {
            setDisplayText(_prev =>
                text
                    .split("")
                    .map((_letter, index) => {
                        if (index < iterations) {
                            return text[index];
                        }
                        return CHARS[Math.floor(Math.random() * CHARS.length)];
                    })
                    .join("")
            );

            if (iterations >= text.length) {
                if (intervalRef.current) clearInterval(intervalRef.current);
            }

            iterations += 1 / 3; // Slower iteration for smoother effect
        }, speed);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [text, speed]);

    useEffect(() => {
        // Optional: trigger on mount or let consumer trigger it
        // triggerAnimation();
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    return { displayText, triggerAnimation };
}
