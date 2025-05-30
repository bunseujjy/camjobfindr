export function extractJobId(guid: string): string {
    const match = guid.match(/\d+/)
    return match ? `Job ID: ${match[0]}` : "Unknown ID"
  }  