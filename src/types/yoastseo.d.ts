// src/types/yoastseo.d.ts
declare module 'yoastseo' {
    export class Paper {
        constructor(text: string, options?: any);
    }
    export class Researcher {
        constructor(paper: Paper);
        getResearch(name: string): any;
    }
    
    // Add this default export definition
    const Yoast: {
        Paper: typeof Paper;
        Researcher: typeof Researcher;
    };
    export default Yoast;
}