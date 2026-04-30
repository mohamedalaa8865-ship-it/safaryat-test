'use client';

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "./button";
import { SovereignBlackBox } from "@/lib/sovereign-monitor";

interface Props {
  children?: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
}

/**
 * @component LocalErrorBoundary
 * @description THE SOVEREIGN SHIELD (REINFORCED - SC-672)
 * [SC-672]: Fully integrated with Protocol 20 Digital Immune System.
 * Ensures local collapses are documented in the Black Box without breaking the fortress.
 */
export class LocalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Protocol 20: Documentation of the collapse
    const context = `LOCAL_CELL_RUPTURE: ${this.props.fallbackTitle || 'Unknown Component'}`;
    
    // [SC-672] Auto-Reporting to Sovereign Monitor
    SovereignBlackBox.reportLethalCrash(error, context);
    
    // Development logging (Protocol 20 requirement)
    console.error(`[Sovereign Immune System] Rupture documented in ${context}:`, error);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 border-2 border-dashed border-destructive/30 rounded-2xl bg-destructive/5 flex flex-col items-center justify-center text-center gap-3 animate-in fade-in duration-500">
          <div className="bg-destructive/10 p-2 rounded-full">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-black text-foreground">{this.props.fallbackTitle || 'تعثر هذا الجزء من القلعة'}</h3>
            <p className="text-[10px] text-muted-foreground">تمَّ عزل الانهيار موضعياً وتوثيقه في الصندوق الأسود للتحقيق.</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-[10px] gap-2 font-bold"
            onClick={() => this.setState({ hasError: false })}
          >
            <RefreshCcw className="h-3 w-3" />
            إعادة المحاولة
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
