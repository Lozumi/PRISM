import fs from 'fs';
import path from 'path';
import { parse } from 'smol-toml';
import { Publication, Author } from '@/types/publication';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export function getMarkdownContent(filename: string): string {
    try {
        const filePath = path.join(CONTENT_DIR, filename);
        return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
        console.error(`Error loading markdown file ${filename}:`, error);
        return '';
    }
}

export function getBibtexContent(filename: string): string {
    try {
        const filePath = path.join(CONTENT_DIR, filename);
        return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
        console.error(`Error loading bibtex file ${filename}:`, error);
        return '';
    }
}

export function getTomlContent<T>(filename: string): T | null {
    try {
        const filePath = path.join(CONTENT_DIR, filename);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return parse(fileContent) as unknown as T;
    } catch (error) {
        console.error(`Error loading TOML file ${filename}:`, error);
        return null;
    }
}

export function getPageConfig<T = unknown>(pageName: string): T | null {
    return getTomlContent<T>(`${pageName}.toml`);
}

// Parse author string into Author object
function parseAuthor(authorStr: string): Author {
    const isCorresponding = authorStr.includes('*');
    const isHighlighted = authorStr.includes('$');
    const name = authorStr.replace(/[\*\$]/g, '').trim();
    
    return {
        name,
        isHighlighted,
        isCorresponding
    };
}

// Get publications from TOML with proper type conversion
export function getPublicationsFromToml(filename: string): Publication[] {
    const tomlData = getTomlContent<{ publication?: Record<string, unknown>[] }>(filename);
    
    if (!tomlData?.publication) {
        return [];
    }
    
    return tomlData.publication.map((pub: Record<string, unknown>) => {
        const result: Publication = {
            ...pub,
            type: pub.pubType || pub.type, // Map pubType to type
            researchArea: pub.researcharea || pub.researchArea, // Map researcharea to researchArea
            authors: Array.isArray(pub.authors) 
                ? pub.authors.map((author: string | Author) => 
                    typeof author === 'string' ? parseAuthor(author) : author
                  )
                : []
        } as Publication;
        return result;
    });
}
