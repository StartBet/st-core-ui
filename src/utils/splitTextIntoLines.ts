export const splitTextIntoLines = (text: string, lineCount: number) => {
  const normalized = Math.max(1, Math.trunc(lineCount));
  if (normalized <= 1) return [text.trim()];

  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const cappedLines = Math.min(normalized, words.length);
  const base = Math.trunc(words.length / cappedLines);
  const remainder = words.length % cappedLines;

  const lines: string[] = [];
  let index = 0;

  for (let i = 0; i < cappedLines; i++) {
    const size = base + (i < remainder ? 1 : 0);
    lines.push(words.slice(index, index + size).join(' '));
    index += size;
  }

  return lines;
};
