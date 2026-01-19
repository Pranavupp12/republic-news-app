// src/lib/seo-logic.ts

export interface SeoAnalysisResult {
    identifier: string;
    score: number;
    text: string;
    status: 'good' | 'ok' | 'bad';
    current?: number; 
    max?: number;
    min?: number;
    unit?: 'chars' | 'words' | 'count';
}

function escapeRegExp(string: string) {
    // Escapes special characters like * or ? so they are treated as text
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function analyzeSeo(
    content: string, 
    keyword: string, 
    title: string, 
    metaTitle: string, 
    metaDesc: string,
    metaKeywords: string 
) {
    const results: SeoAnalysisResult[] = [];
    
    // 0. SANITIZE KEYWORD
    if (!keyword || !keyword.trim()) {
        return { results: [], average: 0 };
    }
    
    // Clean up spaces (e.g., " illicit   oil " -> "illicit oil")
    const cleanKeyword = keyword.trim().replace(/\s+/g, ' ');

    const plainText = content.replace(/<[^>]*>/g, ' '); 

    // ---------------------------------------------------------
    // THE FIX: EXACT MATCH LOGIC
    // We wrap the keyword in \b (Word Boundaries).
    // \b matches the position where a word starts or ends.
    // So "illicit" will NOT match "illicitly".
    // "illicit oil tanker" will match the full phrase exactly.
    // ---------------------------------------------------------
    const keywordRegex = new RegExp(`\\b${escapeRegExp(cleanKeyword)}\\b`, 'i');

    // --- 1. KEYWORD EXISTENCE CHECKS ---

    // A. Article Title
    const titleHasKw = keywordRegex.test(title);
    results.push({
        identifier: 'kwInTitle',
        score: titleHasKw ? 10 : 0,
        text: titleHasKw 
            ? `Focus keyword "${cleanKeyword}" found in Title.` 
            : `Focus keyword "${cleanKeyword}" missing from Title.`,
        status: titleHasKw ? 'good' : 'bad'
    });

    // B. Meta Title
    const targetMetaTitle = metaTitle || title; 
    const metaTitleHasKw = keywordRegex.test(targetMetaTitle);
    results.push({
        identifier: 'kwInMetaTitle',
        score: metaTitleHasKw ? 10 : 0,
        text: metaTitleHasKw ? "Focus keyword found in Meta Title." : "Focus keyword missing from Meta Title.",
        status: metaTitleHasKw ? 'good' : 'bad'
    });

    // C. Meta Description
    const metaDescHasKw = keywordRegex.test(metaDesc);
    results.push({
        identifier: 'kwInMetaDesc',
        score: metaDescHasKw ? 10 : 0,
        text: metaDescHasKw ? "Focus keyword found in Meta Description." : "Focus keyword missing from Meta Description.",
        status: metaDescHasKw ? 'good' : 'bad'
    });

    // D. Meta Keywords
    const metaKeywordsHasKw = keywordRegex.test(metaKeywords);
    results.push({
        identifier: 'kwInMetaKeywords',
        score: metaKeywordsHasKw ? 10 : 0,
        text: metaKeywordsHasKw ? "Focus keyword found in Meta Keywords." : "Focus keyword missing from Meta Keywords.",
        status: metaKeywordsHasKw ? 'good' : 'bad'
    });

    // E. Article Content
    const contentHasKw = keywordRegex.test(plainText);
    results.push({
        identifier: 'kwInContent',
        score: contentHasKw ? 10 : 0,
        text: contentHasKw ? "Focus keyword found in content." : "Focus keyword missing from content.",
        status: contentHasKw ? 'good' : 'bad'
    });


    // --- 2. LENGTH & BEST PRACTICE CHECKS ---

    // A. Meta Title Length
    const mtLen = (metaTitle || "").length;
    let mtScore = 10;
    let mtMsg = "Optimal length.";
    
    if (mtLen === 0) { mtScore = 0; mtMsg = "Empty title."; }
    else if (mtLen > 60) { mtScore = 5; mtMsg = "Too long."; }
    else if (mtLen < 10) { mtScore = 5; mtMsg = "Too short."; }

    results.push({
        identifier: 'Meta Title Length',
        score: mtScore,
        text: mtMsg,
        status: mtScore > 7 ? 'good' : mtScore > 4 ? 'ok' : 'bad',
        current: mtLen, 
        max: 60,
        unit: 'chars'
    });

    // B. Meta Description Length
    const mdLen = (metaDesc || "").length;
    let mdScore = 10;
    let mdMsg = "Optimal length.";

    if (mdLen === 0) { mdScore = 0; mdMsg = "Empty description."; }
    else if (mdLen > 160) { mdScore = 5; mdMsg = "Too long."; }
    else if (mdLen < 50) { mdScore = 5; mdMsg = "Too short."; }

    results.push({
        identifier: 'Meta Desc Length',
        score: mdScore,
        text: mdMsg,
        status: mdScore > 7 ? 'good' : mdScore > 4 ? 'ok' : 'bad',
        current: mdLen, 
        max: 160,
        unit: 'chars'
    });

    // C. Article Title Length
    const titleLen = title.length;
    let titleScore = 10;
    if (titleLen > 70) titleScore = 6;
    
    results.push({
        identifier: 'Article Title Length',
        score: titleScore,
        text: titleLen > 70 ? "Title is quite long." : "Good length.",
        status: titleScore > 7 ? 'good' : 'ok',
        current: titleLen, 
        max: 70,
        unit: 'chars'
    });

    // D. Content Word Count
    const wordCount = plainText.trim().split(/\s+/).filter(w => w.length > 0).length;
    let wordScore = 10;
    if (wordCount < 300) wordScore = 4;
    
    results.push({
        identifier: 'Word Count',
        score: wordScore,
        text: wordCount < 300 ? "Content is too thin." : "Good content depth.",
        status: wordScore > 7 ? 'good' : 'bad',
        current: wordCount, 
        min: 300,
        unit: 'words'
    });

    const totalScore = results.reduce((acc, curr) => acc + curr.score, 0);
    const average = results.length > 0 ? totalScore / results.length : 0;

    return { results, average };
}