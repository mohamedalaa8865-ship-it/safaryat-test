
'use client';

import { useUserProfile } from './use-user-profile';

/**
 * @hook useCarrierRoute
 * @description THE ARTERIAL NAVIGATION ENGINE (SC-507)
 * Provides local logic for route mirroring without database chatter.
 */
export function useCarrierRoute() {
  const { profile } = useUserProfile();

  /**
   * Returns the mirrored route based on the carrier's registered jurisdiction.
   * Protocol 88: $0 Network Cost (Local Cache Only).
   */
  const getMirroredRoute = () => {
    if (!profile?.jurisdiction) return null;

    return {
      originCountry: profile.jurisdiction.destination,
      destinationCountry: profile.jurisdiction.origin,
      // Default to empty cities to force user selection
      originCity: '',
      destinationCity: '',
    };
  };

  return {
    getMirroredRoute,
    jurisdiction: profile?.jurisdiction || null,
  };
}
