/**
 * @file src/services/staff-service.ts
 * @description SOVEREIGN STAFF SERVICE (DIAMOND STERILIZED - SC-806 V4.9 - SEALED)
 * [SC-806 V4.9]: Eradicated manual updates. Fully linked to Judicial Artery.
 * Protocol 16: Sterilized. Protocol 43: Loose Coupling.
 */
import { collection, getDocs, query, orderBy, doc, where, type Firestore } from "firebase/firestore";
import { httpsCallable, type Functions } from "firebase/functions";
import { type Staff } from "@/types/staff";
import { type StaffLedgerEntry } from "@/lib/data";

// const REGISTRY_COLLECTION = 'staff_registry';
const REGISTRY_COLLECTION = "users";
const LEDGER_COLLECTION = "staff_ledger";

export const StaffService = {
  /**
   * [Protocol 88] Returns the base registry query.
   */
  // getRegistryQuery(db: Firestore) {
  //   return query(collection(db, REGISTRY_COLLECTION), orderBy("createdAt", "desc"));
  // },

  getRegistryQuery(db: Firestore) {
    return query(
      collection(db, "users"),
      where("role", "in", ["agent", "admin", "developer", "operations_manager"]),
      // orderBy("createdAt", "desc")
    );
  },
  /**
   * [SSOT] Fetch individual staff financial history.
   */
  async getStaffLedger(db: Firestore, staffId: string) {
    const q = query(collection(db, LEDGER_COLLECTION), where("staffId", "==", staffId), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as StaffLedgerEntry[];
  },

  /**
   * [SC-806 V4.9] JUDICIAL HR: All state changes must flow through the Cloud Artery.
   */
  async recruitStaff(functions: Functions, data: Partial<Staff>) {
    const recruitFn = httpsCallable(functions, "recruitSovereignStaff");
    return recruitFn(data);
  },

  /**
   * [Protocol 30] Toggle status via Cloud Artery only.
   */
  async toggleStaffStatus(functions: Functions, staffId: string, currentStatus: boolean, reason: string) {
    const toggleFn = httpsCallable(functions, "toggleStaffStatusSovereign");
    return toggleFn({ staffId, currentStatus, reason });
  },

  /**
   * [SC-806 V4.9] Log and Approve Accruals via Atomic Cloud Functions.
   */
  async logTimesheet(functions: Functions, data: { staffId: string; date: string; hours: number; task: string }) {
    const logFn = httpsCallable(functions, "logStaffTimesheet");
    return logFn(data);
  },

  async approveAccrual(functions: Functions, actionId: string, type: "timesheet" | "advance", reason: string) {
    const approveFn = httpsCallable(functions, "approveStaffAccrual");
    return approveFn({ actionId, type, judicialReason: reason });
  },
};
