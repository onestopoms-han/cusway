export interface HSData {
  hsCode: string;
  description: string;
  classificationLevel: number;
}

export interface EUData extends HSData {
  taricCode: string;
  tariffDescription: string;
}

export interface ConflictPoint {
  type: string;
  details: string;
  severity: 'Low' | 'Medium' | 'High';
}

export interface ClassificationResult {
  inputItemName: string;
  properties: Record<string, string>;
  krResult: HSData;
  euResult: EUData;
  comparisonSummary: string;
  conflictPoints: ConflictPoint[];
  suggestedAction: string;
}
