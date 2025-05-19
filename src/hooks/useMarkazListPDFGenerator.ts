import { useState } from 'react';

interface GenerateMarkazListPDFParams {
  boardInfo: any;
  allMarkaz: any;
  madrasahType: string;
  examType: string;
  districts: string[];
  zones: Array<{ id: string; name: string }>;
  exam: any;
}

/**
 * Hook for generating PDF of markaz-wise student list
 * @returns {Object} Object containing generatePDF function, loading state, error state and hasPDF flag
 */
export const useMarkazListPDFGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  const generatePDF = async (params: GenerateMarkazListPDFParams) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_JSREPORT_SERVER_URL}/generate-markaz-list-with-student-list`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/pdf'
          },
          body: JSON.stringify(params)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      setPdfBlob(blob);
      
      // Create a download link
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = 'মারকায ভিত্তিক পরীক্ষার্থীদের তালিকা.pdf';
      
      // Append to body, click and remove
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // Clean up URL after a delay
      setTimeout(() => {
        URL.revokeObjectURL(downloadLink.href);
      }, 1000);

      return blob;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while generating PDF';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    generatePDF,
    loading,
    error,
    hasPDF: !!pdfBlob
  };
};