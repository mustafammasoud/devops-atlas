export interface Category {
  /** Stable id used in document frontmatter (`category:`). */
  id: string;
  labelAr: string;
  labelEn: string;
  order: number;
}

/** Known documentation categories, in display order. */
export const categories: Category[] = [
  { id: 'linux', labelAr: 'لينكس', labelEn: 'Linux', order: 1 },
  { id: 'git', labelAr: 'جيت', labelEn: 'Git', order: 2 },
  { id: 'docker', labelAr: 'دوكر', labelEn: 'Docker', order: 3 },
  { id: 'ci-cd', labelAr: 'التكامل والتسليم المستمر', labelEn: 'CI/CD', order: 4 },
  { id: 'kubernetes', labelAr: 'كوبرنيتيس', labelEn: 'Kubernetes', order: 5 },
  { id: 'aws', labelAr: 'أمازون ويب سيرفيسز', labelEn: 'AWS', order: 6 },
  { id: 'terraform', labelAr: 'تيرافورم', labelEn: 'Terraform', order: 7 },
  { id: 'observability', labelAr: 'المراقبة والرصد', labelEn: 'Observability', order: 8 },
];

const byId = new Map(categories.map((category) => [category.id, category]));

export function getCategory(id: string): Category | undefined {
  return byId.get(id);
}

/**
 * Sort key for a category id: known categories keep their canonical order,
 * unknown ones (added later without registration) are placed last.
 */
export function categoryOrder(id: string): number {
  const index = categories.findIndex((category) => category.id === id);
  return index === -1 ? categories.length : index;
}

/** Human-readable label for a category id (falls back to the raw id). */
export function categoryLabel(id: string): string {
  const category = byId.get(id);
  return category ? category.labelAr : id;
}

const LEVEL_LABELS: Record<string, string> = {
  beginner: 'مبتدئ',
  intermediate: 'متوسط',
  advanced: 'متقدم',
};

export function levelLabel(level: string): string {
  return LEVEL_LABELS[level] ?? level;
}
