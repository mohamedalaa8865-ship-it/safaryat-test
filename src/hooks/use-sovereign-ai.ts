'use client';

/**
 * @hook useSovereignAI
 * @description المفاعل المنطقي للمساعد الذكي [SCR-943 - DIAMOND]
 * [PROTOCOL 18]: Sovereign Fission. عزل منطق الذكاء الاصطناعي عن الواجهة.
 * [PROTOCOL 20]: Digital Immune System. معالجة الانهيارات وتوثيقها.
 */

import { useState, useCallback } from 'react';
import { triggerHaptic } from '@/lib/utils';

export function useSovereignAI<T, I>(aiCallFunction: (input: I) => Promise<T>) {
    const [response, setResponse] = useState<string>('');
    const [isStreaming, setIsStreaming] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const executePrompt = useCallback(async (input: I) => {
        setIsStreaming(true);
        setError(null);
        setResponse('');
        triggerHaptic('light');

        try {
            const result = await aiCallFunction(input);
            const answer = (result as any)?.answerText || (result as any)?.text || (result as string);
            setResponse(answer);
            triggerHaptic('success');
            return answer;
        } catch (err: any) {
            const traceId = `ERR-AI-${Math.floor(Math.random() * 10000)}`;
            console.error(`[Sovereign AI] Rupture: ${traceId}`, err);
            setError(`عذراً أيها القائد، حدث اضطراب في مصفوفة الذكاء. (الرمز: ${traceId})`);
            triggerHaptic('heavy');
            throw err;
        } finally {
            setIsStreaming(false);
        }
    }, [aiCallFunction]);

    return { response, isStreaming, error, executePrompt, setResponse, setError };
}
