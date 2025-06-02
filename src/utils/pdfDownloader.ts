interface PdfDownloadOptions {
  endpoint: string;
  data: any;
  fileName: string;
}

export const downloadPdf = async ({ endpoint, data, fileName }: PdfDownloadOptions) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_JSREPORT_SERVER_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error('Failed to generate PDF')
    }

    // Convert response to blob
    const blob = await response.blob()
    
    // Create download link
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    return true
  } catch (error) {
    throw error
  }
} 