
import React, { useState, useRef, useMemo } from 'react';
import { Plus, Upload, Trash2, Edit3, Wand2, Search, Hash, Sparkles, Tag, Building2, Layers, Percent, X, TrendingDown, Filter, RotateCcw } from 'lucide-react';
import { Product, Discount } from '../types';
import { generateProductDescription } from '../services/geminiService';

interface ProductManagementProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  discounts?: Discount[];
  setDiscounts: React.Dispatch<React.SetStateAction<Discount[]>>;
}

const ProductManagement: React.FC<ProductManagementProps> = ({ products, setProducts, discounts = [], setDiscounts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedCompany, setSelectedCompany] = useState('ALL');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [discountingProductId, setDiscountingProductId] = useState<string | null>(null);
  const [discountValue, setDiscountValue] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derive unique categories and companies for filters
  const categories = useMemo(() => ['ALL', ...Array.from(new Set(products.map(p => p.category)))], [products]);
  const companies = useMemo(() => ['ALL', ...Array.from(new Set(products.map(p => p.companyName)))], [products]);

  const handleSaveProduct = () => {
    if (!editingProduct?.name || !editingProduct?.price || !editingProduct?.code || !editingProduct?.companyName) {
      alert("Please fill in all required fields including Company Name.");
      return;
    }

    if (editingProduct.id) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? (editingProduct as Product) : p));
    } else {
      const newProduct: Product = {
        ...(editingProduct as Omit<Product, 'id'>),
        id: Math.random().toString(36).substr(2, 9),
        image: editingProduct.image || 'https://picsum.photos/seed/new/400/400'
      };
      setProducts(prev => [newProduct, ...prev]);
    }
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingProduct(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAiAssist = async () => {
    if (!editingProduct?.name || !editingProduct?.category || !editingProduct?.companyName) {
      alert("Please provide name, company, and category first for AI generation!");
      return;
    }
    setIsGenerating(true);
    const desc = await generateProductDescription(editingProduct.name, editingProduct.category, editingProduct.companyName);
    setEditingProduct(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const getProductDiscount = (productId: string) => {
    return discounts.find(d => d.isActive && d.targetProductId === productId);
  };

  const handleQuickDiscount = (product: Product) => {
    const existing = getProductDiscount(product.id);
    setDiscountValue(existing ? existing.percentage : 0);
    setDiscountingProductId(product.id);
  };

  const saveDiscount = () => {
    if (!discountingProductId) return;

    if (discountValue <= 0) {
      setDiscounts(prev => prev.filter(d => d.targetProductId !== discountingProductId));
    } else {
      const targetProduct = products.find(p => p.id === discountingProductId);
      setDiscounts(prev => {
        const filtered = prev.filter(d => d.targetProductId !== discountingProductId);
        const newDisc: Discount = {
          id: Math.random().toString(36).substr(2, 9),
          code: `AUTO-${targetProduct?.code}`,
          percentage: discountValue,
          isActive: true,
          isAutomatic: true,
          targetProductId: discountingProductId,
          description: `Admin Markdown: ${discountValue}% off ${targetProduct?.name}`
        };
        return [...filtered, newDisc];
      });
    }
    setDiscountingProductId(null);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('ALL');
    setSelectedCompany('ALL');
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesCompany = selectedCompany === 'ALL' || p.companyName === selectedCompany;

    return matchesSearch && matchesCategory && matchesCompany;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Product Inventory</h2>
          <p className="text-slate-500 font-medium">Manage your catalog and monitor active discounts at a glance.</p>
        </div>
        <button 
          onClick={() => { setEditingProduct({ code: '', category: '', companyName: '' }); setIsModalOpen(true); }}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl hover:bg-indigo-600 shadow-xl shadow-slate-200 flex items-center gap-2 whitespace-nowrap transition-all active:scale-95 font-black text-sm w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          Add New SKU
        </button>
      </div>

      {/* Advanced Filter Bar */}
      <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col xl:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Quick search by name or code..."
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 outline-none transition-all font-medium text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full xl:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-11 pr-8 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none appearance-none font-bold text-xs uppercase tracking-widest text-slate-600 cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'ALL' ? 'All Categories' : cat}</option>
              ))}
            </select>
          </div>

          <div className="relative flex-1 sm:w-48">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select 
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full pl-11 pr-8 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none appearance-none font-bold text-xs uppercase tracking-widest text-slate-600 cursor-pointer"
            >
              {companies.map(comp => (
                <option key={comp} value={comp}>{comp === 'ALL' ? 'All Companies' : comp}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={resetFilters}
            className="p-4 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-2xl transition-all hover:bg-white border border-transparent hover:border-slate-200"
            title="Reset Filters"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identification</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Branding</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Valuation</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Warehouse</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.length > 0 ? filteredProducts.map(product => {
                const activeDiscount = getProductDiscount(product.id);
                const isDiscounting = discountingProductId === product.id;

                return (
                  <tr key={product.id} className="group hover:bg-indigo-50/20 transition-all">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-12 h-12 rounded-xl object-cover shadow-sm bg-slate-100 border border-slate-200 group-hover:border-indigo-300 transition-colors" 
                          />
                          {activeDiscount && (
                            <div className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white w-5 h-5 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white animate-in zoom-in duration-300">
                               <Sparkles size={10} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex flex-col justify-center">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="font-black text-slate-900 text-sm truncate leading-none">{product.name}</h3>
                            <span className="text-[8px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 uppercase tracking-tighter">#{product.code}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                             <Layers size={10} className="text-slate-400" />
                             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">{product.category}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-700">
                         <Building2 size={14} className="text-indigo-500" />
                         <span className="text-sm font-black">{product.companyName}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        {activeDiscount ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                               <span className="font-black text-rose-600 text-xl tracking-tighter">
                                 ${(product.price * (1 - activeDiscount.percentage / 100)).toFixed(2)}
                               </span>
                               <div className="bg-rose-500 text-white px-2 py-0.5 rounded-lg text-[10px] font-black flex items-center gap-1 shadow-sm">
                                 <TrendingDown size={10} /> {activeDiscount.percentage}%
                               </div>
                            </div>
                            <span className="text-xs font-bold text-slate-300 line-through block">
                              Reg. ${product.price.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="font-black text-slate-900 text-xl tracking-tighter">${product.price.toFixed(2)}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className={`inline-flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl font-black ${product.stock > 10 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                         <span className="text-lg leading-none">{product.stock}</span>
                         <span className="text-[8px] uppercase tracking-widest opacity-70 font-black">Stock Units</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {isDiscounting ? (
                          <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-2xl animate-in slide-in-from-right-4 ring-8 ring-indigo-50 shadow-2xl">
                             <input 
                               type="number" 
                               autoFocus
                               className="w-16 bg-white/10 text-white border-none outline-none font-black text-center px-2 py-2 rounded-xl placeholder:text-white/30"
                               placeholder="%"
                               value={discountValue || ''}
                               onChange={e => setDiscountValue(parseInt(e.target.value) || 0)}
                               onKeyDown={e => e.key === 'Enter' && saveDiscount()}
                             />
                             <button onClick={saveDiscount} className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors shadow-lg">
                               <Plus size={16} />
                             </button>
                             <button onClick={() => setDiscountingProductId(null)} className="p-2 text-white/50 hover:text-white">
                               <X size={16} />
                             </button>
                          </div>
                        ) : (
                          <>
                            <button 
                              onClick={() => handleQuickDiscount(product)}
                              className={`p-3 border rounded-2xl transition-all active:scale-95 flex items-center gap-2 shadow-sm ${activeDiscount ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-white text-slate-400 border-slate-100 hover:text-indigo-600 hover:border-indigo-200'}`}
                              title={activeDiscount ? `Modify ${activeDiscount.percentage}% Discount` : "Set Quick Discount"}
                            >
                              <Percent size={18} />
                            </button>
                            <button 
                              onClick={() => { setEditingProduct(product); setIsModalOpen(true); }}
                              className="p-3 bg-white text-slate-400 border border-slate-100 rounded-2xl hover:text-indigo-600 hover:border-indigo-200 hover:shadow-lg transition-all active:scale-95"
                            >
                              <Edit3 size={18} />
                            </button>
                            <button 
                              onClick={() => setProducts(prev => prev.filter(p => p.id !== product.id))}
                              className="p-3 bg-white text-slate-300 border border-slate-100 rounded-2xl hover:text-rose-500 hover:border-rose-200 hover:shadow-lg transition-all active:scale-95"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-300">
                       <Filter size={48} className="mb-4 opacity-10" />
                       <p className="font-black text-xl">No products match your filters</p>
                       <button onClick={resetFilters} className="mt-4 text-indigo-600 font-bold text-xs uppercase tracking-widest hover:underline">Clear all filters</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="p-10 space-y-8">
              <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">{editingProduct?.id ? 'Edit Product' : 'Add New Product'}</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Catalog Entry Details</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full text-slate-300 hover:text-slate-900 transition-all">✕</button>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="col-span-2 sm:col-span-1 space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Hash size={12}/> Product Code (SKU)</label>
                  <input 
                    type="text" 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-8 focus:ring-indigo-50 focus:border-indigo-500 outline-none uppercase font-mono text-sm tracking-widest font-black"
                    placeholder="SKU-XXXXX"
                    value={editingProduct?.code || ''}
                    onChange={e => setEditingProduct(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1 space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Name</label>
                  <input 
                    type="text" 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-8 focus:ring-indigo-50 outline-none font-bold"
                    placeholder="e.g. Wireless Pro Headset"
                    value={editingProduct?.name || ''}
                    onChange={e => setEditingProduct(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1 space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Building2 size={12}/> Company / Manufacturer</label>
                  <input 
                    type="text" 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-8 focus:ring-indigo-50 outline-none font-bold"
                    placeholder="e.g. Sonic Tech"
                    value={editingProduct?.companyName || ''}
                    onChange={e => setEditingProduct(prev => ({ ...prev, companyName: e.target.value }))}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1 space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Layers size={12}/> Category</label>
                  <input 
                    type="text" 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-8 focus:ring-indigo-50 outline-none font-bold"
                    placeholder="e.g. Electronics"
                    value={editingProduct?.category || ''}
                    onChange={e => setEditingProduct(prev => ({ ...prev, category: e.target.value }))}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1 space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price ($)</label>
                  <input 
                    type="number" 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-8 focus:ring-indigo-50 outline-none font-black text-indigo-600 text-xl"
                    value={editingProduct?.price || ''}
                    onChange={e => setEditingProduct(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1 space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Stock Count</label>
                  <input 
                    type="number" 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-8 focus:ring-indigo-50 outline-none font-bold"
                    value={editingProduct?.stock || ''}
                    onChange={e => setEditingProduct(prev => ({ ...prev, stock: parseInt(e.target.value) }))}
                  />
                </div>

                <div className="col-span-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                    <button 
                      onClick={handleAiAssist}
                      disabled={isGenerating}
                      className="text-[9px] flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-black bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100 transition-all uppercase tracking-widest shadow-sm"
                    >
                      {isGenerating ? <div className="w-3 h-3 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" /> : <><Wand2 size={12} /> AI Copywriter</>}
                    </button>
                  </div>
                  <textarea 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[2rem] focus:ring-8 focus:ring-indigo-50 outline-none h-32 resize-none font-medium text-slate-600 leading-relaxed shadow-inner"
                    value={editingProduct?.description || ''}
                    onChange={e => setEditingProduct(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="col-span-2 space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Image</label>
                  <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-24 h-24 bg-white border-2 border-dashed border-slate-200 rounded-[1.5rem] flex flex-col items-center justify-center text-slate-300 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 hover:text-indigo-600 transition-all overflow-hidden shadow-sm"
                    >
                      {editingProduct?.image ? (
                        <img src={editingProduct.image} className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <Upload size={24} />
                          <span className="text-[8px] mt-1 font-black uppercase">Upload</span>
                        </>
                      )}
                    </div>
                    <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    <div className="flex-1">
                       <p className="text-xs font-bold text-slate-800">Media Upload</p>
                       <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-widest font-medium">PNG, JPG, WEBP • Max 2MB</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-5 bg-slate-50 text-slate-400 rounded-[2rem] font-black uppercase tracking-widest hover:text-slate-900 transition-all text-xs"
                >
                  Discard
                </button>
                <button 
                  onClick={handleSaveProduct}
                  className="flex-[2] py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                >
                  Save Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
