import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// --- Icon Components ---
const IconReceipt = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
        <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
        <path d="M12 17.5v-11" />
    </svg>
);

const IconBoxes = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z" />
        <path d="m7 16.5-4.74-2.85" />
        <path d="m7 16.5 5-3" />
        <path d="M7 16.5v5.17" />
        <path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z" />
        <path d="m17 16.5-5-3" />
        <path d="m17 16.5 4.74-2.85" />
        <path d="M17 16.5v5.17" />
        <path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z" />
        <path d="M12 8 7.26 5.15" />
        <path d="m12 8 4.74-2.85" />
        <path d="M12 13.5V8" />
    </svg>
);

const IconShieldCheck = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);

const IconFileText = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <path d="M10 9H8" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
    </svg>
);

const IconBarChart = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" x2="12" y1="20" y2="10" />
        <line x1="18" x2="18" y1="20" y2="4" />
        <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
);

const IconUsers = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const IconZap = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
);

const IconCheck = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
    </svg>
);

const IconChevronRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 18 6-6-6-6" />
    </svg>
);

const IconGrid = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="7" height="7" x="3" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="14" rx="1" />
        <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
);

const IconArrowRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
    </svg>
);

const IconPlay = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="6,3 20,12 6,21" />
    </svg>
);

const IconStar = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

const IconMenu = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" x2="20" y1="12" y2="12" />
        <line x1="4" x2="20" y1="6" y2="6" />
        <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
);

const IconX = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
    </svg>
);

// --- Animated Counter ---
const AnimatedCounter = ({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    let start = 0;
                    const duration = 2000;
                    const startTime = Date.now();

                    const animate = () => {
                        const elapsed = Date.now() - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        start = Math.floor(eased * target);
                        setCount(start);
                        if (progress < 1) requestAnimationFrame(animate);
                    };
                    animate();
                }
            },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target]);

    return (
        <div ref={ref}>
            {prefix}{count.toLocaleString()}{suffix}
        </div>
    );
};

// --- Feature Card with Light Sweep ---
const FeatureCard = ({
    icon,
    title,
    description,
    delay,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    delay: number;
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.2 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`group relative overflow-hidden rounded-2xl bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/60 p-8 transition-all duration-700 hover:border-amber-700/40 hover:bg-zinc-900/60 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {/* Light Sweep Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent pointer-events-none" />

            <div className="relative z-10">
                <div className="w-14 h-14 rounded-full bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-amber-600 mb-6 group-hover:border-amber-700/50 transition-colors duration-500">
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h3>
                <p className="text-zinc-500 leading-relaxed text-[15px]">{description}</p>
            </div>
        </div>
    );
};

// --- Step Card ---
const StepCard = ({
    number,
    title,
    description,
    delay,
}: {
    number: string;
    title: string;
    description: string;
    delay: number;
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.2 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-700 to-orange-900 flex items-center justify-center text-2xl font-extrabold text-white mx-auto mb-5 shadow-lg shadow-amber-900/30">
                {number}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs mx-auto">{description}</p>
        </div>
    );
};

// --- Testimonial Card ---
const TestimonialCard = ({
    quote,
    name,
    role,
    delay,
}: {
    quote: string;
    name: string;
    role: string;
    delay: number;
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.2 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`rounded-2xl bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/60 p-8 transition-all duration-700 hover:border-amber-800/30 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-amber-500">
                        <IconStar />
                    </span>
                ))}
            </div>
            <p className="text-zinc-400 leading-relaxed mb-6 text-[15px] italic">"{quote}"</p>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-orange-800 flex items-center justify-center text-white font-bold text-sm">
                    {name.charAt(0)}
                </div>
                <div>
                    <p className="text-white font-semibold text-sm">{name}</p>
                    <p className="text-zinc-600 text-xs">{role}</p>
                </div>
            </div>
        </div>
    );
};

