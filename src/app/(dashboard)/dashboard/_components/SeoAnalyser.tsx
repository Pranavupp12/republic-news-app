"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, AlertTriangle, X } from "lucide-react";
import { analyzeSeo, SeoAnalysisResult } from "@/lib/seo-logic";
import { cn } from "@/lib/utils";

interface SEOAnalyzerProps {
  content: string;
  keyword: string;
  title: string;
  metaTitle: string;
  metaDesc: string;
  metaKeywords: string;
}

export function SEOAnalyzer({ 
  content, 
  keyword, 
  title, 
  metaTitle, 
  metaDesc, 
  metaKeywords 
}: SEOAnalyzerProps) {
  const [results, setResults] = useState<SeoAnalysisResult[]>([]);
  const [overallScore, setOverallScore] = useState(0);

  useEffect(() => {
    const { results, average } = analyzeSeo(
      content, 
      keyword, 
      title, 
      metaTitle, 
      metaDesc, 
      metaKeywords
    );
    setResults(results);
    setOverallScore(average);
  }, [content, keyword, title, metaTitle, metaDesc, metaKeywords]);

  const getStatusColor = (score: number) => {
    if (score >= 8) return "text-emerald-500 bg-emerald-50 border-emerald-200";
    if (score >= 5) return "text-orange-500 bg-orange-50 border-orange-200";
    return "text-red-500 bg-red-50 border-red-200";
  };

  const getIcon = (status: string) => {
    if (status === 'good') return <Check className="w-4 h-4 text-emerald-600" />;
    if (status === 'ok') return <AlertTriangle className="w-4 h-4 text-orange-500" />;
    return <X className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="w-full mt-6">
        <Card className="border shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50 py-2 border-b">
            <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    SEO Scorecard
                </CardTitle>
                
                {/* Score Indicator */}
                <div className={cn("flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-bold", getStatusColor(overallScore))}>
                    <span className="text-lg">{overallScore.toFixed(1)}</span>
                    <span className="text-xs opacity-70">/ 10</span>
                </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
              <ScrollArea className="h-[320px]">
                {(!keyword) && (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center">
                        <AlertTriangle className="w-8 h-8 mb-2 opacity-20" />
                        <p className="text-sm">Enter a focus keyword to start analysis.</p>
                    </div>
                )}

                {keyword && (
                    <div className="divide-y">
                        {results.map((res, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors">
                                <div className="flex items-start gap-3">
                                    <div className={cn("mt-0.5 p-1 rounded-full border", 
                                        res.status === 'good' ? "bg-emerald-100 border-emerald-200" :
                                        res.status === 'ok' ? "bg-orange-100 border-orange-200" :
                                        "bg-red-100 border-red-200"
                                    )}>
                                        {getIcon(res.status)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">
                                            {res.identifier.replace(/([A-Z])/g, " $1").trim()}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {res.text}
                                        </p>
                                    </div>
                                </div>

                                {/* THE CHARACTER COUNTER PILL */}
                                {(res.current !== undefined) && (
                                    <div className="flex flex-col items-end pl-2">
                                        <div className={cn("text-[10px] font-mono border px-2 py-0.5 rounded-full whitespace-nowrap",
                                            res.status === 'good' ? "bg-slate-100 text-slate-600 border-slate-200" : 
                                            "bg-red-50 text-red-600 border-red-200"
                                        )}>
                                            {res.current} 
                                            <span className="text-slate-400 mx-1">/</span> 
                                            {res.max ? res.max : `${res.min}+`}
                                        </div>
                                        <span className="text-[10px] text-muted-foreground capitalize mt-0.5">
                                            {res.unit}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
              </ScrollArea>
          </CardContent>
        </Card>
    </div>
  );
}