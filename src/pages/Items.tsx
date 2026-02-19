import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Trash2,
  Upload,
  X,
  Edit2,
  Save,
  XCircle,
  Search,
  Package,
  Grid3x3,
  List,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Star
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

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
  createdAt?: string;
  updatedAt?: string;
}

interface FormData {
  name: string;
  description: string;
  nrp: string;
  mrp: string;
  image: File | null;
}

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

function ItemsPage() {
  const { user, token } = useAuth();

  const API_ROUTES = {
    GET_ALL_ITEMS: `${API_BASE_URL}/api/items?userId=${user?.id}`,
    ADD_ITEM: `${API_BASE_URL}/api/items`,
    UPDATE_ITEM: (id: string) => `${API_BASE_URL}/api/items/${id}`,
    DELETE_ITEM: (id: string) => `${API_BASE_URL}/api/items/${id}?userId=${user?.id}`,
    ADD_REVIEW: `${API_BASE_URL}/api/reviews`,
  };

  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState<FormData>({
    name: "",
    description: "",
    nrp: "",
    mrp: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // View states
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(true);

  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [sortBy, setSortBy] = useState<string>('name');

  // Edit mode states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // Review states
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [itemToReview, setItemToReview] = useState<Item | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>("");
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ROUTES.GET_ALL_ITEMS);
      if (!response.ok) throw new Error("Could not retrieve inventory items");
      const data = await response.json();
      setItems(data?.items || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Network protocol error";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Invalid format. Please select an image.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Exceeds 5MB payload limit.');
        return;
      }
      setForm((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (): void => {
    setForm((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const handleAddItem = async (): Promise<void> => {
    if (!form.name || !form.description || !form.nrp || !form.mrp) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('nrp', form.nrp);
      formData.append('mrp', form.mrp);
      formData.append('userId', user?.id || '');
      if (form.image) formData.append('image', form.image);

      const response = await fetch(API_ROUTES.ADD_ITEM, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Transaction commit failed");
      const data = await response.json();
      setItems([data.item || data, ...items]);
      resetForm();
    } catch (err) {
      setError("Failed to register new item.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (item: Item): void => {
    setIsEditMode(true);
    setEditingId(item._id);
    setShowModal(true);
    setForm({
      name: item.name,
      description: item.description,
      nrp: item.nrp.toString(),
      mrp: item.mrp.toString(),
      image: null,
    });
    if (item.image) setImagePreview(item.image);
  };

  const resetForm = (): void => {
    setIsEditMode(false);
    setEditingId(null);
    setShowModal(false);
    setForm({ name: "", description: "", nrp: "", mrp: "", image: null });
    setImagePreview(null);
  };

  const handleUpdateItem = async (): Promise<void> => {
    if (!editingId || !form.name || !form.description || !form.nrp || !form.mrp) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('nrp', form.nrp);
      formData.append('mrp', form.mrp);
      formData.append('userId', user?.id || '');
      if (form.image) formData.append('image', form.image);

      const response = await fetch(API_ROUTES.UPDATE_ITEM(editingId), {
        method: "PUT",
        body: formData,
      });
      if (!response.ok) throw new Error("Update synchronization failed");
      const data = await response.json();
      setItems(items.map(item => item._id === editingId ? (data.item || data) : item));
      resetForm();
    } catch (err) {
      setError("Critical update error.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm("Permanently archive this asset?")) return;
    setLoading(true);
    try {
      const response = await fetch(API_ROUTES.DELETE_ITEM(id), { method: "DELETE" });
      if (!response.ok) throw new Error("Archive operation denied");
      setItems(items.filter((item) => item._id !== id));
    } catch (err) {
      setError("Resource deletion failure.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!itemToReview || !reviewComment.trim()) return;
    setIsSubmittingReview(true);
    try {
      const res = await fetch(API_ROUTES.ADD_REVIEW, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          itemId: itemToReview._id,
          rating: reviewRating,
          comment: reviewComment
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("Review submitted successfully!");
        setShowReviewModal(false);
        setReviewComment("");
        setReviewRating(5);
      } else {
        alert(data.message || "Failed to submit review");
      }
    } catch (err) {
      alert("Error submitting review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const filteredItems = items
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = item.mrp >= priceRange[0] && item.mrp <= priceRange[1];
      return matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price-low') return a.mrp - b.mrp;
      if (sortBy === 'price-high') return b.mrp - a.mrp;
      return 0;
    });

  return (
    <div className="min-h-screen bg-premium-base text-premium-text-primary font-sans flex flex-col">
      {/* Premium Header */}
      <header className="bg-premium-surface/80 backdrop-blur-xl border-b border-premium-border sticky top-0 z-40 transition-all">
        <div className="max-w-screen-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-premium-amber-500/10 text-premium-amber-500 border border-premium-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                <Package size={26} />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-black tracking-tight text-white uppercase italic">Inventory</h1>
                <p className="text-[10px] uppercase tracking-widest text-premium-amber-500 font-black">Item Management System</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {user?.role !== "customer" && (
                <button
                  onClick={() => { setShowModal(true); setIsEditMode(false); }}
                  className="btn-premium-primary px-5 py-2.5"
                >
                  <PlusCircle size={18} />
                  Add New Item
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Intelligence Sidebar - Filters */}
        <aside className={`bg-premium-surface border-r border-premium-border shadow-2xl flex-shrink-0 transition-all duration-500 ${showFilters ? 'w-80' : 'w-0'} overflow-hidden flex flex-col z-30`}>
          <div className="p-8 space-y-10 overflow-y-auto custom-scrollbar flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] font-black text-premium-text-faint uppercase tracking-[0.2em] flex items-center gap-3">
                <SlidersHorizontal size={14} className="text-premium-amber-500" />
                Refinement Matrix
              </h2>
            </div>

            {/* Neural Search */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-premium-text-faint uppercase tracking-widest ml-1">Universal Search</label>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-premium-text-faint group-focus-within:text-premium-amber-500 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-premium pl-12"
                />
              </div>
            </div>

            {/* Sorting Algorithm */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-premium-text-faint uppercase tracking-widest ml-1">Sequence Strategy</label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-premium appearance-none cursor-pointer"
                >
                  <option value="name">Alphabetic Order (A-Z)</option>
                  <option value="price-low">Capital (Low → High)</option>
                  <option value="price-high">Capital (High → Low)</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-premium-text-faint pointer-events-none" size={16} />
              </div>
            </div>

            {/* Pricing Threshold */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-black text-premium-text-faint uppercase tracking-widest ml-1">Valuation Cap</label>
                <span className="text-xs font-mono font-black text-premium-amber-500">₹{priceRange[1].toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max="50000"
                step="500"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full h-1.5 bg-premium-raised rounded-lg appearance-none cursor-pointer accent-premium-amber-500 focus:outline-none"
              />
              <div className="flex justify-between text-[8px] font-black text-premium-text-faint uppercase tracking-widest">
                <span>Min Entry</span>
                <span>Max Threshold</span>
              </div>
            </div>

            {/* Matrix Reset */}
            <button
              onClick={() => {
                setSearchQuery('');
                setPriceRange([0, 50000]);
                setSortBy('name');
              }}
              className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-premium-text-faint hover:text-premium-amber-500 hover:bg-premium-amber-500/5 border border-premium-border hover:border-premium-amber-500/30 rounded-2xl transition-all duration-300 italic"
            >
              Reset Intelligence
            </button>
          </div>
        </aside>

        {/* Global Catalog Workspace */}
        <main className="flex-1 flex flex-col overflow-hidden min-w-0 bg-[#050505]">
          {/* Viewport Control */}
          <div className="px-8 py-4 bg-premium-surface/30 border-b border-premium-border flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              {!showFilters && (
                <button
                  onClick={() => setShowFilters(true)}
                  className="flex items-center gap-2 text-premium-text-faint hover:text-premium-amber-500 text-[10px] font-black uppercase tracking-widest transition-colors italic"
                >
                  <Filter size={14} />
                  Restore Matrix
                </button>
              )}
              <div className="flex items-center gap-2 px-3 py-1 bg-premium-raised/50 rounded-full border border-premium-border">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                <span className="text-[10px] font-black text-premium-text-muted uppercase tracking-tight">
                  {filteredItems.length} Items Found
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-premium-raised/50 p-1 rounded-xl border border-premium-border">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl transition-all duration-300 ${viewMode === 'grid' ? 'bg-premium-amber-500 text-premium-base shadow-lg shadow-premium-amber-500/20' : 'text-premium-text-faint hover:text-premium-text-primary'}`}
                title="Grid Resolution"
              >
                <Grid3x3 size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-xl transition-all duration-300 ${viewMode === 'list' ? 'bg-premium-amber-500 text-premium-base shadow-lg shadow-premium-amber-500/20' : 'text-premium-text-faint hover:text-premium-text-primary'}`}
                title="Structured List"
              >
                <List size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar min-h-0 bg-gradient-to-b from-[#0a0a0a]/20 to-transparent">
            {error && (
              <div className="mb-8 p-4 bg-red-900/10 border border-red-500/30 rounded-2xl flex items-center gap-4 text-red-200">
                <AlertCircle className="text-red-500" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {filteredItems.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                  {filteredItems.map((item) => (
                    <div
                      key={item._id}
                      className="premium-card group rounded-3xl overflow-hidden hover:border-premium-amber-500/30 transition-all duration-500 flex flex-col h-full bg-premium-surface"
                    >
                      <div className="aspect-[4/3] relative overflow-hidden bg-premium-raised/50">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                            <Package className="text-premium-text-faint/20" size={48} />
                          </div>
                        )}
                        <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                          {user?.role === "customer" ? (
                            <button
                              onClick={() => { setItemToReview(item); setShowReviewModal(true); }}
                              className="p-2.5 bg-premium-amber-500 text-premium-base rounded-xl border border-premium-amber-600 backdrop-blur-md transition-all shadow-2xl"
                              title="Give Review"
                            >
                              <Star size={16} fill="currentColor" />
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => handleStartEdit(item)}
                                className="p-2.5 bg-premium-base/90 hover:bg-premium-amber-500 hover:text-premium-base text-premium-amber-500 rounded-xl border border-premium-border transition-all shadow-2xl"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(item._id)}
                                className="p-2.5 bg-premium-base/90 hover:bg-red-600 hover:text-white text-premium-text-faint rounded-xl border border-premium-border transition-all shadow-2xl"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="p-6 flex flex-col flex-1">
                        <div className="mb-4">
                          <h3 className="text-base font-black text-white mb-2 line-clamp-1 group-hover:text-premium-amber-500 transition-colors duration-300 uppercase tracking-tight italic">{item.name}</h3>
                          <p className="text-[11px] text-premium-text-faint line-clamp-2 leading-relaxed h-8 font-bold uppercase tracking-tighter">{item.description}</p>
                        </div>
                        <div className="mt-auto grid grid-cols-2 gap-4 pt-4 border-t border-premium-border/50">
                          <div className="space-y-1">
                            <span className="text-[9px] font-black text-premium-text-faint uppercase tracking-widest">NRP</span>
                            <div className="text-sm font-mono font-black text-premium-text-muted italic">₹{item.nrp.toLocaleString()}</div>
                          </div>
                          <div className="space-y-1 text-right">
                            <span className="text-[9px] font-black text-premium-text-faint uppercase tracking-widest">MRP</span>
                            <div className="text-sm font-mono font-black text-premium-amber-500 italic">₹{item.mrp.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredItems.map((item) => (
                    <div
                      key={item._id}
                      className="premium-card rounded-2xl p-4 flex gap-6 items-center hover:border-premium-amber-500/30 transition-all duration-300 group bg-premium-surface"
                    >
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-premium-raised flex-shrink-0 border border-premium-border/50">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="text-premium-text-faint/20" size={28} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-base text-premium-text-primary truncate group-hover:text-premium-amber-500 transition-colors uppercase italic tracking-tight">{item.name}</h3>
                        <p className="text-[10px] text-premium-text-faint truncate mb-3 font-bold uppercase tracking-tight">{item.description}</p>
                        <div className="flex items-center gap-8">
                          <span className="text-xs font-mono font-black text-premium-text-muted italic">₹{item.nrp.toLocaleString()}<span className="text-[8px] ml-1 uppercase not-italic opacity-50">NRP</span></span>
                          <span className="text-sm font-mono font-black text-premium-amber-500 italic">₹{item.mrp.toLocaleString()}<span className="text-[8px] ml-1 uppercase not-italic opacity-50">MRP</span></span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pl-6 border-l border-premium-border">
                        {user?.role === "customer" ? (
                          <button
                            onClick={() => { setItemToReview(item); setShowReviewModal(true); }}
                            className="p-3 bg-premium-amber-500 text-premium-base rounded-xl transition-all"
                          >
                            <Star size={18} fill="currentColor" />
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleStartEdit(item)}
                              className="p-3 bg-premium-raised text-premium-amber-500 rounded-xl border border-premium-border transition-all"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="p-3 bg-premium-raised text-premium-text-faint rounded-xl border border-premium-border transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px]">
                <Package className="text-premium-text-faint/20 mb-4" size={48} />
                <p className="text-premium-text-faint text-[10px] font-black uppercase tracking-widest">No items found</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Item Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[100] p-6">
          <div className="premium-card rounded-[2.5rem] w-full max-w-2xl overflow-hidden flex flex-col bg-premium-surface border-zinc-700/50 shadow-2xl">
            <div className="px-8 py-6 flex justify-between items-center border-b border-premium-border bg-premium-raised/50">
              <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">
                {isEditMode ? "Edit Item" : "Add New Item"}
              </h2>
              <button onClick={resetForm} className="text-premium-text-faint hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-premium-text-faint uppercase tracking-widest ml-2">Display Name</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} className="input-premium" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-premium-text-faint uppercase tracking-widest ml-2">Description</label>
                  <input type="text" name="description" value={form.description} onChange={handleChange} className="input-premium" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-premium-text-faint uppercase tracking-widest ml-2">NRP (₹)</label>
                  <input type="number" name="nrp" value={form.nrp} onChange={handleChange} className="input-premium font-mono" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-premium-text-faint uppercase tracking-widest ml-2">MRP (₹)</label>
                  <input type="number" name="mrp" value={form.mrp} onChange={handleChange} className="input-premium font-mono" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-premium-text-faint uppercase tracking-widest ml-2">Visual Imprint</label>
                {!imagePreview ? (
                  <label className="border-2 border-dashed border-premium-border rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-premium-amber-500/50 hover:bg-premium-amber-500/5 transition-all">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    <Upload size={32} className="text-premium-text-faint/50 mb-3" />
                    <span className="text-xs font-bold text-premium-text-faint">Upload Image Asset</span>
                  </label>
                ) : (
                  <div className="relative w-40 h-40 rounded-xl overflow-hidden border border-premium-border shadow-xl">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button onClick={handleRemoveImage} className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg shadow-lg">
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex gap-4 pt-6 border-t border-premium-border">
                <button
                  onClick={resetForm}
                  className="btn-premium-secondary flex-1 py-4 text-[10px] font-black uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  onClick={isEditMode ? handleUpdateItem : handleAddItem}
                  className="btn-premium-primary flex-[2] py-4 text-[10px] font-black uppercase tracking-widest"
                >
                  {isEditMode ? "Update Item" : "Add Item"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-6">
          <div className="premium-card rounded-[2rem] w-full max-w-md bg-premium-surface border-premium-border shadow-2xl flex flex-col">
            <div className="px-6 py-4 flex justify-between items-center border-b border-premium-border bg-premium-raised/30">
              <h2 className="text-lg font-black text-white italic uppercase tracking-tight">Share Experience</h2>
              <button onClick={() => setShowReviewModal(false)} className="text-premium-text-faint hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-premium-raised/50 rounded-2xl border border-premium-border">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-premium-base">
                  {itemToReview?.image ? <img src={itemToReview.image} className="w-full h-full object-cover" alt="" /> : <Package size={20} />}
                </div>
                <div>
                  <h4 className="text-sm font-black text-white italic uppercase tracking-tight">{itemToReview?.name}</h4>
                  <p className="text-[10px] font-bold text-premium-text-faint uppercase tracking-tighter">Rate this Item</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-premium-text-faint uppercase tracking-widest ml-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className={`p-2 transition-all ${reviewRating >= star ? 'text-premium-amber-500 scale-110' : 'text-premium-text-faint opacity-50 hover:opacity-100'}`}
                    >
                      <Star size={24} fill={reviewRating >= star ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-premium-text-faint uppercase tracking-widest ml-1">Feedback</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your detailed feedback regarding this asset..."
                  className="input-premium h-32 resize-none"
                />
              </div>

              <button
                disabled={isSubmittingReview || !reviewComment.trim()}
                onClick={handleSubmitReview}
                className="w-full btn-premium-primary py-4 text-[10px] tracking-[0.2em] font-black disabled:opacity-50"
              >
                {isSubmittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemsPage;