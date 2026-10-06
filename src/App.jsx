import React, { useState, useMemo } from 'react';
import { 
  Package, ShoppingCart, Lock, Unlock, Search, ShieldCheck, 
  FileText, ArrowRight, Check, Send, Download, RefreshCw, 
  Sparkles, Layers, SlidersHorizontal, Truck, Phone, Mail, 
  MapPin, Clock, Award, CheckCircle2, ChevronRight
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
    image: "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?auto=format&fit=crop&q=80&w=600",
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
    image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&q=80&w=600",
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
    image: "https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?auto=format&fit=crop&q=80&w=600",
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
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=600",
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
      text += `• ${item.title} (${item.sku})\n  Ποσότητα: ${item.qty} | Τιμή: €${(price * item.qty).toFixed(2)}\n`;
    });
    text += `\n💰 *Σύνολο:* €${totalCartValue.toFixed(2)}`;
    return encodeURIComponent(text);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between">
      <div>
        {/* Top Notification Bar */}
        <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-emerald-400" /> Δωρεάν μεταφορικά για παραγγελίες εντός Αττικής &gt;€150</span>
              <span className="hidden md:inline-flex items-center gap-1"><Award className="w-3.5 h-3.5 text-amber-400" /> Πιστοποιημένα Προϊόντα ISO & Ecolabel</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="tel:2100000000" className="hover:text-white transition flex items-center gap-1"><Phone className="w-3 h-3" /> 210 0000000</a>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">B2B Portal</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-tr from-emerald-700 to-teal-500 text-white rounded-xl shadow-md">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-600 bg-clip-text text-transparent">
                  Clean & Paper <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold uppercase tracking-wider ml-1">PRO</span>
                </h1>
                <p className="text-xs text-slate-500 font-medium">Επαγγελματικές Λύσεις Καθαρισμού & Χαρτικών</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => wholesaleUnlocked ? setWholesaleUnlocked(false) : setShowPinModal(true)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-bold transition shadow-sm ${
                  wholesaleUnlocked 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100' 
                    : 'bg-slate-900 border-slate-800 text-white hover:bg-slate-800'
                }`}
              >
                {wholesaleUnlocked ? <Unlock className="w-4 h-4 text-emerald-600" /> : <Lock className="w-4 h-4 text-amber-400" />}
                <span className="hidden sm:inline">{wholesaleUnlocked ? "B2B Τιμές Ενεργές" : "Ξεκλείδωμα Χονδρικής"}</span>
                <span className="sm:hidden">{wholesaleUnlocked ? "B2B ON" : "B2B PIN"}</span>
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition"
              >
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-black shadow-sm">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* HERO SECTION */}
        <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white py-16 px-4 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-300 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4" /> Επίσημος Προμηθευτής Χονδρικής B2B
              </div>
              <h2 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight">
                Επαγγελματικά Χαρτικά & Καθαριστικά <span className="text-emerald-400">σε Τιμές Εργοστασίου</span>
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                Άμεση τροφοδοσία για Ξενοδοχεία, Χώρους Εστίασης, Γραφεία και Βιομηχανίες. 
                Αποκτήστε πρόσβαση στον κατάλογο B2B με ειδικές εκπτώσεις όγκου και δωρεάν παράδοση.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <button 
                  onClick={() => setShowPinModal(true)}
                  className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold rounded-xl shadow-lg transition flex items-center gap-2"
                >
                  Ξεκλείδωμα Τιμών Χονδρικής <ArrowRight className="w-4 h-4" />
                </button>
                <a 
                  href="#catalog"
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition backdrop-blur-sm"
                >
                  Περιήγηση Καταλόγου
                </a>
              </div>

              {/* Stats badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800 text-center sm:text-left">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400">500+</div>
                  <div className="text-xs text-slate-400">Ετοιμοπαράδοτοι Κωδικοί</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400">24/48h</div>
                  <div className="text-xs text-slate-400">Παράδοση στην Έδρα σας</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400">100%</div>
                  <div className="text-xs text-slate-400">Εγγύηση Ποιότητας</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-30"></div>
                <img 
                  src="https://images.unsplash.com/photo-1584556812952-905ffd0c611a?auto=format&fit=crop&q=80&w=800" 
                  alt="B2B Cleaning Products" 
                  className="relative rounded-2xl shadow-2xl border border-slate-700/50 object-cover h-96 w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Main Catalog Container */}
        <main id="catalog" className="max-w-7xl mx-auto px-4 py-12">
          {/* Search & Filters Header */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Αναζήτηση με SKU ή Όνομα..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
                <div>
                  {/* Product Image Header */}
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img 
                      src={p.image} 
                      alt={p.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md tracking-wider">
                      {p.sku}
                    </div>
                    <div className="absolute top-3 right-3 bg-emerald-500 text-slate-950 font-bold text-[10px] px-2 py-1 rounded-md shadow-sm">
                      {p.ecoBadge}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-slate-900 text-base mb-2 group-hover:text-emerald-700 transition line-clamp-2">{p.title}</h3>
                    <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">{p.description}</p>

                    <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 mb-4">
                      <div className="flex justify-between">
                        <span className="text-slate-400">📦 Συσκευασία:</span>
                        <span className="font-bold text-slate-700">{p.packaging}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">🏗️ Παλέτα:</span>
                        <span className="font-bold text-slate-700">{p.palletInfo}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="flex items-baseline justify-between mb-4 border-t border-slate-100 pt-3">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Τιμή Μονάδας</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-slate-900">
                          €{(wholesaleUnlocked ? p.wholesalePrice : p.retailPrice).toFixed(2)}
                        </span>
                        {wholesaleUnlocked && (
                          <span className="text-xs text-slate-400 line-through font-semibold">€{p.retailPrice.toFixed(2)}</span>
                        )}
                      </div>
                    </div>

                    <a
                      href={p.sdsUrl}
                      className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-emerald-600 underline"
                    >
                      <FileText className="w-3.5 h-3.5" /> SDS PDF
                    </a>
                  </div>

                  <button
                    onClick={() => addToCart(p, p.minOrderQty)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition"
                  >
                    <ShoppingCart className="w-4 h-4" /> Προσθήκη στη Λίστα
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-600 text-white rounded-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">Clean & Paper PRO</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Εταιρεία εισαγωγής & αντιπροσωπείας επαγγελματικών συστημάτων καθαρισμού και χαρτικών. Προμηθευτής B2B για περισσότερες από 1.000 επιχειρήσεις.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Επικοινωνία B2B</h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-400" /> Βιομηχανική Περιοχή, Αθήνα</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-emerald-400" /> +30 210 0000000</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-emerald-400" /> orders@cleanpaper.gr</li>
              <li className="flex items-center gap-2"><Clock className="w-4 h-4 text-emerald-400" /> Δευτ - Παρ: 08:00 - 17:00</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Κατηγορίες B2B</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-emerald-400 transition">Χαρτικά Επαγγελματικά Jumbo</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition">Χειροπετσέτες Z-Fold & C-Fold</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition">Συμπυκνωμένα Καθαριστικά HACCP</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition">Επαγγελματικές Συσκευές Dispensers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Πιστοποιήσεις & Ασφάλεια</h4>
            <p className="mb-3 text-slate-400">Όλα τα προϊόντα καθαρισμού συνοδεύονται από Δελτία Δεδομένων Ασφαλείας (SDS) & πιστοποιητικά HACCP.</p>
            <div className="flex gap-2">
              <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-emerald-400 font-bold rounded-md text-[10px]">ISO 9001</span>
              <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-emerald-400 font-bold rounded-md text-[10px]">ISO 14001</span>
              <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-emerald-400 font-bold rounded-md text-[10px]">Ecolabel EU</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 py-6 text-center text-slate-500">
          <p>© 2026 Clean & Paper PRO Catalog. All rights reserved.</p>
        </div>
      </footer>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white h-full p-6 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-emerald-600" /> Λίστα Παραγγελίας B2B
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-slate-500 font-medium">Η λίστα σας είναι άδεια.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{item.title}</h4>
                        <span className="text-[11px] text-slate-500">Ποσότητα: {item.qty} | SKU: {item.sku}</span>
                      </div>
                      <span className="font-extrabold text-slate-900 text-sm">
                        €{((wholesaleUnlocked ? item.wholesalePrice : item.retailPrice) * item.qty).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-slate-200 pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700">Σύνολο (προ ΦΠΑ):</span>
                  <span className="text-2xl font-black text-emerald-600">€{totalCartValue.toFixed(2)}</span>
                </div>

                <a
                  href={`https://wa.me/?text=${generateOrderText()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <Send className="w-4 h-4" /> Αποστολή Παραγγελίας στο WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-100">
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">Είσοδος Χονδρικής B2B</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">Εισάγετε τον κωδικό συνεργάτη για πρόσβαση στις τιμές χονδρικής (Δοκιμαστικός κωδικός: <span className="font-bold text-emerald-600">b2b2026</span>).</p>
            <form onSubmit={handleUnlock} className="space-y-4">
              <input
                type="password"
                placeholder="Κωδικός B2B..."
                value={b2bPin}
                onChange={(e) => setB2bPin(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs"
                >
                  Ακύρωση
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 transition shadow-md"
                >
                  Επιβεβαίωση
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
