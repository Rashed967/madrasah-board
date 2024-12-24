import React from 'react';

interface MadrasahListPrintProps {
  madrasahs: any[];
}

const MadrasahListPrint: React.FC<MadrasahListPrintProps> = ({ madrasahs }) => {
  return (
    <div style={{ 
      width: '297mm',  // A4 Landscape width
      minHeight: '210mm', // A4 Landscape height
      margin: '0 auto',
      padding: '15mm',
      backgroundColor: 'white'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '10mm' }}>
        <h1 style={{ 
          fontSize: '18pt', 
          fontWeight: 'bold',
          marginBottom: '4mm'
        }}>
          জাতীয় দ্বীনি মাদরাসা শিক্ষাবোর্ড
        </h1>
        <p style={{ 
          fontSize: '11pt',
          marginBottom: '4mm'
        }}>
          অস্থায়ী কার্যালয় : ৩৪১/৫ টি ডি রোড, রামপুরা, ঢাকা
        </p>
        <h2 style={{ 
          fontSize: '14pt',
          fontWeight: 'bold',
          border: '1px solid #000',
          padding: '2mm 4mm',
          display: 'inline-block'
        }}>
          মাদরাসা তালিকা
        </h2>
      </div>

      {/* Table */}
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse',
        fontSize: '11pt'
      }}>
        <thead>
          <tr>
            <th style={{ 
              border: '1px solid #000', 
              padding: '2mm 3mm',
              textAlign: 'center',
              width: '50px',
              backgroundColor: '#fff'
            }}>ক্রমিক</th>
            <th style={{ 
              border: '1px solid #000', 
              padding: '2mm 3mm',
              textAlign: 'left',
              width: '80px',
              backgroundColor: '#fff'
            }}>কোড</th>
            <th style={{ 
              border: '1px solid #000', 
              padding: '2mm 3mm',
              textAlign: 'left',
              backgroundColor: '#fff'
            }}>মাদরাসার নাম</th>
            <th style={{ 
              border: '1px solid #000', 
              padding: '2mm 3mm',
              textAlign: 'left',
              backgroundColor: '#fff'
            }}>মুহতামিম</th>
            <th style={{ 
              border: '1px solid #000', 
              padding: '2mm 3mm',
              textAlign: 'left',
              backgroundColor: '#fff'
            }}>সংক্ষিপ্ত ঠিকানা</th>
            <th style={{ 
              border: '1px solid #000', 
              padding: '2mm 3mm',
              textAlign: 'left',
              width: '120px',
              backgroundColor: '#fff'
            }}>মোবাইল</th>
          </tr>
        </thead>
        <tbody>
          {madrasahs.map((madrasah, index) => (
            <tr key={madrasah.id}>
              <td style={{ 
                border: '1px solid #000', 
                padding: '2mm 3mm',
                textAlign: 'center'
              }}>{index + 1}</td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '2mm 3mm'
              }}>{madrasah.code}</td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '2mm 3mm'
              }}>{madrasah.name}</td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '2mm 3mm'
              }}>{madrasah.muhtamimName}</td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '2mm 3mm'
              }}>
                {[
                  madrasah.village,
                  madrasah.policeStation,
                  madrasah.district
                ].filter(Boolean).join(', ')}
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '2mm 3mm'
              }}>{madrasah.mobile}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MadrasahListPrint;
