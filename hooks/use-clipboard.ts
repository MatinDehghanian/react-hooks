import { useState, useCallback } from 'react';

export interface ClipboardState {
  success: boolean;
  error: string | null;
}

const isClipboardAvailable =
  typeof navigator !== 'undefined' && typeof navigator.clipboard !== 'undefined';

/**
 * `useClipboard` provides functionality to copy to and paste from the clipboard.
 */
function useClipboard() {
  const [state, setState] = useState<ClipboardState>({ success: false, error: null });

  const copyToClipboard = useCallback(async (text: string) => {
    if (!isClipboardAvailable) {
      setState({ success: false, error: 'Clipboard is not available' });
      return;
    }

    if (!text.trim()) {
      setState({ success: false, error: 'Cannot copy empty or whitespace text' });
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setState({ success: true, error: null });
    } catch {
      setState({ success: false, error: 'Failed to copy' });
    }
  }, []);

  const pasteFromClipboard = useCallback(async (): Promise<string> => {
    if (!isClipboardAvailable) {
      setState({ success: false, error: 'Clipboard is not available' });
      return '';
    }

    try {
      const text = await navigator.clipboard.readText();
      setState({ success: true, error: null });
      return text.trim();
    } catch {
      setState({ success: false, error: 'Failed to paste' });
      return '';
    }
  }, []);

  const clearState = useCallback(() => {
    setState({ success: false, error: null });
  }, []);

  return { copyToClipboard, pasteFromClipboard, clearState, state };
}

export { useClipboard };