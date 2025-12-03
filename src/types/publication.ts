export interface Author {
  name: string;
  isMainAuthor?: boolean;
  affiliation?: string;
  email?: string;
  orcid?: string;
  isHighlighted?: boolean;
  isCorresponding?: boolean;
  isCoAuthor?: boolean;
}

export interface Publication {
  id: string;
  title: string;
  authors: Author[];
  abstract?: string;
  journal?: string;
  conference?: string;
  publisher?: string;
  patentNumber?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  year: number;
  month?: string;
  publishedDate?: string;
  doi?: string;
  arxivId?: string;
  pmid?: string;
  url?: string;
  code?: string;
  dataset?: string;
  pdfUrl?: string;
  tags: string[];
  keywords?: string[];
  type: string;
  status?: string;
  citations?: number;
  impactFactor?: number;
  quartile?: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  bibtex?: string;
  venue?: string;
  location?: string;
  awards?: string[];
  featured?: boolean;
  selected?: boolean;
  preview?: string;
  summary?: string;
  researchArea: ResearchArea;
  description?: string;
  aspectRatio?: string;
}

// Research area can be any string, allowing for custom areas
export type ResearchArea = string;

