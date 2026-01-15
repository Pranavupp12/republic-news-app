// src/lib/seo-logic.ts

export interface SeoAnalysisResult {
    identifier: string;
    score: number; // 0 to 10
    text: string;
    status: 'good' | 'ok' | 'bad';
}

export function analyzeSeo(content: string, keyword: string, title: string, metaTitle: string, metaDesc: string) {
    const results: SeoAnalysisResult[] = [];
    
    // Helper to count words (stripping HTML)
    const plainText = content.replace(/<[^>]*>/g, ' '); 
    const wordCount = plainText.trim().split(/\s+/).filter(w => w.length > 0).length;
    const lowerKeyword = keyword.toLowerCase();

    // 1. Article Word Count
    let wordScore = 0;
    if (wordCount > 300) wordScore = 10;
    else if (wordCount > 200) wordScore = 6;
    else wordScore = 3;

    results.push({
        identifier: 'wordCount',
        score: wordScore,
        text: `Word count: ${wordCount} (Recommended: 300+).`,
        status: wordScore > 7 ? 'good' : wordScore > 4 ? 'ok' : 'bad'
    });

    // 2. Focus Keyword in Title
    if (keyword) {
        // Check standard title or meta title if provided
        const targetTitle = metaTitle || title; 
        const titleHasKw = targetTitle.toLowerCase().includes(lowerKeyword);
        results.push({
            identifier: 'keywordInTitle',
            score: titleHasKw ? 10 : 0,
            text: titleHasKw ? "Focus keyword found in title." : "Focus keyword missing from title.",
            status: titleHasKw ? 'good' : 'bad'
        });
    }

    // 3. Meta Title Length (0 - 60 chars)
    // If no meta title, we warn them to add one
    if (!metaTitle) {
        results.push({
            identifier: 'metaTitleLength',
            score: 5,
            text: "No custom Meta Title set (using article title).",
            status: 'ok'
        });
    } else {
        const mtLen = metaTitle.length;
        let mtStatus: 'good' | 'bad' = 'good';
        let mtMsg = "Meta title length is good.";

        if (mtLen > 60) {
            mtStatus = 'bad';
            mtMsg = `Meta title is too long (${mtLen}/60 chars).`;
        } else if (mtLen < 10) {
            mtStatus = 'bad';
            mtMsg = "Meta title is too short.";
        }

        results.push({
            identifier: 'metaTitleLength',
            score: mtStatus === 'good' ? 10 : 0,
            text: mtMsg,
            status: mtStatus
        });
    }

    // 4. Meta Description Length (0 - 160 chars)
    const mdLen = metaDesc.length;
    let mdScore = 10;
    let mdMsg = "Meta description length is good.";

    if (mdLen === 0) {
        mdScore = 0; 
        mdMsg = "No meta description provided."; 
    } else if (mdLen > 160) {
        mdScore = 0; 
        mdMsg = `Meta description is too long (${mdLen}/160 chars).`;
    } else if (mdLen < 50) {
        mdScore = 5; 
        mdMsg = "Meta description is a bit short (under 50 chars).";
    }

    results.push({
        identifier: 'metaDescriptionLength',
        score: mdScore,
        text: mdMsg,
        status: mdScore > 7 ? 'good' : mdScore > 4 ? 'ok' : 'bad'
    });

    // Calculate Average
    const totalScore = results.reduce((acc, curr) => acc + curr.score, 0);
    const average = results.length > 0 ? totalScore / results.length : 0;

    return { results, average };
}