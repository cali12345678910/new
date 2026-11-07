export type CategoryId = 
  | 'all'
  | 'bookmarks'
  | 'hisn-sabah-masaa'
  | 'hisn-salah-wudu'
  | 'hisn-nawm-qiyam'
  | 'hisn-hajj-siyam'
  | 'hisn-karb-duaa'
  | 'hisn-usra-adab'
  | 'hisn-taam-safar'
  | 'hisn-marad-janaiz'
  | 'nawawi'
  | 'jami';

export interface Category {
  id: CategoryId;
  label: string;
  count?: number;
}

export interface HadithItem {
  id: string;
  title: string;
  text: string;
  reference: string;
  grading: 'متفق عليه' | 'صحيح' | 'حسن' | 'حسن صحيح';
  sourceBook: string;
  category: CategoryId;
  repeatCount?: number;
  virtue?: string;
  notes?: string;
  hadithNumber?: number;
}
