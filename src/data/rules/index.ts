import { ClassificationRule } from '../../components/HsClassifier';
import { chapter19Rules } from './chapter_19';
import { chapter21Rules } from './chapter_21';
import { chapter25Rules } from './chapter_25';
import { chapter72Rules } from './chapter_72';
import { chapter73Rules } from './chapter_73';

export const KOREAN_HS_RULES: ClassificationRule[] = [
  ...chapter19Rules,
  ...chapter21Rules,
  ...chapter25Rules,
  ...chapter72Rules,
  ...chapter73Rules
];
