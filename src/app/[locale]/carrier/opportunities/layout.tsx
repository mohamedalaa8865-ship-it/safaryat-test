import React from 'react';

/**
 * @layout OpportunitiesLayout
 * @description THE STERILIZED PLACEHOLDER [SCR-976]
 * Ensures structural integrity for retired routes.
 * Resolves 'is not a module' type error by providing an explicit export.
 */
export default function OpportunitiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
