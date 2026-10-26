import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { customerInfo, cart, totalCartValue, wholesaleUnlocked, captchaToken } = req.body;

    // 🛡️ 1. Επαλήθευση Cloudflare Turnstile Captcha (Κόβει τα bots)
    if (!captchaToken) {
      return res.status(400).json({ success: false, message: 'Απαιτείται επαλήθευση ασφαλείας (CAPTCHA).' });
    }

    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: captchaToken
      })
    });

    const verifyData = await verifyRes.json();
    if (!verifyData.success) {
      return res.status(400).json({ success: false, message: 'Η επαλήθευση ασφαλείας απέτυχε.' });
    }

    if (!customerInfo || !customerInfo.email || !customerInfo.name || !customerInfo.address) {
      return res.status(400).json({ success: false, message: 'Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία.' });
    }

    // 🛡️ 2. Καθαρισμός εισόδου (Sanitization) κατά του Email Header Injection
    const sanitize = (str) => typeof str === 'string' ? str.replace(/[\r\n]/g, ' ').trim() : '';
    
    const safeName = sanitize(customerInfo.name);
    const safeCompany = sanitize(customerInfo.company);
    const safePhone = sanitize(customerInfo.phone);
    const safeEmail = sanitize(customerInfo.email);
    const safeAddress = sanitize(customerInfo.address);
    const safeNotes = sanitize(customerInfo.notes);

    // Ρύθμιση αποστολής μέσω Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const itemsText = cart.map(item => {
      const price = wholesaleUnlocked ? item.wholesalePrice : item.retailPrice;
      return `• ${item.title} (SKU: ${item.sku})\n  Ποσότητα: ${item.qty} | Τιμή Μονάδας: €${price.toFixed(2)} | Σύνολο: €${(price * item.qty).toFixed(2)}`;
    }).join('\n\n');

    // 📩 Email προς εσένα
    const ownerMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `📦 Νέα Παραγγελία από: ${safeName} (${safeCompany || 'Ιδιώτης'})`,
      text: `Έλαβες νέα παραγγελία από το site!

👤 ΣΤΟΙΧΕΙΑ ΠΕΛΑΤΗ:
- Ονοματεπώνυμο: ${safeName}
- Εταιρεία / ΑΦΜ: ${safeCompany || 'Δεν ορίστηκε'}
- Τηλέφωνο: ${safePhone}
- Email: ${safeEmail}
- Διεύθυνση Αποστολής: ${safeAddress}
- Σημειώσεις: ${safeNotes || 'Καμία'}

📦 ΠΡΟΪΟΝΤΑ:
${itemsText}

----------------------------------------
💰 ΣΥΝΟΛΟ ΠΑΡΑΓΓΕΛΙΑΣ: €${totalCartValue.toFixed(2)}
Τύπος Τιμών: ${wholesaleUnlocked ? 'Χονδρική (B2B)' : 'Λιανική'}`
    };

    // 📩 Email επιβεβαίωσης προς τον πελάτη (HTML)
    const customerMailOptions = {
      from: process.env.EMAIL_USER,
      to: safeEmail,
      subject: `📦 Επιβεβαίωση Παραγγελίας - Clean & Paper TOP`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0;">
          <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #10b981;">
            <h2 style="color: #065f46; margin: 0; font-size: 24px;">Clean & Paper <span style="font-size: 12px; background-color: #d1fae5; color: #065f46; padding: 2px 8px; border-radius: 10px;">TOP</span></h2>
            <p style="color: #64748b; font-size: 13px; margin: 5px 0 0 0;">Είδη Καθαρισμού & Χαρτικά</p>
          </div>
          
          <div style="padding: 20px 0;">
            <p style="font-size: 16px; color: #1e293b;">Γεια σας <strong>${safeName}</strong>,</p>
            <p style="font-size: 14px; color: #475569; line-height: 1.5;">
              Σας ευχαριστούμε θερμά για την παραγγελία σας! Λάβαμε το αίτημά σας και θα επικοινωνήσουμε άμεσα μαζί σας για την επιβεβαίωση και την παράδοση.
            </p>
            
            <h3 style="color: #065f46; font-size: 15px; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; margin-top: 25px;">📋 Σύνοψη Παραγγελίας</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px;">
              <thead>
                <tr style="background-color: #f1f5f9; color: #334155; text-align: left;">
                  <th style="padding: 8px; border-bottom: 1px solid #cbd5e1;">Προϊόν</th>
                  <th style="padding: 8px; border-bottom: 1px solid #cbd5e1; text-align: center;">Ποσότητα</th>
                  <th style="padding: 8px; border-bottom: 1px solid #cbd5e1; text-align: right;">Σύνολο</th>
                </tr>
              </thead>
              <tbody>
                ${cart.map(item => {
                  const price = wholesaleUnlocked ? item.wholesalePrice : item.retailPrice;
                  return `
                    <tr>
                      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${item.title}<br><span style="font-size: 11px; color: #64748b;">SKU: ${item.sku}</span></td>
                      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #1e293b;">${item.qty}</td>
                      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right; color: #1e293b; font-weight: bold;">€${(price * item.qty).toFixed(2)}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>

            <div style="margin-top: 20px; background-color: #ecfdf5; padding: 15px; border-radius: 8px; border: 1px solid #a7f3d0;">
              <p style="margin: 0; font-size: 14px; color: #065f46; display: flex; justify-content: space-between;">
                <strong>Συνολικό Ποσό:</strong> 
                <span style="font-size: 18px; font-weight: bold; color: #047857;">€{totalCartValue.toFixed(2)}</span>
              </p>
            </div>

            <div style="margin-top: 20px; font-size: 13px; color: #475569;">
              <p style="margin: 5px 0;"><strong>📍 Στοιχεία Αποστολής:</strong></p>
              <p style="margin: 3px 0;">Διεύθυνση: ${safeAddress}</p>
              <p style="margin: 3px 0;">Τηλέφωνο: ${safePhone}</p>
              ${safeCompany ? `<p style="margin: 3px 0;">Εταιρεία/ΑΦΜ: ${safeCompany}</p>` : ''}
            </div>
          </div>

          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 12px;">
            <p style="margin: 0;">Clean & Paper TOP • Τηλ: +30 210 0000000 • Email: orders@cleanpaper.gr</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(ownerMailOptions);
    await transporter.sendMail(customerMailOptions);

    return res.status(200).json({ success: true, message: 'Η παραγγελία καταχωρήθηκε επιτυχώς!' });
  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
