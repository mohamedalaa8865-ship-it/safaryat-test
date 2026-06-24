"use client";

import { useUserProfile } from "@/hooks/use-user-profile";
import { useCountryPricing } from "@/hooks/use-country-pricing";
import { differenceInDays, isPast, parseISO, isValid } from "date-fns";
import type { UserProfile } from "@/lib/data";
import { COUNTRY_CODE_MAP } from "@/lib/constants";
import { useMemo } from "react";

export type SubscriptionState = "active" | "warning" | "expired";

/**
 * @hook useCarrierSubscription
 * @description THE REINFORCED SOVEREIGN ARTERY (DIAMOND STERILIZED - SC-806 V5.8)
 * [SC-806 V5.8]: Sterilized Time Core for reliable trial expiry calculation.
 */
export function useCarrierSubscription(passedProfile?: UserProfile | null) {
  const { profile: fetchedProfile, isLoading: isProfileLoading } = useUserProfile();

  const profile = passedProfile !== undefined ? passedProfile : fetchedProfile;
  const isLoading = passedProfile !== undefined ? false : isProfileLoading;

  const countryCode = useMemo(() => {
    if (!profile?.operatingCountry) return "JO";
    return COUNTRY_CODE_MAP[profile.operatingCountry] || "JO";
  }, [profile?.operatingCountry]);

  const { rule: marketRule, loading: marketLoading } = useCountryPricing(countryCode);

  // [SC-806 V5.8] Universal Time Nucleus: Robust parsing for trial ends
  const trialEnds = profile?.trialEndsAt;
  const endDate = useMemo(() => {
    if (!trialEnds) return new Date(0);

    if (typeof trialEnds.toDate === "function") return trialEnds.toDate();
    if (typeof trialEnds === "number") return new Date(trialEnds);
    if (trialEnds.seconds) return new Date(trialEnds.seconds * 1000);

    const parsed = typeof trialEnds === "string" ? parseISO(trialEnds) : new Date(trialEnds);
    return isValid(parsed) ? parsed : new Date(0);
  }, [trialEnds]);

  const today = new Date();
  const daysRemaining = Math.max(0, differenceInDays(endDate, today));
  const isExpired = isPast(endDate) && daysRemaining === 0;

  const subscriptionState: SubscriptionState = useMemo(() => {
    if (isExpired) return "expired";
    if (daysRemaining <= 3) return "warning";
    return "active";
  }, [isExpired, daysRemaining]);

  return {
    status: isLoading || marketLoading ? "loading" : "ready",
    daysRemaining,
    subscriptionState,
    gracePeriodTotal: marketRule?.trialOverrideDays ?? 90,
    isMarketActive: marketRule?.isActive ?? true,
    marketRule,
  };
}
