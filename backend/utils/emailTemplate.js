const getOtpEmailTemplate = (otp, title, message) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
          body {
              font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f0fdf4;
              margin: 0;
              padding: 0;
          }
          .container {
              max-width: 600px;
              margin: 40px auto;
              background-color: #ffffff;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 10px 30px rgba(22, 163, 74, 0.1);
              border: 1px solid #dcfce7;
          }
          .header {
              background-color: #16a34a;
              padding: 30px 40px;
              text-align: center;
          }
          .header h1 {
              color: #ffffff;
              margin: 0;
              font-size: 28px;
              font-weight: 800;
              letter-spacing: -0.5px;
          }
          .content {
              padding: 40px;
              color: #333333;
              line-height: 1.6;
          }
          .content h2 {
              margin-top: 0;
              color: #14532d;
              font-size: 22px;
              font-weight: 700;
          }
          .content p {
              margin-bottom: 24px;
              font-size: 16px;
              color: #4b5563;
          }
          .otp-container {
              background-color: #f0fdf4;
              border: 1px solid #bbf7d0;
              border-radius: 12px;
              padding: 24px;
              text-align: center;
              margin: 32px 0;
          }
          .otp-code {
              font-size: 36px;
              font-weight: 800;
              color: #15803d;
              letter-spacing: 8px;
              margin: 0;
          }
          .footer {
              background-color: #f8fafc;
              padding: 24px 40px;
              text-align: center;
              border-top: 1px solid #e2e8f0;
          }
          .footer p {
              margin: 0;
              font-size: 13px;
              color: #64748b;
          }
          .warning {
              font-size: 13px;
              color: #ef4444;
              text-align: center;
              margin-top: 24px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Vishtara Capital Research</h1>
          </div>
          <div class="content">
              <h2>${title}</h2>
              <p>${message}</p>
              
              <div class="otp-container">
                  <p style="margin: 0 0 8px 0; font-size: 14px; text-transform: uppercase; font-weight: 700; color: #166534; letter-spacing: 1px;">Your OTP Code</p>
                  <p class="otp-code">${otp}</p>
              </div>
              
              <p>This OTP is valid for <strong>10 minutes</strong>. Do not share this code with anyone.</p>
              <p class="warning">If you did not request this OTP, please ignore this email.</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Vishtara Capital Research. All rights reserved.</p>
              <p style="margin-top: 8px;">SEBI REG: INH000018559</p>
          </div>
      </div>
  </body>
  </html>
  `;
};

module.exports = getOtpEmailTemplate;
