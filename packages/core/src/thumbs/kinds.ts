// Which files are text, and in which language: the small part of text thumbnails (02 HTML-66c) that the element itself
// needs. The renderer lives in ./text.js and is loaded only by the worker and the server.
import { extname } from '../paths.js';

export type TextLanguage = 'js' | 'ts' | 'json' | 'css' | 'html' | 'xml' | 'md' | 'yaml' | 'toml' | 'sh' | 'py' | 'rb' | 'php' | 'c' | 'go' | 'rs' | 'sql' | 'ini' | 'csv' | 'txt';

const LANG: Record<string, TextLanguage> = {
  '.js': 'js', '.mjs': 'js', '.cjs': 'js', '.jsx': 'js', '.ts': 'ts', '.tsx': 'ts', '.mts': 'ts', '.cts': 'ts',
  '.json': 'json', '.json5': 'json', '.webmanifest': 'json', '.map': 'json',
  '.css': 'css', '.scss': 'css', '.less': 'css',
  '.html': 'html', '.htm': 'html', '.vue': 'html', '.svelte': 'html', '.xml': 'xml', '.xsl': 'xml', '.rss': 'xml', '.atom': 'xml', '.plist': 'xml',
  '.md': 'md', '.markdown': 'md', '.mdx': 'md', '.yaml': 'yaml', '.yml': 'yaml', '.toml': 'toml', '.ini': 'ini', '.cfg': 'ini', '.conf': 'ini', '.env': 'ini',
  '.sh': 'sh', '.bash': 'sh', '.zsh': 'sh', '.fish': 'sh', '.py': 'py', '.rb': 'rb', '.php': 'php',
  '.c': 'c', '.h': 'c', '.cpp': 'c', '.hpp': 'c', '.cc': 'c', '.java': 'c', '.kt': 'c', '.swift': 'c', '.cs': 'c', '.go': 'go', '.rs': 'rs', '.sql': 'sql',
  '.csv': 'csv', '.tsv': 'csv', '.txt': 'txt', '.text': 'txt', '.log': 'txt', '.rtf': 'txt', '.nfo': 'txt', '.gitignore': 'ini', '.editorconfig': 'ini'
};

/** Files the browser shows as text thumbnails (API: their absolutePreviewURL may be an image rendered from the text). */
export function isTextLike(nameOrUrl: string): boolean { return extname(nameOrUrl) in LANG; }
export function languageFor(nameOrUrl: string): TextLanguage { return LANG[extname(nameOrUrl)] ?? 'txt'; }
/** A NUL byte in the first KB means binary. */
export function looksBinary(bytes: Uint8Array): boolean { const n = Math.min(bytes.length, 1024); for (let i = 0; i < n; i++) if (bytes[i] === 0) return true; return false; }

