import React, { useState, useEffect } from "react";
import {
    FileText,
    Download,
    Eye,
    Package,
    Search,
    AlertCircle,
    ChevronDown
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const CustomerQuotations = () => {
    const [quotations, setQuotations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const { token } = useAuth();

    useEffect(() => {
        fetchQuotations();
    }, []);

    const fetchQuotations = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/api/customer/quotations`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.success) {
                setQuotations(data.quotations);
            } else {
                setError(data.message || "Failed to fetch quotations");
            }
        } catch (err) {
            setError("Error connecting to server");
        } finally {
            setLoading(false);
        }
    };

    const filteredQuotations = quotations.filter(q =>
        q.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-premium-base text-premium-text-primary p-6 md:p-10 font-sans">
            <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2 drop-shadow-sm">
                            My <span className="text-premium-amber-500">Quotations</span>
                        </h1>
                        <p className="text-premium-text-faint text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                            <span className="w-8 h-[2px] bg-premium-amber-500 rounded-full"></span>
                            Secure Pricing Documents Hub
                        </p>
                    </div>

                    <div className="relative group min-w-[300px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-premium-text-faint group-focus-within:text-premium-amber-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search documents..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-premium pl-12 w-full"
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-900/10 border border-red-500/30 rounded-2xl flex items-center gap-4 text-red-400">
                        <AlertCircle size={20} />
                        <p className="text-sm font-bold">{error}</p>
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-12 h-12 border-4 border-premium-border border-t-premium-amber-500 rounded-full animate-spin"></div>
                        <p className="text-premium-text-faint text-xs font-black uppercase tracking-widest animate-pulse">Accessing Vault...</p>
                    </div>
                ) : filteredQuotations.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredQuotations.map((q) => (
                            <div
                                key={q._id}
                                className="premium-card p-6 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-premium-amber-500/40 transition-all duration-500"
                            >
                                <div className="flex items-center gap-6 w-full md:w-auto">
                                    <div className="w-14 h-14 rounded-2xl bg-premium-raised border border-premium-border flex items-center justify-center text-premium-amber-500 shadow-inner group-hover:scale-105 transition-transform duration-500">
                                        <FileText size={28} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-lg font-black text-white italic uppercase tracking-tight line-clamp-1">{q.name}</h3>
                                            {q.includeGst && (
                                                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20 rounded-full">GST Secure</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-xs font-bold text-premium-text-faint uppercase tracking-tighter">
                                            <span>{new Date(q.date).toLocaleDateString()}</span>
                                            <span className="w-1 h-1 rounded-full bg-premium-border"></span>
                                            <span>{q.items.length} Assets Identified</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between w-full md:w-auto gap-8 pt-6 md:pt-0 border-t md:border-t-0 border-premium-border/50">
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-black text-premium-text-faint uppercase tracking-[0.2em] mb-1">Total Valuation</span>
                                        <span className="text-2xl font-black text-premium-amber-500 italic drop-shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                                            ₹{q.totalAmount.toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="flex gap-2">
                                        <button className="p-3 bg-premium-raised hover:bg-premium-base text-premium-text-primary rounded-xl border border-premium-border transition-all hover:text-premium-amber-500 shadow-sm" title="View Document">
                                            <Eye size={20} />
                                        </button>
                                        <button className="p-3 bg-premium-amber-500 text-premium-base rounded-xl border border-premium-amber-600 transition-all hover:bg-premium-amber-400 shadow-lg shadow-premium-amber-900/10" title="Download PDF">
                                            <Download size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-premium-border rounded-[3rem] bg-premium-raised/10">
                        <Package size={48} className="text-premium-text-faint/30 mb-6" />
                        <h3 className="text-xl font-black text-premium-text-muted uppercase italic tracking-widest mb-2">No Records Found</h3>
                        <p className="text-premium-text-faint text-[10px] font-black uppercase tracking-[0.2em] max-w-xs text-center leading-relaxed">
                            Your document vault is currently empty or does not match your specific query.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerQuotations;
