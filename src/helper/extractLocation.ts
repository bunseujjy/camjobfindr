export function extractLocation(html: string | undefined): string | null {
  const match = html?.match(/<strong>Location:<\/strong>(.*?)<br\/>/)
  return match ? match[1].trim() : null
}

