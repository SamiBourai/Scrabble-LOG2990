export interface Dictionary {
    title: string;
    description: string;
    words: Set<string>[];
}

export interface LoadableDictionary {
    title: string;
    description: string;
    words: string[];
}
