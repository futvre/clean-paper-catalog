import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export default async function handler(req, res) {
  try {
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();

    // Ανάγνωση του φύλλου "Products"
    const sheet = doc.sheetsByTitle['Products'];
    const rows = await sheet.getRows();

    const products = rows
      .filter(row => row.get('Active') === 'Ναι' || row.get('Active') === 'TRUE')
      .map(row => ({
        sku: row.get('SKU'),
        name: row.get('Name'),
        category: row.get('Category'),
        brand: row.get('Brand'),
        description: row.get('Description'),
        package: row.get('Package'),
        wholesalePrice: row.get('WholesalePrice'),
        retailPrice: row.get('RetailPrice'),
        stock: row.get('Stock'),
        image: row.get('Image'),
        sds: row.get('SDS'),
      }));

    // ΑΠΕΝΕΡΓΟΠΟΙΗΣΗ CACHE: Πάντα φρέσκα δεδομένα σε πραγματικό χρόνο
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Access-Control-Allow-Origin', '*');

    return res.status(200).json({ success: true, products });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
