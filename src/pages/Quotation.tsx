

import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  AlertCircle,
  Trash2,
  Search,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Plus,
  Minus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// =============================================
// TYPES
// =============================================
interface Item {
  _id: string;
  name: string;
  description: string;
  nrp: number;
  mrp: number;
  image?: string | null;
}

interface SelectedItem extends Item {
  quantity: number;
  selectedPrice: number;
}

interface FormData {
  name: string;
  number: string;
  address: string;
  includeGst: boolean;
  dis: string;
  priceType: string;
  date: string;
}

// =============================================
// API ROUTES
// =============================================

let userString = localStorage.getItem("user");
let user = typeof userString === 'string' ? JSON.parse(userString) : null;
const API_BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/api`;
const API_ROUTES = {
  CREATE_QUOTATION: `${API_BASE_URL}/products/add`,
  GET_ALL_ITEMS: `${API_BASE_URL}/items?userId=${user?.id}`,
};

function QuotationPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Form, 2: Items
  const [formData, setFormData] = useState<FormData>({
    name: "",
    number: "",
    address: "",
    includeGst: false,
    dis: "",
    priceType: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [availableItems, setAvailableItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quotationId, setQuotationId] = useState<string | null>(null);

  // Fetch available items on component mount
  useEffect(() => {
    fetchAvailableItems();
  }, []);

  // Filter items based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems([]);
    } else {
      const filtered = availableItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, availableItems]);

  const fetchAvailableItems = async () => {
    setLoadingItems(true);
    try {
      const response = await fetch(API_ROUTES.GET_ALL_ITEMS);
      const data = await response.json();

      if (data.success && data.items) {
        setAvailableItems(data.items);
      } else {
        throw new Error("Failed to fetch items");
      }
    } catch (err) {
      console.error("Error fetching items:", err);
      setAvailableItems([]);
    } finally {
      setLoadingItems(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [id]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [id]: value,
      });
    }
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      alert("Please enter customer name");
      return false;
    }
    if (!formData.priceType) {
      alert("Please select price type");
      return false;
    }
    if (!formData.date) {
      alert("Please select date");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleAddItem = (item: Item) => {
    if (selectedItems.find((si) => si._id === item._id)) {
      alert("This item is already added.");
      return;
    }

    let selectedPrice;
    if (formData.priceType === "nrp") {
      selectedPrice = item.nrp;
    } else {
      selectedPrice = item.mrp;
    }

    const newSelectedItem: SelectedItem = {
      ...item,
      quantity: 1,
      selectedPrice,
    };

    setSelectedItems([...selectedItems, newSelectedItem]);
    setSearchQuery(""); // Clear search after adding
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    if (quantity < 1) return;

    setSelectedItems(
      selectedItems.map((item) =>
        item._id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const handlePriceChange = (itemId: string, price: number) => {
    if (price < 0) return;

    setSelectedItems(
      selectedItems.map((item) =>
        item._id === itemId ? { ...item, selectedPrice: price } : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter((item) => item._id !== itemId));
  };

  const calculateTotals = () => {
    const subtotal = selectedItems.reduce(
      (sum, item) => sum + item.selectedPrice * item.quantity,
      0
    );
    const discount = parseFloat(formData.dis) || 0;
    const discountAmount = (subtotal * discount) / 100;
    const total = subtotal - discountAmount;
    const totalQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

    return { subtotal, discountAmount, total, totalQuantity };
  };

  const handleCreateQuotation = async () => {
    if (selectedItems.length === 0) {
      alert("Please add at least one item to continue");
      return;
    }


    setLoading(true);
    setError(null);

    try {
      const { totalQuantity, total } = calculateTotals();

      const quotationData = {
        name: formData.name.trim(),
        number: formData.number.trim(),
        address: formData.address.trim(),
        includeGst: formData.includeGst,
        dis: formData.dis || "0",
        value: formData.priceType,
        quantity: totalQuantity,
        date: formData.date,
        items: selectedItems.map((item) => item._id),
        totalQuantity: totalQuantity,
        totalAmount: total,
        userId: user?.id || '',
      };

      const response = await fetch(API_ROUTES.CREATE_QUOTATION, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quotationData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setQuotationId(data.product._id);
        navigate(`/dashboard`);
      } else {
        throw new Error(data.message || "Failed to create quotation");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      alert(`Failed to create quotation: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setFormData({
      name: "",
      number: "",
      address: "",
      includeGst: false,
      dis: "",
      priceType: "",
      date: new Date().toISOString().split("T")[0],
    });
    setSelectedItems([]);
    setQuotationId(null);
    setError(null);
    setSearchQuery("");
  };

  const { subtotal, discountAmount, total, totalQuantity } = calculateTotals();

  return (
    <div className="min-h-screen bg-premium-obsidian p-4 sm:p-6 lg:p-8 text-zinc-100 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4 relative">
            <div className={`flex flex-col items-center gap-2 z-10 ${step >= 1 ? 'text-amber-500' : 'text-zinc-500'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${step >= 1 ? 'bg-amber-500 text-obsid-900 shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'bg-zinc-800 text-zinc-500'}`}>
                {step > 1 ? <CheckCircle size={24} /> : "1"}
              </div>
              <span className="text-sm font-medium tracking-wide uppercase">Customer Details</span>
            </div>

            <div className="w-24 h-[2px] bg-zinc-800 absolute top-6 -translate-y-1/2 left-[calc(50%-6rem)] md:relative md:top-auto md:translate-y-0 md:left-auto">
              <div className={`h-full bg-amber-500 transition-all duration-500 ${step >= 2 ? 'w-full shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'w-0'}`}></div>
            </div>

            <div className={`flex flex-col items-center gap-2 z-10 ${step >= 2 ? 'text-amber-500' : 'text-zinc-500'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${step >= 2 ? 'bg-amber-500 text-obsid-900 shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'bg-zinc-800 text-zinc-500'}`}>
                2
              </div>
              <span className="text-sm font-medium tracking-wide uppercase">Add Products</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-200 px-6 py-4 rounded-xl flex items-center gap-3 mb-8 backdrop-blur-sm shadow-lg">
            <AlertCircle size={24} className="text-red-500 shrink-0" />
            <span className="font-medium">Error: {error}</span>
          </div>
        )}

        {quotationId && (
          <div className="bg-emerald-900/20 border border-emerald-500/50 text-emerald-200 px-6 py-4 rounded-xl flex items-center gap-3 mb-8 backdrop-blur-sm shadow-lg">
            <CheckCircle size={24} className="text-emerald-500 shrink-0" />
            <div>
              <strong className="block text-lg">Quotation Created Successfully!</strong>
              <p className="text-emerald-300/80 text-sm">Quotation ID: {quotationId}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT SIDE - Form/Summary */}
          <div className="lg:col-span-5 space-y-8">
            {step === 1 ? (
              // Step 1: Customer Details Form
              <div className="premium-card p-8 rounded-2xl shadow-2xl border border-zinc-800/50 bg-[#0a0a0a]/80 backdrop-blur-md">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-zinc-800">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                    <PlusCircle size={24} />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
                    Customer Details
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                        Customer Name <span className="text-amber-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-zinc-100 placeholder:text-zinc-600 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all duration-200 shadow-inner"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        id="number"
                        value={formData.number}
                        onChange={handleChange}
                        placeholder="+91 00000 00000"
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-zinc-100 placeholder:text-zinc-600 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                        Date <span className="text-amber-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-zinc-100 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                      Address
                    </label>
                    <textarea
                      id="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Street, City, State, ZIP"
                      rows={3}
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-zinc-100 placeholder:text-zinc-600 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all duration-200 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/50">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                        Price Type <span className="text-amber-500">*</span>
                      </label>
                      <select
                        id="priceType"
                        value={formData.priceType}
                        onChange={handleChange}
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                      >
                        <option value="" className="bg-[#0a0a0a]">Select Type</option>
                        <option value="nrp" className="bg-[#0a0a0a]">NRP (Net Rate)</option>
                        <option value="mrp" className="bg-[#0a0a0a]">MRP (Retail)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                        Discount %
                      </label>
                      <input
                        type="number"
                        id="dis"
                        value={formData.dis}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        max="100"
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                      />
                    </div>

                    <div className="md:col-span-2 flex items-center gap-3 mt-2">
                      <div className="relative flex items-center cursor-pointer" onClick={() => handleChange({ target: { id: 'includeGst', type: 'checkbox', checked: !formData.includeGst } } as any)}>
                        <input
                          type="checkbox"
                          id="includeGst"
                          checked={formData.includeGst}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className={`w-10 h-5 rounded-full transition-colors duration-200 ${formData.includeGst ? 'bg-amber-500' : 'bg-zinc-700'}`}></div>
                        <div className={`absolute left-1 top-1 w-3 h-3 rounded-full bg-white transition-transform duration-200 ${formData.includeGst ? 'translate-x-5' : ''}`}></div>
                      </div>
                      <label htmlFor="includeGst" className="text-sm font-medium text-zinc-300 select-none cursor-pointer">
                        Include GST in final amount
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-800 hover:from-amber-500 hover:to-orange-700 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2 group"
                  >
                    Next: Add Products
                    <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ) : (
              // Step 2: Summary View
              <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="premium-card p-6 rounded-2xl border border-zinc-800/50 bg-[#0a0a0a]/80 backdrop-blur-md overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -translate-y-16 translate-x-16 blur-3xl"></div>

                  <div className="flex justify-between items-center mb-6 border-b border-zinc-800/50 pb-4">
                    <h3 className="text-lg font-bold text-amber-500 uppercase tracking-widest">Customer Profile</h3>
                    <button
                      onClick={() => setStep(1)}
                      className="text-zinc-400 hover:text-amber-500 flex items-center gap-1.5 text-xs font-semibold transition-colors uppercase tracking-widest"
                    >
                      <ArrowLeft size={14} />
                      Refine Details
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-y-4 text-sm">
                    <div>
                      <span className="text-zinc-500 block text-[10px] font-bold uppercase tracking-wider mb-0.5">Full Name</span>
                      <span className="text-zinc-100 font-medium truncate block">{formData.name}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px] font-bold uppercase tracking-wider mb-0.5">Mobile</span>
                      <span className="text-zinc-100 font-medium">{formData.number || "—"}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-zinc-500 block text-[10px] font-bold uppercase tracking-wider mb-0.5">Address</span>
                      <span className="text-zinc-300 italic leading-relaxed">{formData.address || "No address provided"}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px] font-bold uppercase tracking-wider mb-0.5">Price Base</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-zinc-800 text-zinc-300 border border-zinc-700">{formData.priceType}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px] font-bold uppercase tracking-wider mb-0.5">Issue Date</span>
                      <span className="text-zinc-100">{formData.date}</span>
                    </div>
                  </div>
                </div>

                {selectedItems.length > 0 && (
                  <div className="premium-card p-8 rounded-2xl bg-gradient-to-br from-[#121212] to-[#0a0a0a] border border-zinc-800/50 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-amber-600 to-orange-800"></div>

                    <h3 className="text-xl font-bold text-zinc-100 mb-8 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 text-lg">₹</span>
                      Quotation Financials
                    </h3>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-zinc-400">
                        <span className="text-sm flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-zinc-700"></div>
                          Gross Subtotal ({selectedItems.length} items)
                        </span>
                        <span className="text-zinc-100 font-mono font-medium">₹{subtotal.toLocaleString()}</span>
                      </div>

                      {parseFloat(formData.dis) > 0 && (
                        <div className="flex justify-between items-center text-emerald-500/80">
                          <span className="text-sm flex items-center gap-2 italic">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></div>
                            Discount Applied ({formData.dis}%)
                          </span>
                          <span className="font-mono font-medium">-₹{discountAmount.toLocaleString()}</span>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-zinc-400">
                        <span className="text-sm flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-zinc-700"></div>
                          Taxation (GST {formData.includeGst ? 'Included' : 'Excluded'})
                        </span>
                        <span className="text-zinc-500 font-mono text-xs">Calculated at Source</span>
                      </div>

                      <div className="pt-6 mt-6 border-t border-zinc-800/80">
                        <div className="flex justify-between items-end">
                          <div>
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] block mb-1">Grand Final Amount</span>
                            <span className="text-3xl font-bold text-zinc-100 font-sans tracking-tight">₹{total.toLocaleString()}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-bold text-amber-500/80 uppercase tracking-widest block mb-1">Items Volume</span>
                            <span className="text-xl font-bold text-zinc-400">{totalQuantity} Units</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleCreateQuotation}
                  disabled={loading || selectedItems.length === 0}
                  className="w-full h-16 bg-gradient-to-r from-amber-600 to-orange-800 hover:from-amber-500 hover:to-orange-700 text-white rounded-xl font-black text-lg uppercase tracking-widest transition-all duration-300 transform active:scale-95 disabled:opacity-30 disabled:grayscale shadow-2xl shadow-amber-900/40 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <div className="relative flex items-center justify-center gap-3">
                    {loading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-4 border-white border-t-transparent"></div>
                    ) : (
                      <>
                        <CheckCircle size={24} className="group-hover:scale-110 transition-transform" />
                        Finalize Proposal
                      </>
                    )}
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* RIGHT SIDE - Product Workspace */}
          <div className="lg:col-span-7 space-y-8 h-full">
            {step === 2 && (
              <div className="flex flex-col h-full space-y-8 animate-in fade-in zoom-in-95 duration-500">
                {/* Search Bar Workspace */}
                <div className="premium-card p-6 rounded-2xl bg-[#0a0a0a]/50 border border-zinc-800 backdrop-blur-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-zinc-800 text-amber-500">
                      <Search size={20} />
                    </div>
                    <label className="text-sm font-bold text-zinc-300 uppercase tracking-widest">
                      Search Inventory
                    </label>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter model name, SKU, or category..."
                      className="w-full pl-12 pr-4 py-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl text-zinc-100 placeholder:text-zinc-600 focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all shadow-inner"
                    />
                  </div>

                  {/* Search Results Workspace */}
                  {loadingItems ? (
                    <div className="flex flex-col items-center justify-center py-20 text-zinc-500 animate-pulse">
                      <div className="w-12 h-12 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin mb-4"></div>
                      <span className="text-xs uppercase tracking-widest font-bold">Scanning Repository...</span>
                    </div>
                  ) : searchQuery.trim() !== "" && (
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {filteredItems.length === 0 ? (
                        <div className="col-span-full py-12 text-center bg-zinc-900/20 rounded-2xl border border-dashed border-zinc-800">
                          <Search size={48} className="mx-auto text-zinc-700 mb-4" />
                          <p className="text-zinc-500 font-medium">No inventory matches found for "{searchQuery}"</p>
                        </div>
                      ) : (
                        filteredItems.map((item) => (
                          <div
                            key={item._id}
                            className="bg-[#121212] p-4 rounded-xl border border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-900/50 transition-all duration-300 group shadow-lg"
                          >
                            <div className="flex gap-4">
                              <div className="w-20 h-20 rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700 shrink-0">
                                <img
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  src={item.image || "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=200&h=200&fit=crop"}
                                  alt={item.name}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-zinc-100 truncate mb-1">{item.name}</h4>
                                <p className="text-[10px] text-zinc-500 line-clamp-2 leading-relaxed h-8">{item.description}</p>
                                <div className="mt-2 flex items-center justify-between">
                                  <span className="text-amber-500 font-mono font-bold text-sm">₹{formData.priceType === 'nrp' ? item.nrp : item.mrp}</span>
                                  <button
                                    onClick={() => handleAddItem(item)}
                                    disabled={selectedItems.some((si) => si._id === item._id)}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${selectedItems.some((si) => si._id === item._id)
                                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-default"
                                      : "bg-zinc-800 text-zinc-100 hover:bg-amber-500 hover:text-obsid-900 border border-zinc-700 hover:border-amber-500"
                                      }`}
                                  >
                                    {selectedItems.some((si) => si._id === item._id) ? "In Proposal" : "Add to List"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Selected Items Ledger */}
                <div className={`premium-card p-6 rounded-2xl bg-[#0a0a0a]/80 border border-zinc-800 shadow-2xl flex-1 flex flex-col overflow-hidden ${selectedItems.length === 0 ? 'opacity-50 grayscale' : ''}`}>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <PlusCircle size={20} />
                      </div>
                      Selected Items Ledger
                      <span className="bg-zinc-800 text-zinc-400 text-xs px-2 py-1 rounded-full">{selectedItems.length}</span>
                    </h3>
                  </div>

                  <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
                    {selectedItems.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full py-12 text-zinc-600 italic">
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-zinc-800 flex items-center justify-center mb-4">
                          <Plus size={32} />
                        </div>
                        <p className="text-center font-medium max-w-[200px]">Inventory is empty. Use search to populate the proposal.</p>
                      </div>
                    ) : (
                      selectedItems.map((item) => (
                        <div
                          key={item._id}
                          className="p-5 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl hover:bg-zinc-900/60 transition-colors group"
                        >
                          <div className="flex gap-1 items-start mb-4">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-zinc-100 text-lg group-hover:text-amber-500 transition-colors">{item.name}</h4>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(item._id)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600 hover:bg-red-500/10 hover:text-red-500 transition-all"
                              title="Remove item"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>

                          <div className="flex flex-wrap items-end justify-between gap-4">
                            <div className="space-y-4">
                              <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800 flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Unit Price ({formData.priceType.toUpperCase()})</span>
                                <span className="text-lg font-mono font-bold text-amber-500">₹{item.selectedPrice.toLocaleString()}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-6">
                              <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Configure Quantity</span>
                                <div className="flex items-center bg-zinc-950 rounded-xl border border-zinc-800 p-1 shadow-inner">
                                  <button
                                    onClick={() => handleQuantityChange(item._id, Math.max(1, item.quantity - 1))}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"
                                  >
                                    <Minus size={16} />
                                  </button>
                                  <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value) || 1)}
                                    className="w-12 bg-transparent text-center font-bold text-zinc-100 outline-none"
                                  />
                                  <button
                                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"
                                  >
                                    <Plus size={16} />
                                  </button>
                                </div>
                              </div>

                              <div className="text-right">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Line Total</span>
                                <span className="text-xl font-mono font-black text-zinc-100 italic">₹{(item.selectedPrice * item.quantity).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
            {step === 1 && (
              <div className="flex flex-col items-center justify-center h-full bg-zinc-900/20 border-2 border-dashed border-zinc-800 rounded-3xl p-12 text-center animate-pulse">
                <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mb-6">
                  <PlusCircle size={40} className="text-zinc-600" />
                </div>
                <h3 className="text-xl font-bold text-zinc-400 mb-2">Proposal Workspace Locked</h3>
                <p className="text-zinc-500 max-w-sm">Complete the customer identity verification to unlock inventory selection and financial calculations.</p>
              </div>
            )}
          </div>
        </div>

        {quotationId && (
          <div className="mt-12 flex justify-center animate-in slide-in-from-bottom-4 duration-500">
            <button
              onClick={handleReset}
              className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl font-bold transition-all flex items-center gap-3 border border-zinc-700 shadow-lg"
            >
              <PlusCircle size={20} />
              Initiate New Transaction Proposal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuotationPage;