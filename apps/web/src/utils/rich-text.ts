export type TextPart = { text: string; href?: string }

const linkPattern = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g

// microCMS のテキストを空行で段落に分け、[文字](URL) をリンクの部品にする
export const toParagraphs = (text: string): TextPart[][] =>
  text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const parts: TextPart[] = []
      let last = 0
      for (const match of block.matchAll(linkPattern)) {
        if (match.index > last)
          parts.push({ text: block.slice(last, match.index) })
        parts.push({ text: match[1], href: match[2] })
        last = match.index + match[0].length
      }
      if (last < block.length) parts.push({ text: block.slice(last) })
      return parts
    })

export const toPlainText = (text: string) =>
  text
    .replace(linkPattern, '$1')
    .replace(/\s*\n+\s*/g, ' ')
    .trim()

export const firstParagraph = (text: string) =>
  toPlainText(text.split(/\n{2,}/)[0] ?? '')
