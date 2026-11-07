import { HadithItem, Category } from '../types';
import { HISN_AL_MUSLIM_HADITHS } from './hisnAlMuslim';
import { NAWAWI_HADITHS } from './nawawi40';
import { BUKHARI_MUSLIM_JAMI_HADITHS } from './bukhariMuslimJami';

export const CATEGORIES: Category[] = [
  { id: 'all', label: 'جميع الأحاديث والأدعية' },
  { id: 'bookmarks', label: 'المحفوظات' },
  { id: 'hisn-sabah-masaa', label: 'أذكار الصباح والمساء' },
  { id: 'hisn-salah-wudu', label: 'الصلاة والطهارة والمساجد' },
  { id: 'hisn-nawm-qiyam', label: 'النوم وقيام الليل والتهجد' },
  { id: 'hisn-hajj-siyam', label: 'الحج والعمرة والصيام' },
  { id: 'hisn-karb-duaa', label: 'الكرب والهم والشدائد' },
  { id: 'hisn-usra-adab', label: 'الأسرة واللباس والمعاشرة' },
  { id: 'hisn-taam-safar', label: 'الطعام والسفر والنزول' },
  { id: 'hisn-marad-janaiz', label: 'المرض والرقية والابتلاء والجنائز' },
  { id: 'nawawi', label: 'الأربعين النووية كاملة (42 حديثاً)' },
  { id: 'jami', label: 'صحاح السنة وفضائل الأعمال' },
];

// Unified complete dataset combining Hisn al-Muslim, full 42 Nawawi hadiths, and Sahihayn classical hadiths
export const HADITHS_DATA: HadithItem[] = [
  ...HISN_AL_MUSLIM_HADITHS,
  ...NAWAWI_HADITHS,
  ...BUKHARI_MUSLIM_JAMI_HADITHS,
];
