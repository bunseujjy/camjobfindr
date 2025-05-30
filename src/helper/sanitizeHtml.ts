export function sanitizeHtml(html: string): string {
    // This is a very basic sanitization. For production, use a proper HTML sanitizer library.
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .replace(/<img\b[^>]*>/gi, "")
  }