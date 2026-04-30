'use client';

/**
 * @file src/app/global-error.tsx
 * @description THE REINFORCED SOVEREIGN GLOBAL FALLBACK (PROTOCOL 20 - HARDENED)
 * This is the ultimate error boundary. Rebuilt with zero external dependencies (pure HTML/CSS)
 * to ensure rendering capability even when the primary module bundle is compromised.
 */

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <title>CRITICAL_SYSTEM_BREACH</title>
      </head>
      <body style={{
        backgroundColor: '#1F0A10',
        color: '#FFFFFF',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div style={{ maxWidth: '500px', width: '100%' }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '50%',
            border: '2px solid rgba(239, 68, 68, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px auto'
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          
          <h1 style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '-0.05em', marginBottom: '12px' }}>
            CRITICAL_SYSTEM_BREACH
          </h1>
          <h2 style={{ fontSize: '18px', color: '#beae77', marginBottom: '24px' }}>
            انهيار جزيئي في نخاع القلعة
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: '1.6', marginBottom: '32px' }}>
            أيها القائد، رصد جهاز المناعة الرقمي انهياراً في النطاق العالمي للقلعة. تم عزل العطل وتوثيق البصمة الجنائية للتحقيق.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
            <button 
              onClick={() => reset()} 
              style={{
                backgroundColor: '#EF4444',
                color: 'white',
                border: 'none',
                padding: '16px 24px',
                borderRadius: '12px',
                fontWeight: '900',
                fontSize: '16px',
                cursor: 'pointer',
                boxShadow: '0 10px 20px rgba(239, 68, 68, 0.2)',
                transition: 'transform 0.2s'
              }}
            >
              إعادة إنعاش النبض
            </button>
            <button 
              onClick={() => window.location.href = '/'} 
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              العودة للساحة العامة
            </button>
          </div>

          <div style={{ marginTop: '48px', opacity: '0.2' }}>
            <p style={{ fontSize: '10px', fontWeight: '900', letterSpacing: '0.5em', textTransform: 'uppercase' }}>
              Sovereign Immune System • Level Zero Fallback
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
