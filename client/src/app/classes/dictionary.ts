export interface Dictionary {
    title: string;
    description: string;
    words: Set<string>[];
}

export interface DictionaryPresentation {
    title: string;
    description: string;
    words?: string[];
    action?: string;
}

export interface LoadableDictionary {
    title: string;
    description: string;
    words: string[];
}
