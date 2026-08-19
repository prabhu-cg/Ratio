/**
 * A design context the Colour Usage Map can be viewed through (Marketing
 * Website, SaaS / Product, ...). Contexts only change which usage items
 * are emphasised and how the illustrative examples look — never the
 * user's actual palette, ratio, insights, or accessibility results.
 */
export type UsageContextId = 'general' | 'marketing' | 'saas' | 'mobile' | 'editorial';

export interface UsageContext {
  id: UsageContextId;
  name: string;
  description: string;
}
