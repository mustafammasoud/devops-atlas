/**
 * Decide how to share an article URL.
 *
 * Prefer the native share sheet. If it isn't available, or it fails for a
 * reason other than the reader dismissing it, copy the URL. If copying
 * isn't possible, the caller reveals the URL so it can be copied manually.
 * Dismissing the share sheet does not fall through to copy.
 */
export type ShareResult = 'shared' | 'copied' | 'reveal' | 'aborted';

export interface SharePayload {
  title: string;
  url: string;
}

export interface ShareDeps {
  share?: (data: SharePayload) => Promise<void>;
  /** When omitted, a provided `share` is attempted. */
  canShare?: (data: SharePayload) => boolean;
  copy: (url: string) => Promise<boolean>;
}

function isAbort(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

export async function shareArticle(data: SharePayload, deps: ShareDeps): Promise<ShareResult> {
  if (deps.share && (deps.canShare?.(data) ?? true)) {
    try {
      await deps.share(data);
      return 'shared';
    } catch (error) {
      if (isAbort(error)) return 'aborted';
    }
  }

  if (await deps.copy(data.url)) return 'copied';
  return 'reveal';
}
