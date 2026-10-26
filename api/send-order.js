import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { customerInfo, cart, totalCartValue, wholesaleUnlocked } = req.body;

    if (!customerInfo || !customerInfo.email || !customerInfo.name) {
      return res.status(400).json({ success: false, message: 'Παρακαλώ συμπληρώστε τα απαραίτητα στοιχεία.' });
    }

    // Ρύθμιση αποστολής μέσω Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Δημιουργία λίστας προϊόντων σε κείμενο
    const itemsText = cart.map(item => {
      const price = wholesaleUnlocked ? item.wholesalePrice : item.retailPrice;
      return `• ${item.title} (SKU: ${item.sku})\n  Ποσότητα: ${item.qty} | Τιμή Μονάδας: €${price.toFixed(2)} | Σύνολο: €${(price * item.qty).toFixed(2)}`;
    }).join('\n\n');

    // 📩 Email 1: Προς εσένα (με όλα τα στοιχεία της φόρμας)
    const ownerMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `📦 Νέα Παραγγελία από: ${customerInfo.name} (${customerInfo.company || 'Ιδιώτης'})`,
      text: `Έλαβες νέα παραγγελία από το site!

👤 ΣΤΟΙΧΕΙΑ ΠΕΛΑΤΗ:
- Ονοματεπώνυμο: ${customerInfo.name}
- Εταιρεία / ΑΦΜ: ${customerInfo.company || 'Δεν ορίστηκε'}
- Τηλέφωνο: ${customerInfo.phone}
- Email: ${customerInfo.email}
- Διεύθυνση Αποστολής: ${customerInfo.address || 'Δεν ορίστηκε'}
- Σημειώσεις: ${customerInfo.notes || 'Καμία'}

📦 ΠΡΟΪΟΝΤΑ:
${itemsText}

----------------------------------------
💰 ΣΥΝΟΛΟ ΠΑΡΑΓΓΕΛΙΑΣ: €${totalCartValue.toFixed(2)}
Τύπος Τιμών: ${wholesaleUnlocked ? 'Χονδρική (B2B)' : 'Λιανική'}`
    };

    // 📩 Email 2: Επιβεβαίωση Προς τον Πελάτη
    const customerMailOptions = {
      from: process.env.EMAIL_USER,
      to: customerInfo.email,
      subject: `Επιβεβαίωση Παραγγελίας - Clean & Paper PRO`,
      text: `Γεια σας ${customerInfo.name},

Σας ευχαριστούμε για την παραγγελία σας! Λάβαμε το αίτημά σας και θα επικοινωνήσουμε σύντομα μαζί σας για την επιβεβαίωση και την παράδοση.

📋 ΣΥΝΟΨΗ ΠΑΡΑΓΓΕΛΙΑΣ:
${itemsText}

----------------------------------------
💰 ΣΥΝΟΛΟ: €${totalCartValue.toFixed(2)}

📍 Στοιχεία Αποστολής:
- Διεύθυνση: ${customerInfo.address || 'Δεν ορίστηκε'}
- Τηλέφωνο: ${customerInfo.phone}

Με εκτίμηση,
Η ομάδα της Clean & Paper PRO
Τηλ. Επικοινωνίας: +30 210 0000000`
    };

    // Αποστολή και των δύο email
    await transporter.sendMail(ownerMailOptions);
    await transporter.sendMail(customerMailOptions);

    return res.status(200).json({ success: true, message: 'Η παραγγελία καταχωρήθηκε επιτυχώς!' });
  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
