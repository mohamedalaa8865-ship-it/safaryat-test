/**
 * @file src/lib/financial-logic.ts
 * @description THE REINFORCED FINANCIAL BRAIN (STERILIZED - SSOT)
 * Protocol 16: Diamond Sterilization. No 'use client' required.
 */

export const FinancialLogic = {
  calculateDeposit: (totalPrice: number, depositPercentage: number = 20): number => {
    return parseFloat((totalPrice * (depositPercentage / 100)).toFixed(2));
  },

  calculateRemaining: (totalPrice: number, depositAmount: number): number => {
    return parseFloat((totalPrice - depositAmount).toFixed(2));
  },

  calculatePlatformFeeDue: (baseFee: number, discount: number): number => {
    const due = baseFee - discount;
    return due > 0 ? parseFloat(due.toFixed(2)) : 0;
  },

  calculateNetPlatformFee: (baseFee: number, commission: number, discount: number = 0): number => {
    const net = (baseFee + commission) - discount;
    return net > 0 ? Number(net.toFixed(2)) : 0;
  },

  formatCurrency: (amount: number, currency: string = 'JOD'): string => {
    return `${amount.toFixed(2)} ${currency}`;
  }
};