// --- Pricing Card ---
const PricingCard = ({
    title,
    price,
    period,
    features,
    highlighted = false,
    delay,
}: {
    title: string;
    price: string;
    period: string;
    features: string[];
    highlighted?: boolean;
    delay: number;
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.2 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`relative rounded-2xl p-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                } ${highlighted
                    ? "bg-gradient-to-b from-amber-900/20 to-zinc-900/60 border-2 border-amber-700/50 shadow-2xl shadow-amber-900/20"
                    : "bg-zinc-900/40 border border-zinc-800/60"
                }`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-700 to-orange-800 rounded-full text-xs font-bold text-white tracking-wider uppercase">
                    Most Popular
                </div>
            )}
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <div className="mb-6">
                <span className="text-4xl font-extrabold bg-gradient-to-r from-amber-200 via-amber-400 to-orange-600 bg-clip-text text-transparent">
                    {price}
                </span>
                <span className="text-zinc-500 text-sm ml-1">/{period}</span>
            </div>
            <ul className="space-y-3 mb-8">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-zinc-400 text-sm">
                        <span className="text-amber-600 flex-shrink-0">
                            <IconCheck />
                        </span>
                        {feature}
                    </li>
                ))}
            </ul>
            <button
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.98] ${highlighted
                        ? "bg-gradient-to-r from-amber-700 to-orange-900 text-white shadow-[0_0_25px_rgba(180,83,9,0.3)] hover:shadow-[0_0_35px_rgba(180,83,9,0.4)]"
                        : "bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700"
                    }`}
            >
                Get Started
            </button>
        </div>
    );
};

// --- Dashboard Preview ---
const DashboardPreview = () => (
    <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800/60 p-6 backdrop-blur-sm overflow-hidden">
        {/* Title Bar */}
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="text-xs text-zinc-600 font-mono">quantile-dashboard</div>
            <div className="w-16" />
        </div>

        {/* Mock Dashboard */}
        <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="rounded-lg bg-zinc-800/50 border border-zinc-700/30 p-4">
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Today's Sales</div>
                <div className="text-lg font-bold text-amber-400">₹2,47,580</div>
                <div className="text-[10px] text-green-500 mt-1">↑ 12.5%</div>
            </div>
            <div className="rounded-lg bg-zinc-800/50 border border-zinc-700/30 p-4">
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Invoices</div>
                <div className="text-lg font-bold text-white">156</div>
                <div className="text-[10px] text-green-500 mt-1">↑ 8.3%</div>
            </div>
            <div className="rounded-lg bg-zinc-800/50 border border-zinc-700/30 p-4">
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Stock Items</div>
                <div className="text-lg font-bold text-white">2,430</div>
                <div className="text-[10px] text-amber-500 mt-1">● Active</div>
            </div>
        </div>

        {/* Chart Mockup */}
        <div className="rounded-lg bg-zinc-800/50 border border-zinc-700/30 p-4 mb-4">
            <div className="text-xs text-zinc-500 mb-3">Revenue Trend (Last 7 Days)</div>
            <div className="flex items-end gap-2 h-20">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-amber-800/60 to-amber-500/80 transition-all duration-500" style={{ height: `${h}%` }} />
                ))}
            </div>
            <div className="flex justify-between mt-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                    <span key={d} className="text-[9px] text-zinc-600 flex-1 text-center">{d}</span>
                ))}
            </div>
        </div>

        {/* Recent Bills */}
        <div className="rounded-lg bg-zinc-800/50 border border-zinc-700/30 p-4">
            <div className="text-xs text-zinc-500 mb-3">Recent Invoices</div>
            {[
                { id: "INV-1247", customer: "Patel Constructions", amount: "₹45,200", status: "Paid" },
                { id: "INV-1246", customer: "Sharma Builders", amount: "₹1,23,800", status: "Pending" },
                { id: "INV-1245", customer: "Modi Enterprises", amount: "₹67,500", status: "Paid" },
            ].map((invoice, i) => (
                <div key={i} className={`flex items-center justify-between py-2 ${i < 2 ? "border-b border-zinc-700/30" : ""}`}>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-amber-600">{invoice.id}</span>
                        <span className="text-xs text-zinc-400">{invoice.customer}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-zinc-300 font-medium">{invoice.amount}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full ${invoice.status === "Paid" ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"}`}>
                            {invoice.status}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// --- Main Landing Page ---
