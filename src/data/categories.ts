export interface Category {
  /**
   * Stable id used in document frontmatter (`category:`) and as the
   * `content/<id>/` folder name. Content never depends on anything else in
   * this file — unknown ids still work (they are ordered last and labelled
   * with their raw id until registered here).
   */
  id: string;
  /** Arabic display name (UI language). */
  labelAr: string;
  /** English display name (used for the Latin subtitle). */
  labelEn: string;
  /** Visual ordering only. */
  order: number;
}

/**
 * Presentation metadata ONLY: display names and visual order.
 * Future presentation fields (description, icon, …) belong here too.
 * Nothing in the content schema references this file.
 *
 * The list is a living registry, not a fixed roadmap — categories grow,
 * merge and disappear over time. See `docs-roadmap.md` for the content
 * blueprint this mirrors.
 */
export const categories: Category[] = [
  { id: 'foundations', labelAr: 'الأساسات', labelEn: 'Foundations', order: 1 },
  { id: 'linux', labelAr: 'لينكس', labelEn: 'Linux', order: 2 },
  { id: 'networking', labelAr: 'الشبكات', labelEn: 'Networking', order: 3 },
  { id: 'git', labelAr: 'جيت', labelEn: 'Git', order: 4 },
  { id: 'docker', labelAr: 'دوكر', labelEn: 'Docker', order: 5 },
  { id: 'ci-cd', labelAr: 'التكامل والتسليم المستمر', labelEn: 'CI/CD', order: 6 },
  { id: 'kubernetes', labelAr: 'كوبرنيتيس', labelEn: 'Kubernetes', order: 7 },
  { id: 'cloud', labelAr: 'السحابة', labelEn: 'Cloud', order: 8 },
  { id: 'terraform', labelAr: 'تيرافورم', labelEn: 'Terraform', order: 9 },
  { id: 'observability', labelAr: 'المراقبة والرصد', labelEn: 'Observability', order: 10 },
  { id: 'security', labelAr: 'الأمان', labelEn: 'Security', order: 11 },
  { id: 'troubleshooting', labelAr: 'استكشاف الأخطاء', labelEn: 'Troubleshooting', order: 12 },
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
