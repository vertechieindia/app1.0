/**
 * Monaco-based editor for job coding assessments.
 * Uses data-allow-paste only when paste is allowed (see main.tsx security policy).
 */

import React, { useCallback } from 'react';
import { Box } from '@mui/material';
import Editor, { OnMount } from '@monaco-editor/react';

const LANG_MAP: Record<string, string> = {
  javascript: 'javascript',
  typescript: 'typescript',
  python: 'python',
  java: 'java',
  cpp: 'cpp',
  csharp: 'csharp',
  go: 'go',
  rust: 'rust',
  sql: 'sql',
};

export interface AssessmentCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  height?: number | string;
  readOnly?: boolean;
  /** When false, paste is blocked (no data-allow-paste) and optional callback fires on paste attempts */
  allowPaste?: boolean;
  onPasteBlocked?: () => void;
  /** `light` maps to Monaco built-in `vs` (Monaco has no theme named "light"). */
  theme?: 'vs-dark' | 'vs' | 'light';
  /** When true, no top border / flat top — for use under a custom toolbar row */
  embeddedUnderToolbar?: boolean;
}

const AssessmentCodeEditor: React.FC<AssessmentCodeEditorProps> = ({
  value,
  onChange,
  language,
  height = 400,
  readOnly = false,
  allowPaste = true,
  onPasteBlocked,
  theme = 'vs-dark',
  embeddedUnderToolbar = false,
}) => {
  const monacoLang = LANG_MAP[String(language || '').toLowerCase()] || 'javascript';
  const monacoTheme = theme === 'light' ? 'vs' : theme;

  const handleMount: OnMount = useCallback((editor) => {
    editor.focus();
  }, []);

  const handlePasteCapture = useCallback(
    (e: React.ClipboardEvent) => {
      if (!allowPaste) {
        e.preventDefault();
        e.stopPropagation();
        onPasteBlocked?.();
      }
    },
    [allowPaste, onPasteBlocked]
  );

  const fillParent = height === '100%';

  return (
    <Box
      data-allow-paste={allowPaste ? 'true' : undefined}
      onPasteCapture={handlePasteCapture}
      sx={{
        borderRadius: embeddedUnderToolbar ? '0 0 8px 8px' : 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        ...(embeddedUnderToolbar && { borderTop: 'none' }),
        ...(fillParent && { flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', height: '100%' }),
        '& .monaco-editor': { borderRadius: embeddedUnderToolbar ? '0 0 8px 8px' : 2 },
      }}
    >
      <Editor
        height={height}
        language={monacoLang}
        value={value}
        theme={monacoTheme}
        onChange={(v) => onChange(v ?? '')}
        onMount={handleMount}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: '"Fira Code", "Monaco", "Consolas", monospace',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          padding: { top: 12 },
          renderLineHighlight: 'all',
          smoothScrolling: true,
          cursorBlinking: 'smooth',
        }}
      />
    </Box>
  );
};

export default AssessmentCodeEditor;