const QuantileLanding = () => {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-amber-500/30 overflow-x-hidden">
            {/* ========== NAVIGATION ========== */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#050505]/80 backdrop-blur-xl border-b border-zinc-800/50" : "bg-transparent"
                    }`}
            >
                <div className="flex justify-between items-center px-6 lg:px-8 py-4 max-w-7xl mx-auto">
                    <div className="text-2xl font-bold tracking-tighter flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-800 flex items-center justify-center shadow-lg shadow-amber-900/30">
                            <IconGrid />
                        </div>
                        <span className="text-white">
                            QUAN<span className="text-amber-500">TILE</span>
                        </span>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {["Features", "How It Works", "Pricing", "Testimonials"].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                                className="text-zinc-400 hover:text-amber-500 transition-colors text-sm font-medium"
                            >
                                {item}
                            </a>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={() => navigate("/login")}
                            className="text-zinc-400 hover:text-amber-500 transition-colors text-sm font-medium"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => navigate("/signup")}
                            className="px-5 py-2.5 bg-gradient-to-r from-amber-700 to-orange-900 text-white rounded-xl text-sm font-semibold shadow-[0_0_20px_rgba(180,83,9,0.2)] hover:shadow-[0_0_30px_rgba(180,83,9,0.3)] transition-all transform hover:-translate-y-0.5 active:scale-95"
                        >
                            Start Free Trial
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden text-zinc-400 hover:text-amber-500 transition-colors"
                    >
                        {mobileMenuOpen ? <IconX /> : <IconMenu />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-[#0a0a0a] border-t border-zinc-800/50 px-6 py-6 space-y-4">
                        {["Features", "How It Works", "Pricing", "Testimonials"].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                                className="block text-zinc-400 hover:text-amber-500 transition-colors text-sm font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item}
                            </a>
                        ))}
                        <div className="pt-4 border-t border-zinc-800 space-y-3">
                            <button
                                onClick={() => navigate("/login")}
                                className="block text-zinc-400 hover:text-amber-500 transition-colors text-sm font-medium"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => navigate("/signup")}
                                className="w-full px-5 py-3 bg-gradient-to-r from-amber-700 to-orange-900 text-white rounded-xl text-sm font-semibold"
                            >
                                Start Free Trial
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* ========== HERO SECTION ========== */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 px-6 overflow-hidden">
                {/* Ambient Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-amber-900/8 blur-[150px] rounded-full -z-10" />
                <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-orange-900/5 blur-[120px] rounded-full -z-10" />

                {/* Tile Pattern Overlay */}
                <div className="absolute inset-0 -z-10 opacity-[0.02]" style={{
                    backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(255,255,255,0.1) 80px, rgba(255,255,255,0.1) 81px),
                            repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(255,255,255,0.1) 80px, rgba(255,255,255,0.1) 81px)`
                }} />

                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left Content */}
                        <div className="text-center lg:text-left">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-900/10 border border-amber-800/20 mb-8">
                                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                <span className="text-amber-500 text-xs font-medium tracking-wider uppercase">
                                    Trusted by 500+ Tile Businesses
                                </span>
                            </div>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.05]">
                                Precision Billing for{" "}
                                <span className="bg-gradient-to-r from-amber-200 via-amber-500 to-orange-700 bg-clip-text text-transparent">
                                    Modern Enterprise.
                                </span>
                            </h1>

                            <p className="text-zinc-500 text-lg lg:text-xl max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
                                Seamlessly manage your tiles inventory, generate refined quotations, and handle
                                GST-compliant invoicing with an architecture built for integrity and scale.
                            </p>

                            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-12">
                                <button
                                    onClick={() => navigate("/signup")}
                                    className="group px-8 py-4 bg-gradient-to-r from-amber-700 to-orange-900 text-white rounded-xl font-semibold shadow-[0_0_30px_rgba(180,83,9,0.3)] transition-all duration-300 transform hover:-translate-y-1 active:scale-95 hover:shadow-[0_0_40px_rgba(180,83,9,0.4)] flex items-center justify-center gap-2"
                                >
                                    Start Free Trial
                                    <span className="group-hover:translate-x-1 transition-transform">
                                        <IconArrowRight />
                                    </span>
                                </button>
                                <button className="group px-8 py-4 bg-zinc-900/50 backdrop-blur-md border border-zinc-800 text-zinc-300 rounded-xl font-semibold hover:bg-zinc-800/80 hover:border-zinc-700 transition-all flex items-center justify-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-amber-700/20 flex items-center justify-center text-amber-500 group-hover:bg-amber-700/30 transition-colors">
                                        <IconPlay />
                                    </span>
                                    Watch Demo
                                </button>
                            </div>

                            {/* Trust Indicators */}
                            <div className="flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-3">
                                {["No credit card required", "14-day free trial", "Cancel anytime"].map((text) => (
                                    <span key={text} className="flex items-center gap-2 text-zinc-600 text-sm">
                                        <span className="text-amber-600"><IconCheck /></span>
                                        {text}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Right - Dashboard Preview */}
                        <div className="hidden lg:block">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-gradient-to-r from-amber-900/10 via-transparent to-orange-900/10 blur-3xl rounded-3xl" />
                                <div className="relative">
                                    <DashboardPreview />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== STATS BAR ========== */}
            <section className="border-y border-zinc-800/40 bg-zinc-900/20">
                <div className="max-w-7xl mx-auto px-6 py-14">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x md:divide-zinc-800/40">
                        {[
                            { value: 500, suffix: "+", label: "Active Businesses" },
                            { value: 12, suffix: "L+", label: "Invoices Generated" },
                            { value: 99.9, suffix: "%", label: "Uptime Guaranteed" },
                            { value: 24, suffix: "/7", label: "Support Available" },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent mb-2">
                                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                                </div>
                                <p className="text-zinc-500 text-sm">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========== FEATURES SECTION ========== */}
            <section id="features" className="py-24 lg:py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-900/10 border border-amber-800/20 mb-6">
                            <span className="text-amber-500 text-xs font-medium tracking-wider uppercase">The Craftsmanship</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5 tracking-tight">
                            Every feature, meticulously{" "}
                            <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
                                engineered.
                            </span>
                        </h2>
                        <p className="text-zinc-500 text-lg max-w-2xl mx-auto leading-relaxed">
                            Built with seamless integration, data integrity, and robust architecture
                            at its core — designed exclusively for the tiles industry.
                        </p>
                    </div>

                    {/* Feature Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={<IconReceipt />}
                            title="GST-Compliant Billing"
                            description="Generate invoices with automatic CGST, SGST, and IGST calculations. Multiple tax slabs, HSN codes, and e-way bill integration built right in."
                            delay={0}
                        />
                        <FeatureCard
                            icon={<IconBoxes />}
                            title="Smart Inventory Engine"
                            description="Track tiles by brand, size, finish, and lot number. Real-time stock alerts, batch management, and seamless purchase order creation."
                            delay={100}
                        />
                        <FeatureCard
                            icon={<IconFileText />}
                            title="Refined Quotations"
                            description="Create professional quotations with tile images, area calculations, and wastage percentages. Convert to invoices in a single click."
                            delay={200}
                        />
                        <FeatureCard
                            icon={<IconBarChart />}
                            title="Executive Analytics"
                            description="Crystal-clear dashboards showing sales trends, profit margins, top-selling products, and customer insights — all in real time."
                            delay={300}
                        />
                        <FeatureCard
                            icon={<IconUsers />}
                            title="Customer Ledger"
                            description="Complete customer management with credit tracking, payment history, outstanding balances, and automated payment reminders via SMS and WhatsApp."
                            delay={400}
                        />
                        <FeatureCard
                            icon={<IconShieldCheck />}
                            title="Bank-Grade Security"
                            description="256-bit encryption, role-based access control, automated cloud backups, and complete audit trails. Your data integrity is non-negotiable."
                            delay={500}
                        />
                    </div>
                </div>
            </section>

            {/* ========== DASHBOARD SHOWCASE (Mobile) ========== */}
            <section className="lg:hidden px-6 pb-20">
                <DashboardPreview />
            </section>

            {/* ========== HOW IT WORKS ========== */}
            <section id="how-it-works" className="py-24 lg:py-32 px-6 border-t border-zinc-800/40">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-900/10 border border-amber-800/20 mb-6">
                            <span className="text-amber-500 text-xs font-medium tracking-wider uppercase">How It Works</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5 tracking-tight">
                            Up and running in{" "}
                            <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
                                minutes.
                            </span>
                        </h2>
                        <p className="text-zinc-500 text-lg max-w-xl mx-auto">
                            No complex setup. No IT team required. Just sign up, import, and start billing.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8 relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-amber-800/30 via-amber-600/20 to-amber-800/30" />

                        <StepCard
                            number="01"
                            title="Create Account"
                            description="Sign up with your business details. Takes less than 2 minutes to get started."
                            delay={0}
                        />
                        <StepCard
                            number="02"
                            title="Import Catalog"
                            description="Upload your tiles inventory via Excel or add products manually with ease."
                            delay={150}
                        />
                        <StepCard
                            number="03"
                            title="Generate Bills"
                            description="Create GST invoices, quotations, and delivery challans with automatic calculations."
                            delay={300}
                        />
                        <StepCard
                            number="04"
                            title="Grow Business"
                            description="Use analytics and insights to make smarter decisions and scale operations."
                            delay={450}
                        />
                    </div>
                </div>
            </section>

            {/* ========== TILES-SPECIFIC FEATURES ========== */}
            <section className="py-24 lg:py-32 px-6 border-t border-zinc-800/40 bg-zinc-950/50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-900/10 border border-amber-800/20 mb-6">
                                <span className="text-amber-500 text-xs font-medium tracking-wider uppercase">Built for Tiles</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                                Not just billing.{" "}
                                <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
                                    Built for your industry.
                                </span>
                            </h2>
                            <p className="text-zinc-500 text-lg mb-10 leading-relaxed">
                                Generic billing software doesn't understand tiles. We do. Every feature
                                is crafted with the unique challenges of the tiles business in mind.
                            </p>

                            <div className="space-y-6">
                                {[
                                    {
                                        icon: <IconZap />,
                                        title: "Area & Box Calculator",
                                        desc: "Automatically calculate tile area in sq.ft, number of boxes needed, and wastage percentage.",
                                    },
                                    {
                                        icon: <IconGrid />,
                                        title: "Size & Finish Variants",
                                        desc: "Manage 2x2, 4x2, 4x4, and custom sizes with glossy, matte, and carving finish types.",
                                    },
                                    {
                                        icon: <IconBoxes />,
                                        title: "Lot & Shade Tracking",
                                        desc: "Track tile lots and shades to ensure consistent delivery and minimize returns.",
                                    },
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 group">
                                        <div className="w-12 h-12 rounded-xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-amber-600 flex-shrink-0 group-hover:border-amber-700/50 transition-colors">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold mb-1">{item.title}</h3>
                                            <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Feature Visual */}
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-br from-amber-900/10 to-transparent blur-3xl rounded-3xl" />
                            <div className="relative rounded-2xl bg-zinc-900/60 border border-zinc-800/60 p-6 backdrop-blur-sm">
                                {/* Invoice Preview */}
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h4 className="text-white font-bold">Invoice #INV-1248</h4>
                                        <p className="text-zinc-600 text-xs mt-1">Generated: 15 Jan 2025</p>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">Paid</div>
                                </div>

                                <div className="rounded-lg bg-zinc-800/40 border border-zinc-700/20 overflow-hidden mb-4">
                                    <div className="grid grid-cols-5 gap-2 px-4 py-2 bg-zinc-800/60 text-[10px] text-zinc-500 uppercase tracking-wider font-medium">
                                        <span className="col-span-2">Product</span>
                                        <span>Size</span>
                                        <span>Boxes</span>
                                        <span className="text-right">Amount</span>
                                    </div>
                                    {[
                                        { name: "Somany Durastone", size: "4x2 ft", boxes: "24", amount: "₹18,960" },
                                        { name: "Kajaria Eternity", size: "2x2 ft", boxes: "40", amount: "₹24,000" },
                                        { name: "AGL Magnifico", size: "4x4 ft", boxes: "12", amount: "₹32,400" },
                                    ].map((item, i) => (
                                        <div key={i} className={`grid grid-cols-5 gap-2 px-4 py-3 text-xs ${i < 2 ? "border-b border-zinc-700/20" : ""}`}>
                                            <span className="col-span-2 text-zinc-300 font-medium">{item.name}</span>
                                            <span className="text-zinc-500">{item.size}</span>
                                            <span className="text-zinc-500">{item.boxes}</span>
                                            <span className="text-right text-amber-400 font-medium">{item.amount}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between items-end">
                                    <div className="text-[10px] text-zinc-600">
                                        <div>GSTIN: 24AABCU9603R1ZM</div>
                                        <div className="mt-0.5">Quantile, Morbi, Gujarat</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-zinc-500 mb-1">Grand Total</div>
                                        <div className="text-2xl font-extrabold bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent">
                                            ₹88,885
                                        </div>
                                        <div className="text-[10px] text-zinc-600 mt-0.5">Incl. 18% GST</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== TESTIMONIALS ========== */}
            <section id="testimonials" className="py-24 lg:py-32 px-6 border-t border-zinc-800/40">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-900/10 border border-amber-800/20 mb-6">
                            <span className="text-amber-500 text-xs font-medium tracking-wider uppercase">Testimonials</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5 tracking-tight">
                            Trusted by tile businesses{" "}
                            <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
                                across India.
                            </span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <TestimonialCard
                            quote="Quantile Management has transformed our billing process. What used to take 30 minutes per invoice now takes under 2 minutes. The GST calculations are always spot-on."
                            name="Rajesh Patel"
                            role="Owner, Patel Ceramics, Morbi"
                            delay={0}
                        />
                        <TestimonialCard
                            quote="The inventory tracking with lot numbers and shade management is a game-changer. We've reduced wrong-shade complaints by 90%. Absolutely worth every rupee."
                            name="Amit Sharma"
                            role="MD, Sharma Tiles Depot, Ahmedabad"
                            delay={150}
                        />
                        <TestimonialCard
                            quote="Beautiful interface, powerful features. The area calculator alone saves us hours of work daily. Customer ledger management is seamless and our collections have improved."
                            name="Priya Mehta"
                            role="Operations Head, Mehta Flooring, Surat"
                            delay={300}
                        />
                    </div>
                </div>
            </section>

            {/* ========== PRICING ========== */}
            <section id="pricing" className="py-24 lg:py-32 px-6 border-t border-zinc-800/40 bg-zinc-950/50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-900/10 border border-amber-800/20 mb-6">
                            <span className="text-amber-500 text-xs font-medium tracking-wider uppercase">Pricing</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5 tracking-tight">
                            Plans that{" "}
                            <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
                                scale with you.
                            </span>
                        </h2>
                        <p className="text-zinc-500 text-lg max-w-xl mx-auto">
                            Start free and upgrade as your business grows. No hidden charges, ever.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                        <PricingCard
                            title="Starter"
                            price="₹999"
                            period="month"
                            features={[
                                "Up to 500 invoices/month",
                                "1,000 inventory items",
                                "Basic GST billing",
                                "Email support",
                                "1 user account",
                                "Basic reports",
                            ]}
                            delay={0}
                        />
                        <PricingCard
                            title="Professional"
                            price="₹2,499"
                            period="month"
                            features={[
                                "Unlimited invoices",
                                "10,000 inventory items",
                                "Advanced GST & e-Way Bill",
                                "Priority phone support",
                                "5 user accounts",
                                "Advanced analytics",
                                "WhatsApp integration",
                                "Customer portal",
                            ]}
                            highlighted
                            delay={150}
                        />
                        <PricingCard
                            title="Enterprise"
                            price="₹4,999"
                            period="month"
                            features={[
                                "Everything in Professional",
                                "Unlimited inventory",
                                "Multi-branch support",
                                "Dedicated account manager",
                                "Unlimited users",
                                "Custom integrations",
                                "API access",
                                "White-label option",
                            ]}
                            delay={300}
                        />
                    </div>
                </div>
            </section>

            {/* ========== FINAL CTA ========== */}
            <section className="py-24 lg:py-32 px-6 border-t border-zinc-800/40 relative overflow-hidden">
                {/* Ambient glow */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-900/10 blur-[150px] rounded-full -z-10" />

                <div className="max-w-4xl mx-auto text-center relative">
                    <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                        Ready to elevate your{" "}
                        <span className="bg-gradient-to-r from-amber-200 via-amber-500 to-orange-700 bg-clip-text text-transparent">
                            tiles business?
                        </span>
                    </h2>
                    <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                        Join 500+ tile businesses across India who trust Quantile Management
                        for precision billing, inventory management, and business growth.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
                        <button
                            onClick={() => navigate("/signup")}
                            className="group px-10 py-5 bg-gradient-to-r from-amber-700 to-orange-900 text-white rounded-2xl font-bold text-lg shadow-[0_0_40px_rgba(180,83,9,0.3)] transition-all duration-300 transform hover:-translate-y-1 active:scale-95 hover:shadow-[0_0_60px_rgba(180,83,9,0.4)] flex items-center justify-center gap-2"
                        >
                            Start Your Free Trial
                            <span className="group-hover:translate-x-1 transition-transform">
                                <IconChevronRight />
                            </span>
                        </button>
                        <button className="px-10 py-5 bg-zinc-900/50 backdrop-blur-md border border-zinc-800 text-zinc-300 rounded-2xl font-bold text-lg hover:bg-zinc-800/80 hover:border-zinc-700 transition-all">
                            Schedule a Demo
                        </button>
                    </div>

                    <p className="text-zinc-600 text-sm">
                        No credit card required · 14-day free trial · Full feature access
                    </p>
                </div>
            </section>

            {/* ========== FOOTER ========== */}
            <footer className="border-t border-zinc-800/40 bg-zinc-950/80">
                <div className="max-w-7xl mx-auto px-6 py-16">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        {/* Brand */}
                        <div className="md:col-span-1">
                            <div className="text-2xl font-bold tracking-tighter flex items-center gap-2.5 mb-4">
                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-800 flex items-center justify-center shadow-lg shadow-amber-900/30">
                                    <IconGrid />
                                </div>
                                <span className="text-white">
                                    QUAN<span className="text-amber-500">TILE</span>
                                </span>
                            </div>
                            <p className="text-zinc-600 text-sm leading-relaxed mb-6">
                                Precision billing and inventory management software, crafted exclusively for the tiles industry.
                            </p>
                            <div className="flex gap-4">
                                {["Twitter", "LinkedIn", "YouTube"].map((social) => (
                                    <a
                                        key={social}
                                        href="#"
                                        className="w-9 h-9 rounded-lg bg-zinc-800/50 border border-zinc-700/30 flex items-center justify-center text-zinc-500 hover:text-amber-500 hover:border-amber-800/30 transition-all text-xs font-bold"
                                    >
                                        {social[0]}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Links */}
                        {[
                            {
                                title: "Product",
                                links: ["Features", "Pricing", "Integrations", "Changelog", "API Docs"],
                            },
                            {
                                title: "Company",
                                links: ["About Us", "Blog", "Careers", "Contact", "Partners"],
                            },
                            {
                                title: "Support",
                                links: ["Help Center", "Documentation", "Community", "Status", "Privacy Policy"],
                            },
                        ].map((col) => (
                            <div key={col.title}>
                                <h4 className="text-white font-semibold text-sm mb-4">{col.title}</h4>
                                <ul className="space-y-3">
                                    {col.links.map((link) => (
                                        <li key={link}>
                                            <a href="#" className="text-zinc-600 hover:text-amber-500 text-sm transition-colors">
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Bottom */}
                    <div className="border-t border-zinc-800/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-zinc-700 text-sm">
                            © 2025 Quantile Management System. All rights reserved.
                        </p>
                        <p className="text-zinc-700 text-sm flex items-center gap-1.5">
                            Made with
                            <span className="text-amber-600">♦</span>
                            in India
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default QuantileLanding;