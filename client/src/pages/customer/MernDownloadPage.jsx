import { useState, useEffect } from "react";
import {
  Download,
  Database,
  Server,
  Layers,
  Terminal,
  CheckCircle2,
  Copy,
  Check,
  Code2
} from "lucide-react";
import { adminService } from "../../services/adminService";
import toast from "react-hot-toast";
export const MernDownloadPage = () => {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [mongoStatus, setMongoStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [testUri, setTestUri] = useState("");
  const [connecting, setConnecting] = useState(false);
  useEffect(() => {
    fetchStatus();
  }, []);
  const fetchStatus = async () => {
    setLoadingStatus(true);
    try {
      const data = await adminService.getDatabaseStatus();
      setMongoStatus(data);
    } catch {
    } finally {
      setLoadingStatus(false);
    }
  };
  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    toast.success("Command copied to clipboard!");
    setTimeout(() => setCopiedIndex(null), 2e3);
  };
  const handleConnectMongo = async (e) => {
    e.preventDefault();
    if (!testUri.trim()) {
      toast.error("Please enter a valid MongoDB connection URI");
      return;
    }
    setConnecting(true);
    try {
      const res = await adminService.connectMongoDB(testUri.trim());
      toast.success(res.message || "Connected to MongoDB Atlas successfully!");
      fetchStatus();
      setTestUri("");
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || "Failed to connect to MongoDB");
    } finally {
      setConnecting(false);
    }
  };
  const packages = [
    {
      id: "mern",
      title: "Complete MERN Stack Project (All-in-One)",
      badge: "Recommended \xB7 Pure JS MERN",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
      description: "Complete e-commerce platform with React 19 frontend, Node.js + Express REST API, MongoDB Mongoose models, and auto-seeding catalog.",
      size: "~4.7 MB",
      primaryUrl: "/saree-sansar-mern-javascript.zip",
      filename: "saree-sansar-mern-javascript.zip",
      tags: ["React 19", "Express.js", "Node.js", "MongoDB Mongoose", "Tailwind CSS"],
      highlight: true,
      features: [
        "100% Pure JavaScript (Zero build or TypeScript hurdles)",
        "Full catalog with Tussar, Banarasi & Silk sarees",
        "Working Cart, Wishlist, Address Book & Order tracking",
        "Direct MongoDB Atlas connector with local JSON fallback",
        "Ready-to-run package.json with simple `npm run dev`"
      ]
    },
    {
      id: "frontend",
      title: "Pure React 19 Frontend (JSX + Vite)",
      badge: "Client SPA",
      badgeColor: "bg-sky-100 text-sky-900 border-sky-300",
      description: "Standalone frontend with Vite build tool, Tailwind CSS, Lucide icons, responsive layout, and customer account dashboard.",
      size: "~4.6 MB",
      primaryUrl: "/saree-sansar-frontend-javascript.zip",
      filename: "saree-sansar-frontend-javascript.zip",
      tags: ["React 19", "Vite", "Tailwind CSS", "Responsive UI"],
      highlight: false,
      features: [
        "Zero TypeScript build complications (100% Pure JSX)",
        "Product details with image magnifier & size guide",
        "Customer address book & security management",
        "Pre-configured API service connecting to Express backend"
      ]
    },
    {
      id: "backend",
      title: "Node.js + Express + MongoDB Backend",
      badge: "REST API & Mongoose",
      badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
      description: "Lightweight, high-performance Node.js & Express RESTful API server with Mongoose models, authentication, order processing, and reviews.",
      size: "~47 KB",
      primaryUrl: "/saree-sansar-backend-javascript.zip",
      filename: "saree-sansar-backend-javascript.zip",
      tags: ["Node.js", "Express.js", "Mongoose", "MongoDB Atlas", "JWT"],
      highlight: false,
      features: [
        "Native ES Modules with zero transpilation needed",
        "Mongoose models: Product, Saree, User, Order, Category, Review",
        "Pre-seeded catalog database included in data/database.json",
        "Live health check endpoint at /api/health"
      ]
    },
    {
      id: "source",
      title: "Complete Workspace Full Source Archive",
      badge: "Full Workspace",
      badgeColor: "bg-purple-100 text-purple-900 border-purple-300",
      description: "Complete snapshot of the entire active codebase including developer toolchains, migration scripts, and all source assets.",
      size: "~5.2 MB",
      primaryUrl: "/saree-sansar-complete-source.zip",
      filename: "saree-sansar-complete-source.zip",
      tags: ["Full Workspace", "All Configs", "Build Scripts"],
      highlight: false,
      features: [
        "Contains everything in this working instance",
        "Includes bundling scripts in scripts/ directory",
        "Supports full-stack unified dev server"
      ]
    }
  ];
  return <div className="bg-[#FCF9F5] min-h-screen py-8 sm:py-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {
    /* Header Hero Banner */
  }
        <div className="bg-gradient-to-br from-[#4a0e1b] via-[#6b1426] to-[#3a0b15] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-[#f2ce6e]/30">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-[#f2ce6e]/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f2ce6e]/20 border border-[#f2ce6e]/40 text-[#f2ce6e] text-xs font-bold uppercase tracking-wider">
              <Code2 className="w-3.5 h-3.5" />
              <span>100% Pure MERN Stack Project Download</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Download Complete MERN Stack Source Code (.ZIP)
            </h1>

            <p className="text-sm sm:text-base text-stone-200 leading-relaxed">
              This e-commerce application is built on pure MERN architecture —{" "}
              <strong className="text-[#f2ce6e]">MongoDB</strong>,{" "}
              <strong className="text-[#f2ce6e]">Express.js</strong>,{" "}
              <strong className="text-[#f2ce6e]">React 19</strong>, and{" "}
              <strong className="text-[#f2ce6e]">Node.js</strong>. Download the ready-to-run source code in one click!
            </p>

            <div className="pt-2 flex flex-wrap gap-3 items-center text-xs font-semibold text-amber-200">
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                MongoDB Atlas Ready
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                React 19 + Express API
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Full Catalog &amp; Cart Included
              </span>
            </div>
          </div>
        </div>

        {
    /* MERN Architecture Cards */
  }
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-900 text-sm">MongoDB</h3>
            <p className="text-xs text-stone-500">Mongoose ORM models for Products, Orders, Users &amp; Reviews.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-900 text-sm">Express.js</h3>
            <p className="text-xs text-stone-500">RESTful API routes for authentication, catalog, and checkout.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-900 text-sm">React 19</h3>
            <p className="text-xs text-stone-500">Fast UI with Vite, Tailwind CSS, Cart Context, and Wishlist.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-900 text-sm">Node.js</h3>
            <p className="text-xs text-stone-500">High-performance server runtime with zero transpilation hurdles.</p>
          </div>
        </div>

        {
    /* Download Packages Section */
  }
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                Available MERN Code Packages (.ZIP)
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Click any download button below to get the source code instantly.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packages.map((pkg) => <div
    key={pkg.id}
    className={`bg-white rounded-2xl border p-6 flex flex-col justify-between space-y-5 transition-all ${pkg.highlight ? "border-[#881930] ring-2 ring-[#881930]/20 shadow-md" : "border-stone-200/90 shadow-2xs hover:border-stone-300"}`}
  >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${pkg.badgeColor}`}
  >
                      {pkg.badge}
                    </span>
                    <span className="text-xs font-mono font-semibold text-stone-500">{pkg.size}</span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-stone-900">{pkg.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{pkg.description}</p>

                  <ul className="space-y-1.5 pt-2">
                    {pkg.features.map((feat, i) => <li key={i} className="text-xs text-stone-700 flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>)}
                  </ul>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center gap-3">
                  <a
    href={pkg.primaryUrl}
    download={pkg.filename}
    className={`flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer ${pkg.highlight ? "bg-[#881930] hover:bg-[#6b1426] text-white" : "bg-stone-900 hover:bg-stone-800 text-white"}`}
  >
                    <Download className="w-4 h-4 text-[#f2ce6e]" />
                    <span>Download {pkg.filename}</span>
                  </a>
                </div>
              </div>)}
          </div>
        </div>

        {
    /* How to Run Locally */
  }
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-4">
          <h3 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#881930]" />
            <span>How to Run Locally in VS Code</span>
          </h3>

          <div className="bg-stone-900 text-stone-100 rounded-xl p-4 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-amber-400 font-bold">1. Extract and Install Dependencies:</span>
              <button
    type="button"
    onClick={() => handleCopy("unzip saree-sansar-mern-javascript.zip && cd saree-sansar-mern && npm install", "cmd1")}
    className="text-stone-400 hover:text-white flex items-center gap-1 text-[11px]"
  >
                {copiedIndex === "cmd1" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === "cmd1" ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <pre className="text-stone-300 overflow-x-auto p-2 bg-black/40 rounded-lg">
              unzip saree-sansar-mern-javascript.zip
              {"\n"}cd saree-sansar-mern
              {"\n"}npm install
            </pre>

            <div className="flex items-center justify-between pt-2">
              <span className="text-amber-400 font-bold">2. Start MERN Dev Server:</span>
              <button
    type="button"
    onClick={() => handleCopy("npm run dev", "cmd2")}
    className="text-stone-400 hover:text-white flex items-center gap-1 text-[11px]"
  >
                {copiedIndex === "cmd2" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === "cmd2" ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <pre className="text-stone-300 overflow-x-auto p-2 bg-black/40 rounded-lg">
              npm run dev
            </pre>
          </div>
        </div>

        {
    /* MongoDB Atlas Direct Connection Form */
  }
        <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-[#f2ce6e]" />
                <span>Live MongoDB Atlas Cloud Connector</span>
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Optionally connect this application directly to your MongoDB Atlas cloud database URI.
              </p>
            </div>
            {mongoStatus && <span
    className={`text-xs px-3 py-1 rounded-full font-semibold ${mongoStatus.isConnected ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/20 text-amber-300 border border-amber-500/30"}`}
  >
                {mongoStatus.isConnected ? "Connected to MongoDB Atlas" : "Local Memory Database Active"}
              </span>}
          </div>

          <form onSubmit={handleConnectMongo} className="flex flex-col sm:flex-row gap-3 pt-2">
            <input
    type="text"
    placeholder="mongodb+srv://username:password@cluster.mongodb.net/saree_sansar"
    value={testUri}
    onChange={(e) => setTestUri(e.target.value)}
    className="flex-1 px-4 py-3 bg-stone-800 border border-stone-700 focus:border-[#f2ce6e] rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none"
  />
            <button
    type="submit"
    disabled={connecting}
    className="px-6 py-3 bg-[#881930] hover:bg-[#6b1426] disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-md"
  >
              {connecting ? "Connecting..." : "Connect MongoDB"}
            </button>
          </form>
        </div>
      </div>
    </div>;
};
export default MernDownloadPage;
