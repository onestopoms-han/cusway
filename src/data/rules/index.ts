import { ClassificationRule } from '../../components/HsClassifier';
import { chapter19Rules } from './chapter_19';
import { chapter21Rules } from './chapter_21';
import { chapter25Rules } from './chapter_25';
import { chapter33Rules } from './chapter_33';
import { chapter72Rules } from './chapter_72';
import { chapter73Rules } from './chapter_73';
import { chapter96Rules } from './chapter_96';
import { chapter39Rules } from './chapter_39';

export const KOREAN_HS_RULES: ClassificationRule[] = [
  ...chapter19Rules,
  ...chapter21Rules,
  ...chapter25Rules,
  ...chapter33Rules,
  ...chapter72Rules,
  ...chapter73Rules,
  ...chapter96Rules,
  ...chapter39Rules
];
