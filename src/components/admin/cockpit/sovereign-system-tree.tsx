'use client';

/**
 * @component SovereignSystemTree
 * @description THE REINFORCED ARCHITECTURAL VISUALIZER [SCR-941 - WING BASED]
 * [SCR-2026-024]: تأمين استدعاء أيقونة المنطقة بقيمة افتراضية لمنع الانهيار.
 * Protocol 16: Dumb UI. Visualizes the link between code, law, and history.
 */

import React, { useState, useMemo } from 'react';
import { SYSTEM_DNA, type FileDNA } from '@/lib/system-dna';
import { SOVEREIGN_PROTOCOLS } from '@/lib/sovereign-protocols';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    FileCode, ShieldCheck, Zap, 
    Lock, AlertTriangle, Fingerprint, Activity,
    History, Scale, ArrowLeft, Info
} from 'lucide-react';
import { cn, triggerHaptic } from '@/lib/utils';

export function SovereignSystemTree() {
    const [selectedFile, setSelectedFile] = useState<FileDNA | null>(SYSTEM_DNA[0]);

    const handleSelectFile = (dna: FileDNA) => {
        triggerHaptic('light');
        setSelectedFile(dna);
    };

    const renderZoneIcon = (zone: string) => {
        switch(zone) {
            case 'NUCLEUS': return <Fingerprint className="h-4 w-4 text-red-500 animate-pulse" />;
            case 'ARTERY': return <Activity className="h-4 w-4 text-amber-500" />;
            case 'BORDER_GUARD': return <ShieldCheck className="h-4 w-4 text-blue-500" />;
            case 'red': return <Lock className="h-4 w-4 text-red-600" />;
            case 'yellow': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
            default: return <Zap className="h-4 w-4 text-emerald-500" />;
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 h-full min-h-[600px] animate-in fade-in zoom-in duration-700">
            
            {/* WING A: THE PHYSICAL TREE (LEFT) */}
            <div className="w-full lg:w-1/3 flex flex-col gap-4 overflow-y-auto no-scrollbar pr-2 border-l border-white/5">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2 mb-2">
                    <Scale className="h-3 w-3" /> PHYSICAL SCAN [SRC]
                </h3>
                {SYSTEM_DNA.map((dna) => (
                    <Card 
                        key={dna.id} 
                        className={cn(
                            "bg-zinc-900/40 border-primary/10 rounded-2xl overflow-hidden cursor-pointer transition-all hover:border-primary/40 group relative",
                            selectedFile?.id === dna.id ? "border-primary/60 bg-primary/5 shadow-[0_0_20px_rgba(190,174,119,0.1)] scale-[1.02]" : "grayscale-[0.5] opacity-70"
                        )}
                        onClick={() => handleSelectFile(dna)}
                    >
                        <div className={cn(
                            "absolute top-0 left-0 w-1 h-full opacity-30",
                            dna.zone === 'NUCLEUS' || dna.zone === 'red' ? "bg-red-500" : 
                            dna.zone === 'ARTERY' || dna.zone === 'yellow' ? "bg-amber-500" : "bg-blue-500"
                        )} />
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="p-2 bg-black rounded-lg border border-white/5">
                                    <FileCode className={cn("h-4 w-4 text-primary", selectedFile?.id === dna.id && "animate-pulse")} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[11px] font-black text-white uppercase truncate">{dna.name}</p>
                                    <p className="text-[8px] font-mono text-muted-foreground truncate" dir="ltr">{dna.path}</p>
                                </div>
                            </div>
                            {/* [SCR-2026-024]: Secure zone icon call with fallback */}
                            {renderZoneIcon(dna.zone || 'green')}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* WING B: ARCHITECTURAL INTELLIGENCE (RIGHT / DETAIL) */}
            <div className="flex-1 flex flex-col gap-6 animate-in slide-in-from-left-4 duration-500">
                {selectedFile ? (
                    <>
                        {/* HEADER: IDENTITY */}
                        <div className="bg-zinc-900/60 p-6 rounded-[2.5rem] border border-primary/20 space-y-4 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                                <FileCode className="h-32 w-32" />
                            </div>
                            <div className="flex justify-between items-start relative z-10">
                                <div className="space-y-1">
                                    <Badge className="bg-primary/10 text-primary border-primary/20 text-[8px] font-black uppercase tracking-widest px-3">{selectedFile.zone}</Badge>
                                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">{selectedFile.name}</h2>
                                    <p className="text-[10px] font-mono text-primary/60" dir="ltr">{selectedFile.path}</p>
                                </div>
                                <div className="text-left space-y-1">
                                    <div className="flex items-center gap-1 justify-end">
                                        {selectedFile.risk === 'CRITICAL' && <Lock className="h-3 w-3 text-red-500 animate-pulse" />}
                                        <span className={cn(
                                            "text-[10px] font-black uppercase tracking-widest",
                                            selectedFile.risk === 'CRITICAL' ? "text-red-500" : "text-emerald-500"
                                        )}>{selectedFile.risk || 'STABLE'} RISK</span>
                                    </div>
                                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Sovereign Artifact</p>
                                </div>
                            </div>
                            <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                                <p className="text-sm font-bold text-slate-300 leading-relaxed text-right">{selectedFile.description}</p>
                            </div>
                        </div>

                        {/* PROTOCOL WING */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-zinc-900/40 border-primary/10 rounded-[2rem] overflow-hidden">
                                <div className="p-4 border-b border-white/5 bg-primary/5 flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase text-primary flex items-center gap-2"><Scale className="h-3 w-3" /> Governing Laws</span>
                                    <Badge variant="outline" className="text-[8px] font-mono border-primary/20 text-primary">{selectedFile.protocols?.length || 0} ACTIVE</Badge>
                                </div>
                                <CardContent className="p-4 space-y-3">
                                    {selectedFile.protocols?.map(pId => {
                                        const proto = SOVEREIGN_PROTOCOLS.find(p => p.id === pId);
                                        return (
                                            <div key={pId} className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1 group hover:border-primary/30 transition-all">
                                                <div className="flex justify-between items-center">
                                                    <span className={cn("text-[10px] font-black", proto?.color)}>{proto?.id} : {proto?.name}</span>
                                                    <ShieldCheck className="h-3 w-3 text-primary opacity-30 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                                <p className="text-[9px] text-slate-400 font-medium leading-relaxed text-right">{proto?.mandate}</p>
                                            </div>
                                        );
                                    })}
                                </CardContent>
                            </Card>

                            <Card className="bg-zinc-900/40 border-primary/10 rounded-[2rem] overflow-hidden flex flex-col">
                                <div className="p-4 border-b border-white/5 bg-primary/5 flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase text-primary flex items-center gap-2"><History className="h-3 w-3" /> Forensic Archive</span>
                                </div>
                                <CardContent className="p-6 flex-1 flex flex-col justify-center items-center text-center space-y-4">
                                    <div className="p-4 bg-black/60 rounded-full border border-primary/20 shadow-inner">
                                        <History className="h-8 w-8 text-primary/40" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Last Surgical Actions</p>
                                        <p className="text-xs font-black text-primary italic font-mono">{selectedFile.archiveReference || 'NO PREVIOUS SURGERY'}</p>
                                    </div>
                                    <p className="text-[9px] font-bold text-muted-foreground leading-relaxed max-w-[200px]">يتم سحب التاريخ الجنائي للملف مباشرة من السجل السيادي (SSOT) لضمان براءة الذمة.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-20 grayscale">
                        <Info className="h-20 w-20 mb-4" />
                        <p className="text-xl font-black uppercase tracking-[0.5em]">System Identity Undefined</p>
                    </div>
                )}
            </div>
        </div>
    );
}
