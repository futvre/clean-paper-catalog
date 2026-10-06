import React, { useState, useMemo } from 'react';
import { 
  Package, ShoppingCart, Lock, Unlock, Search, ShieldCheck, 
  FileText, ArrowRight, Check, Send, Download, RefreshCw, 
  Sparkles, Layers, SlidersHorizontal
} from 'lucide-react';

const INITIAL_PRODUCTS = [
  {
    id: "PROD-101",
    sku: "XP-2001",
    title: "Επαγγελματικό Ρολό Υγείας Jumbo 2-ply (12άδα)",
    category: "Χαρτικά Επαγγελματικά",
    packaging: "Κιβώτιο 12 Ρολά x 500g",
    palletInfo: "36 Κιβώτια / Παλέτα",
    retailPrice: 24.50,
    wholesalePrice: 18.90,
    minOrderQty: 2,
    inStock: true,
    ecoBadge: "Ecolabel EU",
    sdsUrl: "#",
    description: "100% κυτταρίνη υψηλής αντοχής και απορροφητικότητας. Ιδανικό για χώρους εστίασης, ξενοδοχεία και γραφεία."
  },
  {
    id: "PROD-102",
    sku: "XP-2008",
    title: "Χειροπετσέτα Ζήτα (Z-Fold) Λευκή 2-φυλλη Premium",
    category: "Χαρτικά Επαγγελματικά",
    packaging: "Κιβώτιο 3000 Φύλλα (15x200)",
    palletInfo: "40 Κιβώτια / Παλέτα",
    retailPrice: 29.90,
    wholesalePrice: 22.40,
    minOrderQty: 1,
    inStock: true,
    ecoBadge: "ISO 9001",
    sdsUrl: "#",
    description: "Εξαιρετικά μαλακή και απορροφητική χειροπετσέτα. Μηδενική διασπορά χνουδιού."
  },
  {
    id: "PROD-103",
    sku: "CLEAN-501",
    title: "Επαγγελματικό Απορρυπαντικό Επιφανειών Multi-Clean 10L",
    category: "Καθαριστικά Επιφανειών",
    packaging: "Δοχείο 10 Λίτρων",
    palletInfo: "60 Δοχεία / Παλέτα",
    retailPrice: 19.80,
    wholesalePrice: 14.50,
    minOrderQty: 1,
    inStock: true,
    ecoBadge: "Safe Food Contact",
    sdsUrl: "#",
    description: "Συμπυκνωμένο ουδέτερο καθαριστικό για μάρμαρα, πλακάκια και ανοξείδωτες επιφάνειες. Άρωμα λεμόνι."
  },
  {
    id: "PROD-104",
    sku: "CLEAN-702",
    title: "Υγρό Πιάτων Επαγγελματικό Extra Degreaser 5kg",
    category: "Απορρυπαντικά Πιάτων",
    packaging: "Δοχείο 5kg (Συσκευασία 4 τμχ)",
    palletInfo: "48 Κιβώτια / Παλέτα",
    retailPrice: 12.20,
    wholesalePrice: 8.90,
    minOrderQty: 4,
    inStock: true,
    ecoBadge: "Ecolabel EU",
    sdsUrl: "#",
    description: "Ισχυρή σύνθεση εξουδετέρωσης λιπών για επαγγελματικά πλυντήρια και πλύσιμο στο χέρι."
  }
];

export default function App() {
  const [products] = useState(INITIAL_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Όλα");
  const [wholesaleUnlocked, setWholesaleUnlocked] = useState(false);
  const [b2bPin, setB2bPin] = useState("");
  const [showPinModal, setShowPinModal] = useState(false);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const categories = ["Όλα", "Χαρτικά Επαγγελματικά", "Καθαριστικά Επιφανειών", "Απορρυπαντικά Πιάτων"];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = selectedCategory === "Όλα" || p.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [products, searchTerm, selectedCategory]);

  const handleUnlock = (e) => {
    e.preventDefault();
    if (b2bPin === "b2b2026" || b2bPin === "1234") {
      setWholesaleUnlocked(true);
      setShowPinModal(false);
      setB2bPin("");
    } else {
      alert("Λανθασμένος κωδικός B2B. Δοκιμάστε b2b2026");
    }
  };

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => item.id === product.id ? { ...item, qty: item.qty + qty } : item);
      }
      return [...prev, { ...product, qty }];
    });
  };

  const totalCartValue = cart.reduce((sum, item) => {
    const price = wholesaleUnlocked ? item.wholesalePrice : item.retailPrice;
    return sum + price * item.qty;
  }, 0);

  const generateOrderText = () => {
    let text = `📦 *ΝΕΑ ΠΑΡΑΓΓΕΛΙΑ B2B*\n\n`;
    cart.forEach((item) => {
      const price = wholesaleUnlocked ? item.wholesalePrice : item.retailPrice;
      text += `• ${item.title} (${item.sku})\n  Ποσότητα: ${item.qty} \vert{} Τιμή: €${(price * item.qty).toFixed(2)}\n`;
    });
    text += `\n💰 *Σύνολο:* €${totalCartValue.toFixed(2)}`;
    return encodeURIComponent(text);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                Clean & Paper PRO
              </h1>
              <p className="text-xs text-slate-500 font-medium">B2B Κατάλογος Χαρτικών & Απορρυπαντικών</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => wholesaleUnlocked ? setWholesaleUnlocked(false) : setShowPinModal(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-semibold transition ${
                wholesaleUnlocked 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {wholesaleUnlocked ? <Unlock className="w-4 h-4 text-emerald-600" /> : <Lock className="w-4 h-4" />}
              <span>{wholesaleUnlocked ? "B2B Τιμές Ενεργές" : "Ξεκλείδωμα Χονδρικής"}</span>
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
            >
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Αναζήτηση με SKU ή Όνομα..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace
