
export type Category = 'Photos' | 'SWL' | 'WID' | 'CAR' | 'CAS' | 'PRS' | 'INZ' | 'ICT';

export const FOLDER_MAPPING: Record<Category, string> = {
  Photos: 'img',
  SWL: 'swl',
  WID: 'wid',
  CAR: 'car',
  CAS: 'cas',
  PRS: 'prs',
  INZ: 'inz',
  ICT: 'ict'
}; 