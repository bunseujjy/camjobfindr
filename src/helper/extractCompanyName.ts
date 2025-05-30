export function extractCompanyName(html: string | undefined): { companyName: string | null; logoUrl: string | null } {
    const companyNameMatch = html?.match(/<strong>Employer:<\/strong>(.*?)<br\/>/)
    const companyName = companyNameMatch ? companyNameMatch[1].trim() : "Unknown Company"
  
    const logoUrlMatch = html?.match(/<img.*?src="(.*?)"/)
    const logoUrl = logoUrlMatch ? logoUrlMatch[1] : null
  
    return { companyName, logoUrl }
  }