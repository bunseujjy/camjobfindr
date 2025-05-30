export function extractImageSrc(html: string): string | null {
    const match = html.match(/<img.*?src="(.*?)"/)
    return match ? match[1] : null
  }