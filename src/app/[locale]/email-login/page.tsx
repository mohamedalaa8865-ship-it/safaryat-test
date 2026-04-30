// src/app/[locale]/email-login/page.tsx
import { Suspense } from 'react';
import EmailLoginPage from './email-login-client';

export default function Page() {
    return (
        <Suspense>
            <EmailLoginPage />
        </Suspense>
    );
}