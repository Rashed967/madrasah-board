import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

export async function GET() {
  try {
    // Launch a new browser instance
    const browser = await puppeteer.launch({
      headless: true
    })

    // Create a new page
    const page = await browser.newPage()

    // Set content
    await page.setContent(`
     <!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <title>মাদ্রাসা প্রবেশপত্র</title>
  <style>
    @page {
      size: A5 landscape;
      margin: 0;
    }
    body {
      font-family: 'SolaimanLipi', 'Siyam Rupali', Arial, sans-serif;
      margin: 0;
      padding: 8mm;
      width: 210mm;
      height: 148mm;
      box-sizing: border-box;
    }
    .container {
      width: 100%;
      height: 100%;
      padding: 0;
      box-sizing: border-box;
      border: 3px solid #000000;
      position: relative;
      overflow: hidden;
    }
    .header {
      text-align: center;
      margin-bottom: 10px;
      position: relative;
      padding: 5px;
      border-bottom: 1px solid black;
    }
    .header img.logo {
      position: absolute;
      top: 15px;
      left: 14px;
      width: 70px;
    }
    .title {
      font-size: 25px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .sub-title {
      font-size: 20px;
      font-weight: bold;
    }
    .watermark {
      position: absolute;
      top: 35%;
      left: 35%;
      width: 30%;
      opacity: 0.07;
    }

    .student-top-info {
      display: flex;
      justify-content: space-between;
      font-size: 15px;
      padding: 0 15px;
    }

    .exam-info {
      display: flex;
      flex-direction: column;
      font-size: 17px;
      justify-content: center;
      align-items: center;
      gap: 0px;
      margin-bottom: 10px;
    }

    table {
      border-collapse: collapse;
    }

    td {
      border: 1px solid black;
      padding: 4px 6px;
    }

    .admit-card-title {
      font-size: 20px;
      font-weight: 600;
      padding: 5px 10px;
      border: 1px solid rgb(0, 0, 0);
      border-radius: 7px;
      background-color: aqua;
      color: #6b56c9;
    }

    .info {
      margin-top: 20px;
      font-size: 15px;
      line-height: 1.7;
      padding: 0px 15px;
    }

    .info span.label {
      display: inline-block;
      width: 100px;
    }

    .footer {
      position: absolute;
      bottom: 5px;
      left: 45px;
      width: 85%;
      display: flex;
      justify-content: space-between;
      align-items: end;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <img src="https://via.placeholder.com/150x150.png?text=Watermark" class="watermark" alt="Watermark">
    <div class="header">
      <img src="https://via.placeholder.com/70x70.png?text=Logo" class="logo" alt="Logo">
      <div class="title">وفاق المدارس الدينية بنغلاديش</div>
      <div class="title">জাতীয় দ্বীনি মাদরাসা শিক্ষা বোর্ড বাংলাদেশ</div>
      <div class="sub-title">(Befaqul Madarisil Arabia Bangladesh)</div>
    </div>

    <div class="exam-info">
      <p style="margin: 0; padding: 0; font-weight: bold;">পরীক্ষা নিয়ন্ত্রণ বিভাগ</p>
      <p style="margin: 5px 0; padding: 0; font-weight: bold;">৯ম মারকাযী পরীক্ষা - ১৪৪৬ হিজরী / ২০২৫ ঈসায়ী</p>
    </div>

    <div class="student-top-info">
      <table>
        <tbody>
          <tr>
            <td style="width: 70px;">নিবন্ধন নং</td>
            <td style="width: 100px;">১৪২৪৪</td>
          </tr>
          <tr>
            <td>রোল নং</td>
            <td>১০০১</td>
          </tr>
        </tbody>
      </table>

      <p class="admit-card-title"><strong>প্রবেশপত্র</strong></p>

      <table>
        <tbody>
          <tr>
            <td style="width: 70px; text-align: right;">মারহালা</td>
            <td style="width: 120px;">ফযীলত</td>
          </tr>
          <tr>
            <td style="text-align: right;">জন্ম তারিখ</td>
            <td>০২/০২/২০০৮ ইং</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="info">
      <div>
        <span class="label">পরীক্ষার্থীর নাম</span> 
        <span style="margin-right: 5px;">:</span> মাহমুদুল্লাহ রিয়াদ
      </div>
      <div>
        <span class="label">পিতার নাম</span>
        <span style="margin-right: 5px;">:</span> মোঃ শাহজাহান আলী
      </div>
      <div>
        <span class="label">মাদরাসা</span> 
        <span style="margin-right: 5px;">:</span> জামিআ ইকরাঃ বাংলাদেশ - ১০০০১
      </div>
      <div>
        <span class="label">মারকায</span> 
        <span style="margin-right: 5px;">:</span> জামিআ ইকরাঃ বাংলাদেশ - ১০০০১
      </div>
    </div>

    <div class="footer">
      <div class="left">
        মুহতামিমের স্বাক্ষর ও তারিখ<br>
      </div>
      <div style="font-size: 12px;">
        তারিখ: ১০/০৩/২০২৫ ইং
      </div>
      <div style="text-align: center;" class="right">
        পরীক্ষা নিয়ন্ত্রক<br>
        মাওলানা ফখরুল উমর ফারুক
      </div>
    </div>
  </div>
</body>
</html>

    `)

    // Generate PDF
    const pdf = await page.pdf({
      format: 'A5',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    })

    // Close browser
    await browser.close()

    // Return PDF as response
    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="admit-card.pdf"'
      }
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
} 