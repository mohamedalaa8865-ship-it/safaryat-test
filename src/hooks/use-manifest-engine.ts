'use client';

import { useState } from 'react';
import { useFunctions } from '@/firebase';
import { httpsCallable } from 'firebase/functions';

/**
 * @hook useManifestEngine
 * @description Invokes the Sovereign Manifest Generator (SC-527).
 * Ensures Dumb UI logic. Returns the flattened, official document data.
 */
export function useManifestEngine() {
    const functions = useFunctions();
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateManifest = async (tripId: string) => {
        if (!functions) return null;
        setIsGenerating(true);
        setError(null);
        try {
            const generateFn = httpsCallable(functions, 'generateOfficialManifestSovereign');
            const result = await generateFn({ tripId });
            return (result.data as any).manifestData;
        } catch (err: any) {
            console.error('Manifest Generation Failed:', err);
            setError(err.message || 'فشل توليد الكشف الرسمي');
            return null;
        } finally {
            setIsGenerating(false);
        }
    };

    return { generateManifest, isGenerating, manifestError: error };
}
