"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { analyzeSeo, SeoAnalysisResult } from "@/lib/seo-logic";
import { Badge } from "@/components/ui/badge";

interface SEOAnalyzerProps {
  content: string;
  keyword: string;
  title: string;
  metaTitle: string; // NEW
  metaDesc: string;
}

export function SEOAnalyzer({ content, keyword, title, metaTitle, metaDesc }: SEOAnalyzerProps) {
  const [results, setResults] = useState<SeoAnalysisResult[]>([]);
  const [overallScore, setOverallScore] = useState(0);

  useEffect(() => {
    const { results, average } = analyzeSeo(content, keyword, title, metaTitle, metaDesc);
    setResults(results);
    setOverallScore(average);
  }, [content, keyword, title, metaTitle, metaDesc]);

  const getIcon = (status: string) => {
    if (status === 'good') return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    if (status === 'ok') return <AlertCircle className="w-5 h-5 text-orange-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  const getScoreColor = (score: number) => {
    if (score >= 7) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 4) return "bg-orange-100 text-orange-800 border-orange-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <div className="w-full h-auto mt-6">
        <Card className="h-full flex flex-col">
          <CardHeader className="py-4">
            <div className="flex items-center justify-between">
                <CardTitle className="text-base">SEO Scorecard</CardTitle>
                <Badge variant="outline" className={`px-3 py-1 ${getScoreColor(overallScore)}`}>
                    {overallScore.toFixed(1)} / 10
                </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
              <ScrollArea className="h-[250px] pr-4">
                {(!keyword) && (
                    <p className="text-muted-foreground text-sm text-center py-4">
                      Enter a focus keyword to start scoring.
                    </p>
                )}
                <div className="space-y-3">
                    {results.map((res, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 border rounded-lg bg-card text-sm">
                            {getIcon(res.status)}
                            <div className="flex-1">
                                <p className="font-medium text-foreground">{res.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
              </ScrollArea>
          </CardContent>
        </Card>
    </div>
  );
}