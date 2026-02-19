
// import React, { useState, useEffect } from "react";
// import {
//   FileText,
//   Search,
//   Trash2,
//   Eye,
//   Edit,
//   Printer,
//   Filter,
//   AlertCircle,
//   BarChart3,
//   ShoppingCart,
//   X,
//   Save,
//   Plus,
//   Minus,
//   Calendar,
//   Phone,
//   User,
//   Package,
//   DollarSign,
//   Percent
// } from "lucide-react";

// const API_BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/api`;
// let userString = localStorage.getItem("user");
// let user = typeof userString === 'string' ? JSON.parse(userString) : null;
// // Helper function to calculate product total
// const calculateProductTotal = (product:any) => {
//   const discountPercent = parseFloat(product.dis) || 0;
//   const itemsTotal = (product.items || []).reduce((sum:any, item:any) => {
//     const price = product.value === 'nrp' ? (item.nrp || 0) : (item.mrp || 0);
//     const quantity = item.quantity || 1;
//     return sum + (quantity * price);
//   }, 0);
//   const discountAmount = (itemsTotal * discountPercent) / 100;
//   const subtotalAfterDiscount = itemsTotal - discountAmount;

//   // Only add GST if includeGst is true
//   if (product.includeGst === true) {
//     const gstAmount = subtotalAfterDiscount * 0.18;
//     return subtotalAfterDiscount + gstAmount;
//   }

//   return subtotalAfterDiscount;
// };

// function DashboardPage() {
// let userString = localStorage.getItem("user");
// let user = typeof userString === 'string' ? JSON.parse(userString) : null;

//   const API_ROUTES = {
//     GET_ALL_PRODUCTS: `${API_BASE_URL}/products?userId=${user?.id}`,
//     GET_PRODUCT: (id:any) => `${API_BASE_URL}/products/${id}?userId=${user?.id}`,
//     DELETE_PRODUCT: (id:any) => `${API_BASE_URL}/products/delete/${id}?userId=${user?.id}`,
//     UPDATE_PRODUCT: (id:any) => `${API_BASE_URL}/products/edit/${id}`,
//     GET_ALL_ITEMS: `${API_BASE_URL}/items?userId=${user?.id}`,
//   };
//   const [allProducts, setAllProducts] = useState<any>([]);
//   const [filteredProducts, setFilteredProducts] = useState<any>([]);
//   const [searchTerm, setSearchTerm] = useState<any>("");
//   const [fromDate, setFromDate] = useState<any>("");
//   const [toDate, setToDate] = useState<any>("");
//   const [showSearch, setShowSearch] = useState<any>(false);
//   const [loading, setLoading] = useState<any>(true);
//   const [error, setError] = useState<any>(null);
//   const [showDeleteModal, setShowDeleteModal] = useState<any>(false);
//   const [showEditModal, setShowEditModal] = useState<any>(false);
//   const [showViewModal, setShowViewModal] = useState<any>(false);
//   const [selectedProduct, setSelectedProduct] = useState<any>(null);
//   const [editFormData, setEditFormData] = useState<any>(null);
//   const [availableItems, setAvailableItems] = useState<any>([]);
//   const [showItemSelector, setShowItemSelector] = useState<any>(false);
//   const [itemSearchTerm, setItemSearchTerm] = useState<any>("");

//   useEffect(() => {
//     fetchProducts();
//     fetchItems();
//   }, []);

//   const fetchItems = async () => {
//     try {
//       const response = await fetch(API_ROUTES.GET_ALL_ITEMS);
//       if (!response.ok) throw new Error("Failed to fetch items");
//       const data = await response.json();
//       setAvailableItems(data?.items || []);
//     } catch (err) {
//       console.error("Error fetching items:", err);
//       setAvailableItems([]);
//     }
//   };

//   const fetchProducts = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(API_ROUTES.GET_ALL_PRODUCTS);
//       const data = await response.json();

//       if (response.ok && data.success) {
//         setAllProducts(data.products || []);
//         filterByLast30Days(data.products || []);
//       } else {
//         throw new Error(data.message || "Failed to fetch quotations");
//       }
//     } catch (err:any) {
//       setError(err.message);
//       setAllProducts([]);
//       setFilteredProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterByLast30Days = (products:any) => {
//     const today = new Date();
//     const thirtyDaysAgo = new Date();
//     thirtyDaysAgo.setDate(today.getDate() - 30);

//     const filtered = products.filter((p:any) => {
//       const productDate = new Date(p.date);
//       return productDate >= thirtyDaysAgo && productDate <= today;
//     });

//     setFilteredProducts(filtered);
//     setFromDate(thirtyDaysAgo.toISOString().split("T")[0]);
//     setToDate(today.toISOString().split("T")[0]);
//   };

//   const handleSearch = (e:any) => {
//     const term = e.target.value.toLowerCase();
//     setSearchTerm(term);

//     if (!term) {
//       applyCurrentDateFilter();
//       return;
//     }

//     const from = new Date(fromDate);
//     const to = new Date(toDate);
//     to.setHours(23, 59, 59, 999);

//     const filtered = allProducts.filter((p:any) => {
//       const productDate = new Date(p.date);
//       const inDateRange = productDate >= from && productDate <= to;
//       const matchesSearch =
//         p.name.toLowerCase().includes(term) ||
//         p.number.includes(term) ||
//         p._id.toLowerCase().includes(term);

//       return inDateRange && matchesSearch;
//     });

//     setFilteredProducts(filtered);
//   };

//   const applyCustomDateFilter = () => {
//     if (!fromDate || !toDate) {
//       alert("Please select both dates");
//       return;
//     }

//     const from = new Date(fromDate);
//     const to = new Date(toDate);
//     to.setHours(23, 59, 59, 999);

//     if (from > to) {
//       alert("From date cannot be after To date");
//       return;
//     }

//     const filtered = allProducts.filter((p:any) => {
//       const productDate = new Date(p.date);
//       return productDate >= from && productDate <= to;
//     });

//     setFilteredProducts(filtered);
//     setShowSearch(false);
//     setSearchTerm("");
//   };

//   const applyCurrentDateFilter = () => {
//     if (!fromDate || !toDate) return;

//     const from = new Date(fromDate);
//     const to = new Date(toDate);
//     to.setHours(23, 59, 59, 999);

//     const filtered = allProducts.filter((p:any) => {
//       const productDate = new Date(p.date);
//       return productDate >= from && productDate <= to;
//     });

//     setFilteredProducts(filtered);
//   };

//   const clearFilters = () => {
//     setSearchTerm("");
//     filterByLast30Days(allProducts);
//   };

//   const handleDeleteClick = (product:any) => {
//     setSelectedProduct(product);
//     setShowDeleteModal(true);
//   };

//   const confirmDelete = async () => {
//     if (!selectedProduct) return;

//     setLoading(true);
//     try {
//       const response = await fetch(API_ROUTES.DELETE_PRODUCT(selectedProduct._id), {
//         method: "DELETE",
//       });
//       const data = await response.json();

//       if (response.ok && data.success) {
//         setAllProducts((prev:any) => prev.filter((p:any) => p._id !== selectedProduct._id));
//         setFilteredProducts((prev:any) => prev.filter((p:any) => p._id !== selectedProduct._id));
//         alert("✅ Quotation deleted successfully");
//       } else {
//         throw new Error(data.message || "Failed to delete quotation");
//       }
//     } catch (err:any) {
//       console.error("❌ Error deleting quotation:", err);
//       alert(`Failed to delete: ${err.message}`);
//     } finally {
//       setLoading(false);
//       setShowDeleteModal(false);
//       setSelectedProduct(null);
//     }
//   };

//   const handleEditClick = (product:any) => {
//     setSelectedProduct(product);
//     setEditFormData({
//       name: product.name,
//       number: product.number,
//       address: product.address || "",
//       includeGst: product.includeGst === true,
//       date: product.date.split('T')[0],
//       value: product.value,
//       dis: product.dis || 0,
//       items: product.items.map((item:any) => ({
//         _id: item._id,
//         name: item.name,
//         description: item.description,
//         nrp: item.nrp,
//         mrp: item.mrp,
//         image: item.image,
//         quantity: item.quantity || 1
//       }))
//     });
//     setShowEditModal(true);
//   };

//   const handleViewClick = (product:any) => {
//     setSelectedProduct(product);
//     setShowViewModal(true);
//   };

//   const handleEditFormChange = (field:any, value:any) => {
//     setEditFormData((prev:any) => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleItemChange = (index:any, field:any, value:any) => {
//     const updatedItems = [...editFormData.items];
//     updatedItems[index] = {
//       ...updatedItems[index],
//       [field]: value
//     };
//     setEditFormData((prev:any) => ({
//       ...prev,
//       items: updatedItems
//     }));
//   };

//  const addItemToQuotation = (item: any) => {
//   // Check if item already exists in the current items list
//   const isItemAlreadyAdded = editFormData.items.some(
//     (existingItem: any) => existingItem._id === item._id
//   );

//   if (isItemAlreadyAdded) {
//     alert("This item is already added to the quotation. Please update the quantity instead.");
//     return;
//   }

//   const newItem = {
//     _id: item._id,
//     name: item.name,
//     description: item.description || "",
//     nrp: item.nrp,
//     mrp: item.mrp,
//     quantity: 1,
//     image: item.image || ""
//   };

//   setEditFormData((prev: any) => ({
//     ...prev,
//     items: [...prev.items, newItem]
//   }));
//   setShowItemSelector(false);
//   setItemSearchTerm("");
// };

//   const removeItem = (index:any) => {
//     setEditFormData((prev:any) => ({
//       ...prev,
//       items: prev.items.filter((_:any, i:any) => i !== index)
//     }));
//   };

//   const confirmEdit = async () => {
//     if (!selectedProduct || !editFormData) return;

//     setLoading(true);
//     try {
//       const transformedData = {
//         name: editFormData.name,
//         number: editFormData.number,
//         address: editFormData.address || "",
//         includeGst: Boolean(editFormData.includeGst),
//         date: editFormData.date,
//         value: editFormData.value,
//         dis: editFormData.dis.toString(),
//         userId: user?.id || '',
//         items: editFormData.items.map((item:any) => ({
//           _id: item._id,
//           quantity: item.quantity || 1
//         }))
//       };

//       console.log("📤 Sending update data:", transformedData);

//       const response = await fetch(API_ROUTES.UPDATE_PRODUCT(selectedProduct._id), {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(transformedData),
//       });
//       const data = await response.json();

//       if (response.ok && data.success) {
//         alert("✅ Quotation updated successfully");
//         fetchProducts();
//         setShowEditModal(false);
//         setSelectedProduct(null);
//         setEditFormData(null);
//       } else {
//         throw new Error(data.message || "Failed to update quotation");
//       }
//     } catch (err:any) {
//       console.error("❌ Error updating quotation:", err);
//       alert(`Failed to update: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownloadPDF = async (product:any) => {
//     const printWindow = window.open('', '_blank');
//     if (!printWindow) {
//       alert('Please allow popups to generate PDF');
//       return;
//     }

//     const discountPercent = parseFloat(product.dis) || 0;
//     const isNRP = product.value === 'nrp';
//     const includeGst = product.includeGst === true;

//     const toBase64 = async (url:any) => {
//       try {
//         const res = await fetch(url);
//         const blob = await res.blob();
//         return new Promise((resolve) => {
//           const reader = new FileReader();
//           reader.onloadend = () => resolve(reader.result);
//           reader.readAsDataURL(blob);
//         });
//       } catch {
//         return '';
//       }
//     };

//     const itemsWithImages = await Promise.all(
//       (product.items || []).map(async (item:any) => {
//         const rate = isNRP ? (item.nrp || 0) : (item.mrp || 0);
//         const qty = item.quantity || 1;
//         const amount = rate * qty;

//         let base64:any = '';
//         if (item.image) {
//           base64 = await toBase64(`${item.image}`);
//         }

//         return { ...item, rate, qty, amount, base64 };
//       })
//     );

//     const itemsTotal = itemsWithImages.reduce((sum, i) => sum + i.amount, 0);
//     const discountAmount = (itemsTotal * discountPercent) / 100;
//     const taxable = itemsTotal - discountAmount;

//     let gst = 0;
//     let grandTotal = taxable;

//     if (includeGst) {
//       gst = taxable * 0.18;
//       grandTotal = taxable + gst;
//     }

//     const html = `
// <!DOCTYPE html>
// <html>
// <head>
//   <meta charset="UTF-8">
//   <title>Quotation - ${product.name || 'Customer'}</title>
//   <style>
//     body {
//       font-family: Arial, sans-serif;
//       background: white;
//       color: black;
//       padding: 20px;
//       margin: 0;
//       font-size: 12px;
//       line-height: 1.4;
//     }
//     .container {
//       max-width: 210mm;
//       margin: 0 auto;
//       background: white;
//       border: 1px solid #000;
//       padding: 15px;
//     }
//     .header {
//       text-align: center;
//       padding: 20px;
//       background: white;
//       color: black;
//       border-bottom: 3px double black;
//       margin-bottom: 20px;
//     }
//     .company-name {
//       font-size: 36px;
//       font-weight: bold;
//       color: black;
//       margin-bottom: 8px;
//     }
//     .company-address {
//       font-size: 13px;
//       color: black;
//     }
//     .contact {
//       margin-top: 10px;
//       font-size: 13px;
//       color: black;
//     }

//     .info-section {
//       display: flex;
//       justify-content: space-between;
//       margin: 20px 0;
//       padding: 15px;
//       background: #f9f9f9;
//       border: 1px solid #ddd;
//     }
//     .info-left, .info-right { width: 48%; }
//     .info-row {
//       display: flex;
//       margin-bottom: 8px;
//       font-size: 12px;
//     }
//     .label {
//       font-weight: bold;
//       width: 130px;
//       color: black;
//     }
//     .value { color: black; }

//     table {
//       width: 100%;
//       border-collapse: collapse;
//       margin: 20px 0;
//       font-size: 11.5px;
//     }
//     th {
//       background: #f0f0f0;
//       color: black;
//       padding: 12px 8px;
//       border: 1px solid #000;
//       text-align: center;
//       font-weight: bold;
//     }
//     td {
//       padding: 10px 8px;
//       border: 1px solid #000;
//       text-align: center;
//       vertical-align: middle;
//       color: black;
//     }
//     tbody tr:nth-child(even) { background: #f9f9f9; }

//     .item-image {
//       width: 60px;
//       height: 60px;
//       object-fit: contain;
//       border: 1px solid #ccc;
//       border-radius: 4px;
//     }
//     .text-left { text-align: left; padding-left: 12px; }
//     .text-right { text-align: right; }

//     .totals {
//       float: right;
//       width: 380px;
//       border: 2px solid black;
//       margin-top: 30px;
//     }
//     .totals td {
//       padding: 10px 15px;
//       font-size: 13px;
//     }
//     .totals .label {
//       background: #f0f0f0;
//       font-weight: bold;
//       text-align: right;
//     }
//     .totals .value {
//       text-align: right;
//       font-weight: bold;
//     }
//     .grand-total {
//       background: #000;
//       color: white;
//       font-size: 16px;
//       font-weight: bold;
//     }

//     .footer {
//       margin-top: 100px;
//       text-align: center;
//       padding: 20px;
//       border-top: 2px solid black;
//       color: black;
//       font-size: 12px;
//     }

//     @media print {
//       body, .container { background: white !important; padding: 10px; }
//       @page { margin: 0.8cm; }
//       .totals { page-break-inside: avoid; }
//     }
//   </style>
// </head>
// <body onload="setTimeout(() => window.print(), 1000)">
//   <div class="container">
//     <div class="header">
//       <div class="company-name">QUANTILE</div>
//       <div class="company-address">
//         03, RAMESHWAR COMPLEX, KAPODARA - HIRABAUG, NEAR KAPODARA BRTS STAND,<br>
//         VARACHHA ROAD, SURAT, GUJARAT
//       </div>
//       <div class="contact">
//         <strong>Mo:</strong> 98255 32006
//       </div>
//     </div>

//     <div class="info-section">
//       <div class="info-left">
//         <div class="info-row"><span class="label">Party Name:</span><span class="value">${product.name || 'N/A'}</span></div>
//         <div class="info-row"><span class="label">Address:</span><span class="value">${product.address || 'SURAT'}</span></div>
//         <div class="info-row"><span class="label">Mobile:</span><span class="value">${product.number || 'N/A'}</span></div>
//       </div>
//       <div class="info-right">
//         <div class="info-row"><span class="label">Quotation No:</span><span class="value">${product._id?.slice(-6).toUpperCase() || 'N/A'}</span></div>
//         <div class="info-row"><span class="label">Date:</span><span class="value">${new Date(product.date).toLocaleDateString("en-GB")}</span></div>
//         <div class="info-row"><span class="label">Price Type:</span><span class="value">${(product.value || '').toUpperCase()} | Discount: ${discountPercent}%</span></div>
//         ${includeGst ? '<div class="info-row"><span class="label">GST:</span><span class="value" style="color: green; font-weight: bold;">INCLUDED (18%)</span></div>' : '<div class="info-row"><span class="label">GST:</span><span class="value" style="color: red; font-weight: bold;">NOT INCLUDED</span></div>'}
//       </div>
//     </div>

//     <table>
//       <thead>
//         <tr>
//           <th>S.No</th>
//           <th>Image</th>
//           <th>Code</th>
//           <th>Description</th>
//           <th>HSN</th>
//           <th>Qty</th>
//           <th>Rate</th>
//           <th>Amount</th>
//         </tr>
//       </thead>
//       <tbody>
//         ${itemsWithImages.map((item, i) => `
//           <tr>
//             <td>${i + 1}</td>
//             <td>${item.base64 ? `<img src="${item.base64}" class="item-image">` : '−'}</td>
//             <td>${item._id?.slice(-8).toUpperCase() || ''}</td>
//             <td class="text-left">
//               <strong>${item.name || 'N/A'}</strong><br>
//               <small>${item.description || ''}</small>
//             </td>
//             <td>84818020</td>
//             <td>${item.qty}</td>
//             <td class="text-right">₹${item.rate.toFixed(2)}</td>
//             <td class="text-right">₹${item.amount.toFixed(2)}</td>
//           </tr>
//         `).join('')}
//       </tbody>
//     </table>

//     <table class="totals">
//       <tr><td class="label">Subtotal</td><td class="value">₹${itemsTotal.toFixed(2)}</td></tr>
//       <tr><td class="label">Discount (${discountPercent}%)</td><td class="value">-₹${discountAmount.toFixed(2)}</td></tr>
//       <tr><td class="label">Taxable Amount</td><td class="value">₹${taxable.toFixed(2)}</td></tr>
//       ${includeGst ? `
//         <tr><td class="label">GST (18%)</td><td class="value">₹${gst.toFixed(2)}</td></tr>
//       ` : ''}
//       <tr class="grand-total">
//         <td class="label">GRAND TOTAL</td>
//         <td class="value">₹${grandTotal.toFixed(2)}</td>
//       </tr>
//     </table>

//     <div style="clear:both;"></div>

//     <div class="footer">
//       <strong>Thank You for Your Business!</strong><br><br>
//       ${includeGst ? 'Prices inclusive of GST | ' : ''}Validity 15 days | Payment 100% advance
//     </div>
//   </div>
// </body>
// </html>`;

//     printWindow.document.open();
//     printWindow.document.write(html);
//     printWindow.document.close();
//   };

//   const filteredAvailableItems = availableItems.filter((item:any) => 
//     item.name.toLowerCase().includes(itemSearchTerm.toLowerCase()) ||
//     (item.description && item.description.toLowerCase().includes(itemSearchTerm.toLowerCase()))
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
//             <AlertCircle size={20} />
//             <span>Error: {error}</span>
//           </div>
//         )}

//         <div className="bg-white rounded-xl shadow-sm p-6">
//           <div className="flex flex-wrap gap-4 items-center justify-between">
//             <div className="flex-1 min-w-[250px]">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//                 <input
//                   type="text"
//                   placeholder="Search by name, phone, or ID..."
//                   value={searchTerm}
//                   onChange={handleSearch}
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                 />
//               </div>
//             </div>

//             <button
//               onClick={() => setShowSearch(!showSearch)}
//               className="flex items-center gap-2 bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-900 transition"
//             >
//               <Filter size={18} />
//               Date Filter
//             </button>

//             {(searchTerm || (fromDate && toDate)) && (
//               <button
//                 onClick={clearFilters}
//                 className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
//               >
//                 <X size={18} />
//                 Clear
//               </button>
//             )}

//             <button
//               onClick={() => window.location.href = '/quotation'}
//               className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-medium shadow-sm"
//             >
//               + New Quotation
//             </button>
//           </div>

//           {showSearch && (
//             <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
//               <div className="flex flex-wrap gap-4 items-end">
//                 <div className="flex-1 min-w-[200px]">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
//                   <input
//                     type="date"
//                     value={fromDate}
//                     onChange={(e) => setFromDate(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
//                   />
//                 </div>
//                 <div className="flex-1 min-w-[200px]">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
//                   <input
//                     type="date"
//                     value={toDate}
//                     onChange={(e) => setToDate(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
//                   />
//                 </div>
//                 <button
//                   onClick={applyCustomDateFilter}
//                   className="bg-red-800 text-white px-6 py-2 rounded-lg hover:bg-red-900 transition"
//                 >
//                   Apply
//                 </button>
//               </div>
//             </div>
//           )}

//           <div className="mt-3 text-sm text-gray-600">
//             Showing {filteredProducts.length} quotations
//             {fromDate && toDate && (
//               <span>
//                 {" "}from <strong>{new Date(fromDate).toLocaleDateString("en-IN")}</strong> to{" "}
//                 <strong>{new Date(toDate).toLocaleDateString("en-IN")}</strong>
//               </span>
//             )}
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//           {loading ? (
//             <div className="text-center py-20">
//               <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-800 border-t-transparent"></div>
//               <p className="mt-4 text-gray-600">Loading quotations...</p>
//             </div>
//           ) : filteredProducts.length === 0 ? (
//             <div className="text-center py-20">
//               <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
//               <p className="text-gray-600 text-lg">No quotations found</p>
//               <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or create a new quotation</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50 border-b border-gray-200">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Phone</th>
//                     <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Discount</th>
//                     <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Type</th>
//                     <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">GST</th>
//                     <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Items</th>
//                     <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Amount</th>
//                     <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {filteredProducts.map((product:any) => (
//                     <tr key={product._id} className="hover:bg-gray-50 transition">
//                       <td className="px-4 py-3 text-sm text-gray-700">
//                         {new Date(product.date).toLocaleDateString("en-IN")}
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="font-medium text-gray-900">{product.name}</div>
//                         <div className="text-xs text-gray-500">ID: {product._id.slice(-6).toUpperCase()}</div>
//                       </td>
//                       <td className="px-4 py-3 text-sm text-gray-700">{product.number}</td>
//                       <td className="px-4 py-3 text-center">
//                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                           {product.dis || 0}%
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 text-center">
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase ${
//                           product.value === "mrp" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"
//                         }`}>
//                           {product.value}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 text-center">
//                         {product.includeGst === true ? (
//                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                             ✓ 18%
//                           </span>
//                         ) : (
//                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
//                             ✗ No
//                           </span>
//                         )}
//                       </td>
//                       <td className="px-4 py-3 text-center text-sm text-gray-700">{product.items?.length || 0}</td>
//                       <td className="px-4 py-3 text-right font-semibold text-gray-900">
//                         ₹{calculateProductTotal(product).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="flex justify-center gap-2">
//                           <button
//                             onClick={() => handleEditClick(product)}
//                             className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
//                             title="Edit"
//                           >
//                             <Edit size={16} />
//                           </button>
//                           <button
//                             onClick={() => handleDownloadPDF(product)}
//                             className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
//                             title="Download PDF"
//                           >
//                             <Printer size={16} />
//                           </button>
//                           <button
//                             onClick={() => handleViewClick(product)}
//                             className="p-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
//                             title="View"
//                           >
//                             <Eye size={16} />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteClick(product)}
//                             className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
//                             title="Delete"
//                           >
//                             <Trash2 size={16} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* Modals remain the same but with includeGst handling... */}
//         {/* For brevity, I'll include the key parts of the edit modal */}

//         {showEditModal && selectedProduct && editFormData && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
//             <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full p-6 my-8">
//               <div className="flex items-center justify-between mb-6">
//                 <div className="flex items-center gap-3">
//                   <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
//                     <Edit className="text-red-600" size={24} />
//                   </div>
//                   <h3 className="text-2xl font-bold text-gray-900">Edit Quotation</h3>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setShowEditModal(false);
//                     setSelectedProduct(null);
//                     setEditFormData(null);
//                   }}
//                   className="p-2 hover:bg-gray-100 rounded-lg transition"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>

//               <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Customer Name <span className="text-red-600">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       value={editFormData.name}
//                       onChange={(e) => handleEditFormChange('name', e.target.value)}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Phone Number <span className="text-red-600">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       value={editFormData.number}
//                       onChange={(e) => handleEditFormChange('number', e.target.value)}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
//                     />
//                   </div>
//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Address <span className="text-red-600">*</span>
//                     </label>
//                     <textarea
//                       value={editFormData.address}
//                       onChange={(e) => handleEditFormChange('address', e.target.value)}
//                       rows={3}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 resize-none"
//                       placeholder="Enter customer address"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Date <span className="text-red-600">*</span>
//                     </label>
//                     <input
//                       type="date"
//                       value={editFormData.date}
//                       onChange={(e) => handleEditFormChange('date', e.target.value)}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Price Type <span className="text-red-600">*</span>
//                     </label>
//                     <select
//                       value={editFormData.value}
//                       onChange={(e) => handleEditFormChange('value', e.target.value)}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
//                     >
//                       <option value="mrp">MRP</option>
//                       <option value="nrp">NRP</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Discount (%)
//                     </label>
//                     <input
//                       type="number"
//                       value={editFormData.dis}
//                       onChange={(e) => handleEditFormChange('dis', parseFloat(e.target.value) || 0)}
//                       min="0"
//                       max="100"
//                       step="0.1"
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
//                     />
//                   </div>
//                   <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
//                     <input
//                       type="checkbox"
//                       id="includeGst"
//                       checked={editFormData.includeGst === true}
//                       onChange={(e) => handleEditFormChange('includeGst', e.target.checked)}
//                       className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
//                     />
//                     <label htmlFor="includeGst" className="text-sm font-semibold text-gray-700 cursor-pointer">
//                       Include GST in Quotation
//                     </label>
//                     {editFormData.includeGst && (
//                       <span className="ml-auto bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
//                         GST will be added (18%)
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 {/* Items section - keeping existing code */}
//                 <div className="border-t pt-6">
//                   <div className="flex items-center justify-between mb-4">
//                     <h4 className="text-lg font-bold text-gray-900">Items</h4>
//                     <button
//                       onClick={() => setShowItemSelector(true)}
//                       className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
//                     >
//                       <Plus size={18} />
//                       Add Item
//                     </button>
//                   </div>

//                   {editFormData.items.length === 0 ? (
//                     <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
//                       <ShoppingCart className="mx-auto text-gray-400 mb-2" size={32} />
//                       <p className="text-gray-500">No items added yet</p>
//                     </div>
//                   ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       {editFormData.items.map((item:any, index:any) => {
//                         const rate = editFormData.value === 'nrp' ? (item.nrp || 0) : (item.mrp || 0);
//                         const itemTotal = (item.quantity || 1) * rate;

//                         return (
//                           <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-red-500 transition">
//                             <div className="flex gap-4">
//                               {item.image && (
//                                 <img
//                                   src={item.image}
//                                   alt={item.name}
//                                   className="w-24 h-24 object-cover rounded-lg flex-shrink-0 border border-gray-200"
//                                 />
//                               )}
//                               <div className="flex-1">
//                                 <div className="flex justify-between items-start mb-3">
//                                   <div>
//                                     <h4 className="font-bold text-gray-900 text-lg">{item.name}</h4>
//                                     <p className="text-sm w-[17.9rem] truncate text-gray-600">{item.description}</p>
//                                     <p className="text-sm text-green-600 font-semibold mt-1">
//                                       Rate: ₹{rate.toLocaleString("en-IN")}
//                                     </p>
//                                   </div>
//                                   <button
//                                     onClick={() => removeItem(index)}
//                                     className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
//                                     title="Remove Item"
//                                   >
//                                     <Trash2 size={16} />
//                                   </button>
//                                 </div>

//                                 <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
//                                   <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-gray-300">
//                                     <button
//                                       onClick={() => {
//                                         const newQty = Math.max(1, (item.quantity || 1) - 1);
//                                         handleItemChange(index, 'quantity', newQty);
//                                       }}
//                                       className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded hover:bg-red-100 hover:text-red-600 transition"
//                                     >
//                                       <Minus size={16} />
//                                     </button>
//                                     <input
//                                       type="number"
//                                       value={item.quantity || 1}
//                                       onChange={(e) => {
//                                         const val = parseInt(e.target.value) || 1;
//                                         handleItemChange(index, 'quantity', Math.max(1, val));
//                                       }}
//                                       min="1"
//                                       className="w-16 text-center font-bold border-0 bg-transparent focus:ring-0 text-gray-900"
//                                     />
//                                     <button
//                                       onClick={() => {
//                                         const newQty = (item.quantity || 1) + 1;
//                                         handleItemChange(index, 'quantity', newQty);
//                                       }}
//                                       className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded hover:bg-green-100 hover:text-green-600 transition"
//                                     >
//                                       <Plus size={16} />
//                                     </button>
//                                   </div>
//                                   <span className="text-sm text-gray-600 ml-auto bg-green-50 px-3 py-1 rounded-lg border border-green-200">
//                                     Total: <span className="font-bold text-green-700">
//                                       ₹{itemTotal.toLocaleString("en-IN")}
//                                     </span>
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="flex gap-3 mt-6 pt-6 border-t">
//                 <button
//                   onClick={confirmEdit}
//                   disabled={loading}
//                   className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50"
//                 >
//                   <Save size={20} />
//                   {loading ? "Saving..." : "Save Changes"}
//                 </button>
//                 <button
//                   onClick={() => {
//                     setShowEditModal(false);
//                     setSelectedProduct(null);
//                     setEditFormData(null);
//                   }}
//                   disabled={loading}
//                   className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-semibold disabled:opacity-50"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Delete Modal */}
//         {showDeleteModal && selectedProduct && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
//                   <AlertCircle className="text-red-600" size={24} />
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900">Confirm Delete</h3>
//               </div>
//               <p className="text-gray-600 mb-2">Are you sure you want to delete this quotation?</p>
//               <p className="text-sm text-gray-500 mb-6">
//                 Customer: <strong>{selectedProduct.name}</strong><br />
//                 This action cannot be undone.
//               </p>
//               <div className="flex gap-3">
//                 <button
//                   onClick={confirmDelete}
//                   disabled={loading}
//                   className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50"
//                 >
//                   {loading ? "Deleting..." : "Delete"}
//                 </button>
//                 <button
//                   onClick={() => {
//                     setShowDeleteModal(false);
//                     setSelectedProduct(null);
//                   }}
//                   disabled={loading}
//                   className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-medium disabled:opacity-50"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Item Selector Modal */}
//         {showItemSelector && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
//             <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
//               <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-green-600 to-green-700 text-white">
//                 <h3 className="text-xl font-bold">Select Item to Add</h3>
//                 <button
//                   onClick={() => {
//                     setShowItemSelector(false);
//                     setItemSearchTerm("");
//                   }}
//                   className="p-2 hover:bg-white/20 rounded-lg transition"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>

//               <div className="p-4 border-b bg-gray-50">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//                   <input
//                     type="text"
//                     placeholder="Search items by name or description..."
//                     value={itemSearchTerm}
//                     onChange={(e) => setItemSearchTerm(e.target.value)}
//                     className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     autoFocus
//                   />
//                 </div>
//               </div>

//               <div className="p-6 overflow-y-auto max-h-[calc(80vh-180px)]">
//                 {filteredAvailableItems.length === 0 ? (
//                   <div className="text-center py-12">
//                     <AlertCircle className="mx-auto text-gray-400 mb-3" size={48} />
//                     <p className="text-gray-600 text-lg">
//                       {availableItems.length === 0 ? "No items available" : "No items match your search"}
//                     </p>
//                     <p className="text-gray-500 text-sm mt-2">Try a different search term</p>
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {filteredAvailableItems.map((item:any) => (
//                       <div
//                         key={item._id}
//                         className="border border-gray-200 rounded-lg p-4 hover:border-green-500 hover:shadow-lg transition cursor-pointer group"
//                         onClick={() => addItemToQuotation(item)}
//                       >
//                         {item.image && (
//                           <div className="relative overflow-hidden rounded-lg mb-3">
//                             <img
//                               src={item.image}
//                               alt={item.name}
//                               className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
//                             />
//                           </div>
//                         )}
//                         <h4 className="font-bold text-gray-900 mb-1 group-hover:text-green-600 transition">{item.name}</h4>
//                         <p className="text-xs text-gray-500 mb-2 line-clamp-2">{item.description}</p>

//                         <div className="mt-2 text-center">
//                           <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium group-hover:text-green-700">
//                             <Plus size={14} /> Click to add
//                           </span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//            {/* View Modal - Right Side Panel */}
//         {showViewModal && selectedProduct && (
//           <div className="fixed inset-0 bg-black/60 z-50 flex items-center !m-0 justify-center p-4" onClick={() => setShowViewModal(false)}>
//       <div 
//         className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Compact Header */}
//         <div className="sticky top-0 bg-red-600 text-white px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
//           <div className="flex items-center gap-3">

//             <Eye size={24} />
//             <div>
//               <h2 className="text-xl font-bold">Quotation Details</h2>
//               <p className="text-red-100 text-xs">#{selectedProduct._id.slice(-8).toUpperCase()}</p>
//             </div>
//           </div>
//           <button
//             onClick={() => setShowViewModal(false)}
//             className="p-2 hover:bg-white/20 rounded-lg transition"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="p-6 space-y-5">
//           {/* Customer Info - Compact Grid */}
//           <div className="grid grid-cols-2 gap-3">
//             <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
//               <div className="flex items-center gap-2">
//                 <User className="text-red-600" size={16} />
//                 <div className="min-w-0 flex-1">
//                   <p className="text-xs text-gray-500">Customer</p>
//                   <p className="font-semibold text-gray-900 truncate">{selectedProduct.name}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
//               <div className="flex items-center gap-2">
//                 <Phone className="text-green-600" size={16} />
//                 <div className="min-w-0 flex-1">
//                   <p className="text-xs text-gray-500">Phone</p>
//                   <p className="font-semibold text-gray-900 truncate">{selectedProduct.number}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
//               <div className="flex items-center gap-2">
//                 <Calendar className="text-blue-600" size={16} />
//                 <div className="min-w-0 flex-1">
//                   <p className="text-xs text-gray-500">Date</p>
//                   <p className="font-semibold text-gray-900 text-sm">
//                     {new Date(selectedProduct.date).toLocaleDateString("en-IN", {
//                       day: '2-digit',
//                       month: 'short',
//                       year: 'numeric'
//                     })}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
//               <div className="flex items-center gap-2">
//                 <DollarSign className="text-purple-600" size={16} />
//                 <div className="min-w-0 flex-1">
//                   <p className="text-xs text-gray-500">Price Type</p>
//                   <p className="font-semibold text-gray-900 uppercase">{selectedProduct.value}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Discount & Total - Compact */}
//           <div className="grid grid-cols-2 gap-3">
//             <div className="bg-red-50 rounded-lg p-4 border border-red-200">
//               <p className="text-xs text-red-600 mb-1">Discount</p>
//               <p className="text-2xl font-bold text-red-600">{selectedProduct.dis || 0}%</p>
//             </div>
//             <div className="bg-green-50 rounded-lg p-4 border border-green-200">
//               <p className="text-xs text-green-600 mb-1">Total Amount</p>
//               <p className="text-2xl font-bold text-green-600">
//                 ₹{(selectedProduct.totalAmount || 0).toLocaleString("en-IN")}
//               </p>
//             </div>
//           </div>

//           {/* Items - Simplified */}
//           <div className="border border-gray-200 rounded-lg overflow-hidden">
//             <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
//               <h3 className="font-bold text-gray-900 flex items-center gap-2">
//                 <Package className="text-red-600" size={18} />
//                 Items ({selectedProduct.items?.length || 0})
//               </h3>
//             </div>

//             {selectedProduct.items && selectedProduct.items.length > 0 ? (
//               <div className="divide-y divide-gray-200">
//                 {selectedProduct.items.map((item:any, index:any) => {
//                   const rate = selectedProduct.value === 'nrp' ? (item.nrp || 0) : (item.mrp || 0);
//                   const quantity = item.quantity || 1;
//                   const itemTotal = rate * quantity;

//                   return (
//                     <div key={index} className="p-4 hover:bg-gray-50 transition">
//                       <div className="flex gap-3">
//                         {item.image && (
//                           <img
//                             src={item.image}
//                             alt={item.name}
//                             className="w-16 h-16 object-cover rounded border border-gray-200"
//                           />
//                         )}

//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-start justify-between mb-2">
//                             <div className="min-w-0 flex-1">
//                               <h4 className="font-semibold text-gray-900">{item.name}</h4>
//                               {item.description && (
//                                 <p className="text-xs text-gray-500 mt-1">{item.description}</p>
//                               )}
//                             </div>
//                             <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-semibold ml-2">
//                               #{index + 1}
//                             </span>
//                           </div>

//                           <div className="flex gap-2 text-sm">
//                             <div className="bg-blue-50 rounded px-3 py-1.5 border border-blue-200">
//                               <span className="text-blue-600 font-medium">Qty: {quantity}</span>
//                             </div>
//                             <div className="bg-purple-50 rounded px-3 py-1.5 border border-purple-200">
//                               <span className="text-purple-600 font-medium">₹{rate.toLocaleString("en-IN")}</span>
//                             </div>
//                             <div className="bg-green-50 rounded px-3 py-1.5 border border-green-200">
//                               <span className="text-green-600 font-semibold">₹{itemTotal.toLocaleString("en-IN")}</span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             ) : (
//               <div className="p-8 text-center">
//                 <ShoppingCart className="mx-auto text-gray-300 mb-2" size={40} />
//                 <p className="text-gray-500 text-sm">No items in this quotation</p>
//               </div>
//             )}
//           </div>

//           {/* Summary - Compact */}
//           <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-2">
//             <div className="flex justify-between text-sm">
//               <span className="text-gray-600">Total Items</span>
//               <span className="font-semibold text-gray-900">{selectedProduct.totalQuantity || 0}</span>
//             </div>
//             <div className="flex justify-between text-sm">
//               <span className="text-gray-600">Subtotal</span>
//               <span className="font-semibold text-gray-900">
//                 ₹{((selectedProduct.totalAmount || 0) / 1.18).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
//               </span>
//             </div>
//             <div className="flex justify-between text-sm">
//               <span className="text-gray-600">GST (18%)</span>
//               <span className="font-semibold text-green-600">
//                 ₹{((selectedProduct.totalAmount || 0) - (selectedProduct.totalAmount || 0) / 1.18).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
//               </span>
//             </div>
//             <div className="pt-2 border-t border-gray-300 flex justify-between">
//               <span className="font-bold text-gray-900">Grand Total</span>
//               <span className="font-bold text-xl text-red-600">
//                 ₹{(selectedProduct.totalAmount || 0).toLocaleString("en-IN")}
//               </span>
//             </div>
//           </div>

//           {/* Action Buttons - Compact */}
//           <div className="flex gap-3">
//             <button
//               className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold"
//             >
//               <Edit size={18} />
//               Edit
//             </button>
//             <button
//              onClick={() => handleDownloadPDF(selectedProduct)}
//               className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold"
//             >
//               <Printer size={18} />
//               Print
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//         )}

//         {/* Delete Modal */}
//         {showDeleteModal && selectedProduct && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
//                   <AlertCircle className="text-red-600" size={24} />
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900">Confirm Delete</h3>
//               </div>
//               <p className="text-gray-600 mb-2">Are you sure you want to delete this quotation?</p>
//               <p className="text-sm text-gray-500 mb-6">
//                 Customer: <strong>{selectedProduct.name}</strong><br />
//                 This action cannot be undone.
//               </p>
//               <div className="flex gap-3">
//                 <button
//                   onClick={confirmDelete}
//                   disabled={loading}
//                   className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50"
//                 >
//                   {loading ? "Deleting..." : "Delete"}
//                 </button>
//                 <button
//                   onClick={() => {
//                     setShowDeleteModal(false);
//                     setSelectedProduct(null);
//                   }}
//                   disabled={loading}
//                   className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-medium disabled:opacity-50"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default DashboardPage;



import React, { useState, useEffect } from "react";
import {
  Search,
  Trash2,
  Eye,
  Edit,
  Printer,
  Filter,
  AlertCircle,
  ShoppingCart,
  X,
  Save,
  Plus,
  Minus,
  Calendar,
  Phone,
  User,
  Package,
  DollarSign,
  Download,
  MapPin,
  CheckCircle2,
  Percent,
  CreditCard
} from "lucide-react";
import html2pdf from "html2pdf.js";

// Get user from localStorage or use null
const getUserFromStorage = () => {
  try {
    const userString = window.localStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
  } catch {
    return null;
  }
};

// Helper function to calculate product total
// const calculateProductTotal = (product:any) => {
//   const discountPercent = parseFloat(product.dis) || 0;
//   const isNRP = product.value === 'nrp';
//   const itemsTotal = (product.items || []).reduce((sum:any, item:any) => {
//     const price = isNRP ? (item.nrp || 0) : (item.mrp || 0);
//     const quantity = item.quantity || 1;
//     return sum + (quantity * price);
//   }, 0);
//   const discountAmount = (itemsTotal * discountPercent) / 100;
//   const subtotalAfterDiscount = itemsTotal - discountAmount;

//   if (product.includeGst === true) {
//     const gstAmount = subtotalAfterDiscount * 0.18;
//     return subtotalAfterDiscount + gstAmount;
//   }

//   return subtotalAfterDiscount;
// };

// Helper function to calculate product total
const calculateProductTotal = (product: any) => {
  const discountPercent = parseFloat(product.dis) || 0;
  const isNRP = product.value === 'nrp';
  const isMRP = product.value === 'mrp';

  const itemsTotal = (product.items || []).reduce((sum: any, item: any) => {
    const price = isNRP ? (item.nrp || 0) : (item.mrp || 0);
    const quantity = item.quantity || 1;
    return sum + (quantity * price);
  }, 0);

  const discountAmount = (itemsTotal * discountPercent) / 100;
  const subtotalAfterDiscount = itemsTotal - discountAmount;

  if (product.includeGst === true) {
    const gstAmount = subtotalAfterDiscount * 0.18;
    return subtotalAfterDiscount + gstAmount;
  }

  return subtotalAfterDiscount;
};

function Dashboard() {
  const user = getUserFromStorage();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL ? `${process.env.REACT_APP_API_BASE_URL}/api` : '/api';

  const API_ROUTES = {
    GET_ALL_PRODUCTS: `${API_BASE_URL}/products?userId=${user?.id || ''}`,
    GET_PRODUCT: (id: any) => `${API_BASE_URL}/products/${id}?userId=${user?.id || ''}`,
    DELETE_PRODUCT: (id: any) => `${API_BASE_URL}/products/delete/${id}?userId=${user?.id || ''}`,
    UPDATE_PRODUCT: (id: any) => `${API_BASE_URL}/products/edit/${id}`,
    CREATE_PRODUCT: `${API_BASE_URL}/products/add`,
    GET_ALL_ITEMS: `${API_BASE_URL}/items?userId=${user?.id || ''}`,
  };

  const [allProducts, setAllProducts] = useState<any>([]);
  const [filteredProducts, setFilteredProducts] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState<any>("");
  const [fromDate, setFromDate] = useState<any>("");
  const [toDate, setToDate] = useState<any>("");
  const [showSearch, setShowSearch] = useState<any>(false);
  const [loading, setLoading] = useState<any>(true);
  const [error, setError] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<any>(false);
  const [showEditModal, setShowEditModal] = useState<any>(false);
  const [showCreateModal, setShowCreateModal] = useState<any>(false);
  const [showViewModal, setShowViewModal] = useState<any>(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>(null);
  const [createFormData, setCreateFormData] = useState<any>({
    name: "",
    number: "",
    address: "",
    date: new Date().toISOString().split('T')[0],
    value: "mrp",
    dis: 0,
    includeGst: false,
    items: []
  });
  const [availableItems, setAvailableItems] = useState<any>([]);
  const [showItemSelector, setShowItemSelector] = useState<any>(false);
  const [itemSearchTerm, setItemSearchTerm] = useState<any>("");
  const [isCreateMode, setIsCreateMode] = useState<any>(false);

  useEffect(() => {
    fetchProducts();
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch(API_ROUTES.GET_ALL_ITEMS);
      if (!response.ok) throw new Error("Failed to fetch items");
      const data = await response.json();
      setAvailableItems(data?.items || []);
    } catch (err) {
      console.error("Error fetching items:", err);
      setAvailableItems([]);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(`📡 Fetching quotations from: ${API_ROUTES.GET_ALL_PRODUCTS}`);
      const response = await fetch(API_ROUTES.GET_ALL_PRODUCTS);
      const data = await response.json();

      if (response.ok && data.success) {
        console.log(`✅ Received ${data.products?.length || 0} quotations`);
        setAllProducts(data.products || []);
        filterByLast30Days(data.products || []);
      } else {
        throw new Error(data.message || "Failed to fetch quotations");
      }
    } catch (err: any) {
      console.error("❌ Error fetching products:", err);
      setError(err.message);
      setAllProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filterByLast30Days = (products: any) => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    console.log(`🔍 Filtering ${products.length} products for last 30 days...`);

    const filtered = products.filter((p: any) => {
      if (!p.date) return false;
      const productDate = new Date(p.date);
      return productDate >= thirtyDaysAgo && productDate <= today;
    });

    console.log(`📊 Filtered down to ${filtered.length} products`);

    // If we have products overall but none in last 30 days, 
    // maybe we should show all for now or alert the user
    if (products.length > 0 && filtered.length === 0) {
      console.warn("⚠️ No products found in last 30 days, but total products exist:", products.length);
    }

    setFilteredProducts(filtered);
    setFromDate(thirtyDaysAgo.toISOString().split("T")[0]);
    setToDate(today.toISOString().split("T")[0]);
  };

  const handleSearch = (e: any) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (!term) {
      applyCurrentDateFilter();
      return;
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999);

    const filtered = allProducts.filter((p: any) => {
      const productDate = new Date(p.date);
      const inDateRange = productDate >= from && productDate <= to;
      const matchesSearch =
        p.name.toLowerCase().includes(term) ||
        p.number.includes(term) ||
        p._id.toLowerCase().includes(term);

      return inDateRange && matchesSearch;
    });

    setFilteredProducts(filtered);
  };

  const applyCustomDateFilter = () => {
    if (!fromDate || !toDate) {
      alert("Please select both dates");
      return;
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999);

    if (from > to) {
      alert("From date cannot be after To date");
      return;
    }

    const filtered = allProducts.filter((p: any) => {
      const productDate = new Date(p.date);
      return productDate >= from && productDate <= to;
    });

    setFilteredProducts(filtered);
    setShowSearch(false);
    setSearchTerm("");
  };

  const applyCurrentDateFilter = () => {
    if (!fromDate || !toDate) return;

    const from = new Date(fromDate);
    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999);

    const filtered = allProducts.filter((p: any) => {
      const productDate = new Date(p.date);
      return productDate >= from && productDate <= to;
    });

    setFilteredProducts(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    filterByLast30Days(allProducts);
  };

  const handleDeleteClick = (product: any) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;

    setLoading(true);
    try {
      const response = await fetch(API_ROUTES.DELETE_PRODUCT(selectedProduct._id), {
        method: "DELETE",
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setAllProducts((prev: any) => prev.filter((p: any) => p._id !== selectedProduct._id));
        setFilteredProducts((prev: any) => prev.filter((p: any) => p._id !== selectedProduct._id));
        alert("✅ Quotation deleted successfully");
      } else {
        throw new Error(data.message || "Failed to delete quotation");
      }
    } catch (err: any) {
      console.error("❌ Error deleting quotation:", err);
      alert(`Failed to delete: ${err.message}`);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setSelectedProduct(null);
    }
  };

  // const handleEditClick = (product:any) => {
  //   setSelectedProduct(product);
  //   setEditFormData({
  //     name: product.name,
  //     number: product.number,
  //     address: product.address || "",
  //     includeGst: product.includeGst === true,
  //     date: product.date.split('T')[0],
  //     value: product.value,
  //     dis: product.dis || 0,
  //     items: product.items.map((item:any) => ({
  //       _id: item._id,
  //       name: item.name,
  //       description: item.description,
  //       nrp: item.nrp,
  //       mrp: item.mrp,
  //       image: item.image,
  //       quantity: item.quantity || 1
  //     }))
  //   });
  //   setShowEditModal(true);
  // };

  const handleEditClick = (product: any) => {
    setSelectedProduct(product);
    setEditFormData({
      name: product.name,
      number: product.number,
      address: product.address || "",
      includeGst: product.includeGst === true,
      date: product.date.split('T')[0],
      value: product.value,
      dis: product.dis || 0,
      items: product.items.map((item: any) => ({
        _id: item._id,
        name: item.name,
        description: item.description,
        nrp: item.nrp,
        mrp: item.mrp,
        image: item.image,
        quantity: item.quantity || 1,
        manualPrice: item.manualPrice || 0  // 🔥 NEW: Include manual price
      }))
    });
    setShowEditModal(true);
  };

  const handleViewClick = (product: any) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const handleCreateClick = () => {
    setCreateFormData({
      name: "",
      number: "",
      address: "",
      date: new Date().toISOString().split('T')[0],
      value: "mrp",
      dis: 0,
      includeGst: false,
      items: []
    });
    setShowCreateModal(true);
  };

  const handleEditFormChange = (field: any, value: any) => {
    setEditFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateFormChange = (field: any, value: any) => {
    setCreateFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemChange = (index: number, field: string, value: any, isEdit = true) => {
    const formData = isEdit ? editFormData : createFormData;
    const setFormData = isEdit ? setEditFormData : setCreateFormData;

    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    setFormData((prev: any) => ({
      ...prev,
      items: updatedItems
    }));
  };

  const addItemToQuotation = (item: any, isEdit = true) => {
    const formData = isEdit ? editFormData : createFormData;
    const setFormData = isEdit ? setEditFormData : setCreateFormData;

    const isItemAlreadyAdded = formData.items.some(
      (existingItem: any) => existingItem._id === item._id
    );

    if (isItemAlreadyAdded) {
      alert("This item is already added to the quotation. Please update the quantity instead.");
      return;
    }

    const newItem = {
      _id: item._id,
      name: item.name,
      description: item.description || "",
      nrp: item.nrp,
      mrp: item.mrp,
      quantity: 1,
      image: item.image || "",
      manualPrice: 0  // 🔥 NEW: Initialize manual price
    };

    setFormData((prev: any) => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
    setShowItemSelector(false);
    setItemSearchTerm("");
  };

  // const addItemToQuotation = (item:any, isEdit = true) => {
  //   const formData = isEdit ? editFormData : createFormData;
  //   const setFormData = isEdit ? setEditFormData : setCreateFormData;

  //   const isItemAlreadyAdded = formData.items.some(
  //     (existingItem:any) => existingItem._id === item._id
  //   );

  //   if (isItemAlreadyAdded) {
  //     alert("This item is already added to the quotation. Please update the quantity instead.");
  //     return;
  //   }

  //   const newItem = {
  //     _id: item._id,
  //     name: item.name,
  //     description: item.description || "",
  //     nrp: item.nrp,
  //     mrp: item.mrp,
  //     quantity: 1,
  //     image: item.image || ""
  //   };

  //   setFormData((prev:any) => ({
  //     ...prev,
  //     items: [...prev.items, newItem]
  //   }));
  //   setShowItemSelector(false);
  //   setItemSearchTerm("");
  // };

  const removeItem = (index: any, isEdit = true) => {
    const setFormData = isEdit ? setEditFormData : setCreateFormData;
    setFormData((prev: any) => ({
      ...prev,
      items: prev.items.filter((_: any, i: any) => i !== index)
    }));
  };

  const confirmEdit = async () => {
    if (!selectedProduct || !editFormData) return;

    if (!editFormData.name || !editFormData.number) {
      alert("Please fill in customer name and phone number");
      return;
    }

    if (editFormData.items.length === 0) {
      alert("Please add at least one item");
      return;
    }

    setLoading(true);
    try {
      const transformedData = {
        name: editFormData.name,
        number: editFormData.number,
        address: editFormData.address || "",
        includeGst: Boolean(editFormData.includeGst),
        date: editFormData.date,
        value: editFormData.value,
        dis: editFormData.dis.toString(),
        userId: user?.id || '',
        items: editFormData.items.map((item: any) => ({
          _id: item._id,
          quantity: item.quantity || 1,
          manualPrice: item.manualPrice || 0  // 🔥 NEW: Include manual price
        }))
      };

      const response = await fetch(API_ROUTES.UPDATE_PRODUCT(selectedProduct._id), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transformedData),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        alert("✅ Quotation updated successfully");
        fetchProducts();
        setShowEditModal(false);
        setSelectedProduct(null);
        setEditFormData(null);
      } else {
        throw new Error(data.message || "Failed to update quotation");
      }
    } catch (err: any) {
      console.error("❌ Error updating quotation:", err);
      alert(`Failed to update: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // const confirmEdit = async () => {
  //   if (!selectedProduct || !editFormData) return;

  //   if (!editFormData.name || !editFormData.number) {
  //     alert("Please fill in customer name and phone number");
  //     return;
  //   }

  //   if (editFormData.items.length === 0) {
  //     alert("Please add at least one item");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const transformedData = {
  //       name: editFormData.name,
  //       number: editFormData.number,
  //       address: editFormData.address || "",
  //       includeGst: Boolean(editFormData.includeGst),
  //       date: editFormData.date,
  //       value: editFormData.value,
  //       dis: editFormData.dis.toString(),
  //       userId: user?.id || '',
  //       items: editFormData.items.map((item:any) => ({
  //         _id: item._id,
  //         quantity: item.quantity || 1
  //       }))
  //     };

  //     const response = await fetch(API_ROUTES.UPDATE_PRODUCT(selectedProduct._id), {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(transformedData),
  //     });
  //     const data = await response.json();

  //     if (response.ok && data.success) {
  //       alert("✅ Quotation updated successfully");
  //       fetchProducts();
  //       setShowEditModal(false);
  //       setSelectedProduct(null);
  //       setEditFormData(null);
  //     } else {
  //       throw new Error(data.message || "Failed to update quotation");
  //     }
  //   } catch (err:any) {
  //     console.error("❌ Error updating quotation:", err);
  //     alert(`Failed to update: ${err.message}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const confirmCreate = async () => {
  //   if (!createFormData.name || !createFormData.number) {
  //     alert("Please fill in customer name and phone number");
  //     return;
  //   }

  //   if (createFormData.items.length === 0) {
  //     alert("Please add at least one item");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const transformedData = {
  //       name: createFormData.name,
  //       number: createFormData.number,
  //       address: createFormData.address || "",
  //       includeGst: Boolean(createFormData.includeGst),
  //       date: createFormData.date,
  //       value: createFormData.value,
  //       dis: createFormData.dis.toString(),
  //       userId: user?.id || '',
  //       items: createFormData.items.map((item:any) => ({
  //         _id: item._id,
  //         quantity: item.quantity || 1
  //       }))
  //     };

  //     const response = await fetch(API_ROUTES.CREATE_PRODUCT, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(transformedData),
  //     });
  //     const data = await response.json();

  //     if (response.ok && data.success) {
  //       alert("✅ Quotation created successfully");
  //       fetchProducts();
  //       setShowCreateModal(false);
  //       setCreateFormData({
  //         name: "",
  //         number: "",
  //         address: "",
  //         date: new Date().toISOString().split('T')[0],
  //         value: "mrp",
  //         dis: 0,
  //         includeGst: false,
  //         items: []
  //       });
  //     } else {
  //       throw new Error(data.message || "Failed to create quotation");
  //     }
  //   } catch (err:any) {
  //     console.error("❌ Error creating quotation:", err);
  //     alert(`Failed to create: ${err.message}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const confirmCreate = async () => {
    if (!createFormData.name || !createFormData.number) {
      alert("Please fill in customer name and phone number");
      return;
    }

    if (createFormData.items.length === 0) {
      alert("Please add at least one item");
      return;
    }

    setLoading(true);
    try {
      const transformedData = {
        name: createFormData.name,
        number: createFormData.number,
        address: createFormData.address || "",
        includeGst: Boolean(createFormData.includeGst),
        date: createFormData.date,
        value: createFormData.value,
        dis: createFormData.dis.toString(),
        userId: user?.id || '',
        items: createFormData.items.map((item: any) => ({
          _id: item._id,
          quantity: item.quantity || 1,
          manualPrice: item.manualPrice || 0  // 🔥 NEW: Include manual price
        }))
      };

      const response = await fetch(API_ROUTES.CREATE_PRODUCT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transformedData),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        alert("✅ Quotation created successfully");
        fetchProducts();
        setShowCreateModal(false);
        setCreateFormData({
          name: "",
          number: "",
          address: "",
          date: new Date().toISOString().split('T')[0],
          value: "mrp",
          dis: 0,
          includeGst: false,
          items: []
        });
      } else {
        throw new Error(data.message || "Failed to create quotation");
      }
    } catch (err: any) {
      console.error("❌ Error creating quotation:", err);
      alert(`Failed to create: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  //   const handleDownloadPDF = async (product: any) => {
  //   const discountPercent = parseFloat(product.dis) || 0;
  //   const isNRP = product.value === 'nrp';
  //   const includeGst = product.includeGst === true;

  //   const toBase64 = async (url: any) => {
  //     try {
  //       const res = await fetch(url);
  //       const blob = await res.blob();
  //       return new Promise((resolve) => {
  //         const reader = new FileReader();
  //         reader.onloadend = () => resolve(reader.result);
  //         reader.readAsDataURL(blob);
  //       });
  //     } catch {
  //       return '';
  //     }
  //   };
  // const itemsWithImages = await Promise.all(
  //   (product.items || []).map(async (item: any) => {
  //     // 🔥 NEW: Handle manual pricing in PDF
  //     let rate = 0;
  //     if (product.value === 'manual') {
  //       rate = item.manualPrice || 0;
  //     } else if (product.value === 'nrp') {
  //       rate = item.nrp || 0;
  //     } else {
  //       rate = item.mrp || 0;
  //     }

  //     const qty = item.quantity || 1;
  //     const amount = rate * qty;

  //     let base64: any = '';
  //     if (item.image) {
  //       base64 = await toBase64(item.image);
  //     }

  //     return { ...item, rate, qty, amount, base64 };
  //   })
  // );
  //   const itemsTotal = itemsWithImages.reduce((sum, i) => sum + i.amount, 0);
  //   const discountAmount = (itemsTotal * discountPercent) / 100;
  //   const taxable = itemsTotal - discountAmount;

  //   let gst = 0;
  //   let grandTotal = taxable;

  //   if (includeGst) {
  //     gst = taxable * 0.18;
  //     grandTotal = taxable + gst;
  //   }

  //   const html = `
  // <!DOCTYPE html>
  // <html>
  // <head>
  //   <meta charset="UTF-8">
  //   <title>Quotation - ${product.name || 'Customer'}</title>
  //   <style>
  //     @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  //     * { 
  //       margin: 0; 
  //       padding: 0; 
  //       box-sizing: border-box; 
  //     }

  //     body {
  //       font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  //       background: #f5f7fa;
  //       color: #2d3748;
  //       padding: 20px;
  //       font-size: 11px;
  //       line-height: 1.5;
  //     }

  //     .container {
  //       max-width: 210mm;
  //       margin: 0 auto;
  //       background: white;
  //       box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  //       border-radius: 8px;
  //       overflow: hidden;
  //     }

  //     .header {
  //       background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  //       color: white;
  //       padding: 30px 40px;
  //       position: relative;
  //       overflow: hidden;
  //     }

  //     .header::before {
  //       content: '';
  //       position: absolute;
  //       top: -50%;
  //       right: -10%;
  //       width: 300px;
  //       height: 300px;
  //       background: rgba(255, 255, 255, 0.1);
  //       border-radius: 50%;
  //     }

  //     .company-name {
  //       font-size: 36px;
  //       font-weight: 700;
  //       letter-spacing: 2px;
  //       margin-bottom: 10px;
  //       position: relative;
  //       z-index: 1;
  //     }

  //     .company-address {
  //       font-size: 11px;
  //       line-height: 1.6;
  //       opacity: 0.95;
  //       position: relative;
  //       z-index: 1;
  //       max-width: 600px;
  //     }

  //     .contact {
  //       margin-top: 12px;
  //       font-size: 12px;
  //       font-weight: 500;
  //       position: relative;
  //       z-index: 1;
  //     }

  //     .quotation-title {
  //       background: #f8fafc;
  //       padding: 20px 40px;
  //       border-bottom: 3px solid #3b82f6;
  //     }

  //     .quotation-title h2 {
  //       font-size: 24px;
  //       color: #1e3a8a;
  //       font-weight: 600;
  //     }

  //     .content-wrapper {
  //       padding: 30px 40px;
  //     }

  //     .info-section {
  //       display: flex;
  //       justify-content: space-between;
  //       margin-bottom: 30px;
  //       gap: 30px;
  //     }

  //     .info-box {
  //       flex: 1;
  //       background: #f8fafc;
  //       padding: 20px;
  //       border-radius: 8px;
  //       border-left: 4px solid #3b82f6;
  //     }

  //     .info-box h3 {
  //       font-size: 13px;
  //       font-weight: 600;
  //       color: #1e3a8a;
  //       margin-bottom: 15px;
  //       text-transform: uppercase;
  //       letter-spacing: 0.5px;
  //     }

  //     .info-row {
  //       display: flex;
  //       margin-bottom: 8px;
  //       font-size: 11px;
  //     }

  //     .label {
  //       font-weight: 600;
  //       color: #64748b;
  //       width: 120px;
  //     }

  //     .value {
  //       flex: 1;
  //       color: #2d3748;
  //       font-weight: 500;
  //     }

  //     .gst-badge {
  //       display: inline-block;
  //       padding: 4px 12px;
  //       border-radius: 20px;
  //       font-size: 10px;
  //       font-weight: 600;
  //       text-transform: uppercase;
  //     }

  //     .gst-included {
  //       background: #dcfce7;
  //       color: #166534;
  //     }

  //     .gst-not-included {
  //       background: #fee2e2;
  //       color: #991b1b;
  //     }

  //     table {
  //       width: 100%;
  //       border-collapse: separate;
  //       border-spacing: 0;
  //       margin: 20px 0;
  //       font-size: 11px;
  //       border-radius: 8px;
  //       overflow: hidden;
  //       box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  //     }

  //     thead {
  //       background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  //       color: white;
  //     }

  //     th {
  //       padding: 14px 10px;
  //       text-align: center;
  //       font-weight: 600;
  //       font-size: 11px;
  //       text-transform: uppercase;
  //       letter-spacing: 0.5px;
  //     }

  //     td {
  //       padding: 14px 10px;
  //       text-align: center;
  //       vertical-align: middle;
  //       border-bottom: 1px solid #e2e8f0;
  //     }

  //     tbody tr {
  //       transition: background-color 0.2s;
  //     }

  //     tbody tr:hover {
  //       background-color: #f8fafc;
  //     }

  //     tbody tr:last-child td {
  //       border-bottom: none;
  //     }

  //     .item-image {
  //       width: 60px;
  //       height: 60px;
  //       object-fit: cover;
  //       border-radius: 6px;
  //       box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  //     }

  //     .text-left {
  //       text-align: left;
  //       padding-left: 12px;
  //     }

  //     .text-right {
  //       text-align: right;
  //       padding-right: 12px;
  //     }

  //     .item-name {
  //       font-weight: 600;
  //       color: #1e3a8a;
  //       font-size: 12px;
  //       margin-bottom: 4px;
  //     }

  //     .item-desc {
  //       font-size: 10px;
  //       color: #64748b;
  //       line-height: 1.4;
  //     }

  //     .totals-wrapper {
  //       display: flex;
  //       justify-content: flex-end;
  //       margin-top: 30px;
  //     }

  //     .totals {
  //       width: 400px;
  //       border-radius: 8px;
  //       overflow: hidden;
  //       box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  //     }

  //     .totals table {
  //       margin: 0;
  //       box-shadow: none;
  //     }

  //     .totals td {
  //       padding: 12px 20px;
  //       font-size: 12px;
  //       border-bottom: 1px solid #e2e8f0;
  //     }

  //     .totals .label {
  //       background: #f8fafc;
  //       font-weight: 600;
  //       text-align: right;
  //       color: #64748b;
  //       width: 60%;
  //     }

  //     .totals .value {
  //       text-align: right;
  //       font-weight: 600;
  //       color: #2d3748;
  //       width: 40%;
  //       background: white;
  //     }

  //     .grand-total td {
  //       background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  //       color: white;
  //       font-size: 16px;
  //       font-weight: 700;
  //       padding: 16px 20px;
  //       border: none;
  //     }

  //     .footer {
  //       margin-top: 40px;
  //       padding: 25px 40px;
  //       background: #f8fafc;
  //       border-top: 3px solid #3b82f6;
  //       text-align: center;
  //     }

  //     .footer-title {
  //       font-size: 14px;
  //       font-weight: 600;
  //       color: #1e3a8a;
  //       margin-bottom: 8px;
  //     }

  //     .footer-text {
  //       font-size: 11px;
  //       color: #64748b;
  //       line-height: 1.6;
  //     }

  //     .terms {
  //       display: flex;
  //       justify-content: center;
  //       gap: 20px;
  //       margin-top: 8px;
  //     }

  //     .term-item {
  //       display: flex;
  //       align-items: center;
  //       gap: 6px;
  //       font-size: 10px;
  //       color: #475569;
  //     }

  //     .term-dot {
  //       width: 6px;
  //       height: 6px;
  //       background: #3b82f6;
  //       border-radius: 50%;
  //     }

  //     @media print {
  //       body {
  //         background: white;
  //         padding: 0;
  //       }

  //       .container {
  //         box-shadow: none;
  //         border-radius: 0;
  //       }

  //       @page {
  //         margin: 1cm;
  //       }
  //     }
  //   </style>
  // </head>
  // <body>
  //   <div class="container">
  //     <div class="header">
  //       <div class="company-name">QUANTILE</div>
  //       <div class="company-address">
  //         03, Rameshwar Complex, Kapodara - Hirabaug, Near Kapodara BRTS Stand,<br>
  //         Varachha Road, Surat, Gujarat
  //       </div>
  //       <div class="contact">📱 Mobile: +91 98255 32006</div>
  //     </div>

  //     <div class="quotation-title">
  //       <h2>QUOTATION</h2>
  //     </div>

  //     <div class="content-wrapper">
  //       <div class="info-section">
  //         <div class="info-box">
  //           <h3>Bill To</h3>
  //           <div class="info-row">
  //             <span class="label">Party Name:</span>
  //             <span class="value">${product.name || 'N/A'}</span>
  //           </div>
  //           <div class="info-row">
  //             <span class="label">Address:</span>
  //             <span class="value">${product.address || 'Surat'}</span>
  //           </div>
  //           <div class="info-row">
  //             <span class="label">Mobile:</span>
  //             <span class="value">${product.number || 'N/A'}</span>
  //           </div>
  //         </div>

  //         <div class="info-box">
  //           <h3>Quotation Details</h3>
  //           <div class="info-row">
  //             <span class="label">Quotation No:</span>
  //             <span class="value">#${product._id?.slice(-6).toUpperCase() || 'N/A'}</span>
  //           </div>
  //           <div class="info-row">
  //             <span class="label">Date:</span>
  //             <span class="value">${new Date(product.date).toLocaleDateString("en-GB")}</span>
  //           </div>
  //           <div class="info-row">
  //             <span class="label">Price Type:</span>
  //             <span class="value">${(product.value || '').toUpperCase()}</span>
  //           </div>
  //           <div class="info-row">
  //             <span class="label">Discount:</span>
  //             <span class="value">${discountPercent}%</span>
  //           </div>
  //           <div class="info-row">
  //             <span class="label">GST Status:</span>
  //             <span class="value">
  //               <span class="gst-badge ${includeGst ? 'gst-included' : 'gst-not-included'}">
  //                 ${includeGst ? '✓ Included (18%)' : '✗ Not Included'}
  //               </span>
  //             </span>
  //           </div>
  //         </div>
  //       </div>

  //       <table>
  //         <thead>
  //           <tr>
  //             <th style="width: 5%;">No.</th>
  //             <th style="width: 10%;">Image</th>
  //             <th style="width: 12%;">Code</th>
  //             <th style="width: 33%;">Description</th>
  //             <th style="width: 10%;">HSN</th>
  //             <th style="width: 8%;">Qty</th>
  //             <th style="width: 11%;">Rate</th>
  //             <th style="width: 11%;">Amount</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           ${itemsWithImages.map((item, i) => `
  //             <tr>
  //               <td><strong>${i + 1}</strong></td>
  //               <td>
  //                 ${item.base64 ? `<img src="${item.base64}" class="item-image" alt="Product">` : '<div style="color: #cbd5e1;">−</div>'}
  //               </td>
  //               <td><strong>${item._id?.slice(-8).toUpperCase() || '−'}</strong></td>
  //               <td class="text-left">
  //                 <div class="item-name">${item.name || 'N/A'}</div>
  //                 ${item.description ? `<div class="item-desc">${item.description}</div>` : ''}
  //               </td>
  //               <td>84818020</td>
  //               <td><strong>${item.qty}</strong></td>
  //               <td class="text-right">₹${item.rate.toFixed(2)}</td>
  //               <td class="text-right"><strong>₹${item.amount.toFixed(2)}</strong></td>
  //             </tr>
  //           `).join('')}
  //         </tbody>
  //       </table>

  //       <div class="totals-wrapper">
  //         <div class="totals">
  //           <table>
  //             <tr>
  //               <td class="label">Subtotal</td>
  //               <td class="value">₹${itemsTotal.toFixed(2)}</td>
  //             </tr>
  //             <tr>
  //               <td class="label">Discount (${discountPercent}%)</td>
  //               <td class="value" style="color: #dc2626;">−₹${discountAmount.toFixed(2)}</td>
  //             </tr>
  //             <tr>
  //               <td class="label">Taxable Amount</td>
  //               <td class="value">₹${taxable.toFixed(2)}</td>
  //             </tr>
  //             ${includeGst ? `
  //             <tr>
  //               <td class="label">GST (18%)</td>
  //               <td class="value">₹${gst.toFixed(2)}</td>
  //             </tr>
  //             ` : ''}
  //             <tr class="grand-total">
  //               <td>GRAND TOTAL</td>
  //               <td>₹${grandTotal.toFixed(2)}</td>
  //             </tr>
  //           </table>
  //         </div>
  //       </div>
  //     </div>

  //     <div class="footer">
  //       <div class="footer-title">Thank You for Your Business!</div>
  //       <div class="footer-text">
  //         We appreciate your trust in Quantile
  //       </div>
  //       <div class="terms">
  //         <div class="term-item">
  //           <span class="term-dot"></span>
  //           <span>Validity: 15 Days</span>
  //         </div>
  //         <div class="term-item">
  //           <span class="term-dot"></span>
  //           <span>Payment: 100% Advance</span>
  //         </div>
  //         ${includeGst ? `
  //         <div class="term-item">
  //           <span class="term-dot"></span>
  //           <span>GST Inclusive</span>
  //         </div>
  //         ` : ''}
  //       </div>
  //     </div>
  //   </div>

  //   <script>
  //     window.onload = function() {
  //       window.print();
  //     };
  //   </script>
  // </body>
  // </html>`;

  //   const blob = new Blob([html], { type: 'text/html' });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement('a');  
  //   a.href = url;
  //   a.download = `Quotation_${product.name}_${new Date().toISOString().split('T')[0]}.html`;
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  //   URL.revokeObjectURL(url);

  //   const printWindow = window.open('', '_blank');
  //   if (printWindow) {
  //     printWindow.document.open();
  //     printWindow.document.write(html);
  //     printWindow.document.close();
  //   }
  // };



  //   const handleDownloadPDF = async (product:any) => {
  //     const discountPercent = parseFloat(product.dis) || 0;
  //     const isNRP = product.value === 'nrp';
  //     const includeGst = product.includeGst === true;

  //     const toBase64 = async (url:any) => {
  //       try {
  //         const res = await fetch(url);
  //         const blob = await res.blob();
  //         return new Promise((resolve) => {
  //           const reader = new FileReader();
  //           reader.onloadend = () => resolve(reader.result);
  //           reader.readAsDataURL(blob);
  //         });
  //       } catch {
  //         return '';
  //       }
  //     };

  //     const itemsWithImages = await Promise.all(
  //       (product.items || []).map(async (item:any) => {
  //         const rate = isNRP ? (item.nrp || 0) : (item.mrp || 0);
  //         const qty = item.quantity || 1;
  //         const amount = rate * qty;

  //         let base64:any = '';
  //         if (item.image) {
  //           base64 = await toBase64(item.image);
  //         }

  //         return { ...item, rate, qty, amount, base64 };
  //       })
  //     );

  //     const itemsTotal = itemsWithImages.reduce((sum, i) => sum + i.amount, 0);
  //     const discountAmount = (itemsTotal * discountPercent) / 100;
  //     const taxable = itemsTotal - discountAmount;

  //     let gst = 0;
  //     let grandTotal = taxable;

  //     if (includeGst) {
  //       gst = taxable * 0.18;
  //       grandTotal = taxable + gst;
  //     }

  //     const html = `
  // <!DOCTYPE html>
  // <html>
  // <head>
  //   <meta charset="UTF-8">
  //   <title>Quotation - ${product.name || 'Customer'}</title>
  //   <style>
  //     * { margin: 0; padding: 0; box-sizing: border-box; }
  //     body {
  //       font-family: Arial, sans-serif;
  //       background: white;
  //       color: black;
  //       padding: 15px;
  //       font-size: 11px;
  //       line-height: 1.3;
  //     }
  //     .container {
  //       max-width: 210mm;
  //       margin: 0 auto;
  //       background: white;
  //       border: 2px solid #000;
  //       padding: 15px;
  //     }
  //     .header {
  //       text-align: center;
  //       padding: 15px;
  //       background: white;
  //       border-bottom: 3px double black;
  //       margin-bottom: 15px;
  //     }
  //     .company-name {
  //       font-size: 32px;
  //       font-weight: bold;
  //       margin-bottom: 6px;
  //     }
  //     .company-address { font-size: 11px; line-height: 1.4; }
  //     .contact { margin-top: 8px; font-size: 11px; }

  //     .info-section {
  //       display: flex;
  //       justify-content: space-between;
  //       margin: 15px 0;
  //       padding: 12px;
  //       background: #f9f9f9;
  //       border: 1px solid #ddd;
  //     }
  //     .info-left, .info-right { width: 48%; }
  //     .info-row {
  //       display: flex;
  //       margin-bottom: 6px;
  //       font-size: 10px;
  //     }
  //     .label {
  //       font-weight: bold;
  //       width: 110px;
  //     }
  //     .value { flex: 1; }

  //     table {
  //       width: 100%;
  //       border-collapse: collapse;
  //       margin: 15px 0;
  //       font-size: 10px;
  //     }
  //     th {
  //       background: #f0f0f0;
  //       padding: 8px 6px;
  //       border: 1px solid #000;
  //       text-align: center;
  //       font-weight: bold;
  //       font-size: 10px;
  //     }
  //     td {
  //       padding: 8px 6px;
  //       border: 1px solid #000;
  //       text-align: center;
  //       vertical-align: middle;
  //     }
  //     tbody tr:nth-child(even) { background: #f9f9f9; }

  //     .item-image {
  //       width: 50px;
  //       height: 50px;
  //       object-fit: contain;
  //       border: 1px solid #ccc;
  //       border-radius: 3px;
  //     }
  //     .text-left { text-align: left; padding-left: 8px; }
  //     .text-right { text-align: right; padding-right: 8px; }

  //     .totals {
  //       float: right;
  //       width: 340px;
  //       border: 2px solid black;
  //       margin-top: 20px;
  //     }
  //     .totals td {
  //       padding: 8px 12px;
  //       font-size: 11px;
  //     }
  //     .totals .label {
  //       background: #f0f0f0;
  //       font-weight: bold;
  //       text-align: right;
  //       width: 60%;
  //     }
  //     .totals .value {
  //       text-align: right;
  //       font-weight: bold;
  //       width: 40%;
  //     }
  //     .grand-total {
  //       background: #000;
  //       color: white;
  //       font-size: 14px;
  //       font-weight: bold;
  //     }
  //     .grand-total label{
  //       background: #000;
  //       color: white;
  //       font-size: 14px;
  //       font-weight: bold;
  //     }

  //     .footer {
  //       margin-top: 80px;
  //       text-align: center;
  //       padding: 15px;
  //       border-top: 2px solid black;
  //       font-size: 10px;
  //     }

  //     @media print {
  //       body { padding: 8px; }
  //       .container { border: 1px solid #000; }
  //       @page { margin: 0.5cm; }
  //     }
  //   </style>
  // </head>
  // <body>
  //   <div class="container">
  //     <div class="header">
  //       <div class="company-name">QUANTILE</div>
  //       <div class="company-address">
  //         03, RAMESHWAR COMPLEX, KAPODARA - HIRABAUG, NEAR KAPODARA BRTS STAND,<br>
  //         VARACHHA ROAD, SURAT, GUJARAT
  //       </div>
  //       <div class="contact"><strong>Mo:</strong> 98255 32006</div>
  //     </div>

  //     <div class="info-section">
  //       <div class="info-left">
  //         <div class="info-row"><span class="label">Party Name:</span><span class="value">${product.name || 'N/A'}</span></div>
  //         <div class="info-row"><span class="label">Address:</span><span class="value">${product.address || 'SURAT'}</span></div>
  //         <div class="info-row"><span class="label">Mobile:</span><span class="value">${product.number || 'N/A'}</span></div>
  //       </div>
  //       <div class="info-right">
  //         <div class="info-row"><span class="label">Quotation No:</span><span class="value">${product._id?.slice(-6).toUpperCase() || 'N/A'}</span></div>
  //         <div class="info-row"><span class="label">Date:</span><span class="value">${new Date(product.date).toLocaleDateString("en-GB")}</span></div>
  //         <div class="info-row"><span class="label">Price Type:</span><span class="value">${(product.value || '').toUpperCase()} | Discount: ${discountPercent}%</span></div>
  //         ${includeGst ? '<div class="info-row"><span class="label">GST:</span><span class="value" style="color: green; font-weight: bold;">INCLUDED (18%)</span></div>' : '<div class="info-row"><span class="label">GST:</span><span class="value" style="color: red; font-weight: bold;">NOT INCLUDED</span></div>'}
  //       </div>
  //     </div>

  //     <table>
  //       <thead>
  //         <tr>
  //           <th style="width: 5%;">S.No</th>
  //           <th style="width: 10%;">Image</th>
  //           <th style="width: 12%;">Code</th>
  //           <th style="width: 35%;">Description</th>
  //           <th style="width: 10%;">HSN</th>
  //           <th style="width: 8%;">Qty</th>
  //           <th style="width: 10%;">Rate</th>
  //           <th style="width: 10%;">Amount</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         ${itemsWithImages.map((item, i) => `
  //           <tr>
  //             <td>${i + 1}</td>
  //             <td>${item.base64 ? `<img src="${item.base64}" class="item-image">` : '−'}</td>
  //             <td>${item._id?.slice(-8).toUpperCase() || ''}</td>
  //             <td class="text-left">
  //               <strong>${item.name || 'N/A'}</strong><br>
  //               <small style="font-size: 9px;">${item.description || ''}</small>
  //             </td>
  //             <td>84818020</td>
  //             <td>${item.qty}</td>
  //             <td class="text-right">₹${item.rate.toFixed(2)}</td>
  //             <td class="text-right">₹${item.amount.toFixed(2)}</td>
  //           </tr>
  //         `).join('')}
  //       </tbody>
  //     </table>

  //     <table class="totals">
  //       <tr><td class="label">Subtotal</td><td class="value">₹${itemsTotal.toFixed(2)}</td></tr>
  //       <tr><td class="label">Discount (${discountPercent}%)</td><td class="value">-₹${discountAmount.toFixed(2)}</td></tr>
  //       <tr><td class="label">Taxable Amount</td><td class="value">₹${taxable.toFixed(2)}</td></tr>
  //       ${includeGst ? `<tr><td class="label">GST (18%)</td><td class="value">₹${gst.toFixed(2)}</td></tr>` : ''}
  //       <tr class="grand-total">
  //         <td style="font-weight: bold; background-color: #000; color: #fff; border-color: #000;" class="label">GRAND TOTAL</td>
  //         <td class="value">₹${grandTotal.toFixed(2)}</td>
  //       </tr>
  //     </table>

  //     <div style="clear:both;"></div>

  //     <div class="footer">
  //       <strong>Thank You for Your Business!</strong><br>
  //       ${includeGst ? 'Prices inclusive of GST | ' : ''}Validity 15 days | Payment 100% advance
  //     </div>
  //   </div>
  //           <script>
  //             window.onload = function() {
  //               window.print();
  //             };
  //           </script>
  // </body>
  // </html>`;

  //     const blob = new Blob([html], { type: 'text/html' });
  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = `Quotation_${product.name}_${new Date().toISOString().split('T')[0]}.html`;
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //     URL.revokeObjectURL(url);

  //     // Also open for printing
  //     const printWindow = window.open('', '_blank');
  //     if (printWindow) {
  //       printWindow.document.open();
  //       printWindow.document.write(html);
  //       printWindow.document.close();
  //     }
  //   };


  // Helper function to convert number to words
  // Add this helper function at the top
  const numberToWords = (num: number): string => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    if (num === 0) return 'Zero';

    const convertLessThanThousand = (n: number): string => {
      if (n === 0) return '';
      if (n < 10) return ones[n];
      if (n < 20) return teens[n - 10];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
      return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convertLessThanThousand(n % 100) : '');
    };

    if (num < 1000) return convertLessThanThousand(num);
    if (num < 100000) {
      return convertLessThanThousand(Math.floor(num / 1000)) + ' Thousand' +
        (num % 1000 !== 0 ? ' ' + convertLessThanThousand(num % 1000) : '');
    }
    if (num < 10000000) {
      return convertLessThanThousand(Math.floor(num / 100000)) + ' Lakh' +
        (num % 100000 !== 0 ? ' ' + numberToWords(num % 100000) : '');
    }
    return convertLessThanThousand(Math.floor(num / 10000000)) + ' Crore' +
      (num % 10000000 !== 0 ? ' ' + numberToWords(num % 10000000) : '');
  };

  const handleDownloadPDF = async (product: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/download-pdf/${product._id}`);
      if (!response.ok) throw new Error('Failed to download PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const sanitizedName = (product.name || 'Customer').replace(/[^a-z0-9]/gi, '_');
      a.download = `Quotation_${sanitizedName}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('PDF download error:', error);
      alert('Failed to download PDF. Please try again.');
    }
  };

  // const handleDownloadPDF = async (product: any) => {
  //   const discountPercent = parseFloat(product.dis) || 0;
  //   const isNRP = product.value === 'nrp';
  //   const includeGst = product.includeGst === true;

  //   // Optimized image to base64 conversion
  //   const toBase64 = async (url: string): Promise<string> => {
  //     try {
  //       const res = await fetch(url);
  //       if (!res.ok) throw new Error('Image fetch failed');
  //       const blob = await res.blob();
  //       return new Promise((resolve, reject) => {
  //         const reader = new FileReader();
  //         reader.onloadend = () => resolve(reader.result as string);
  //         reader.onerror = () => reject(new Error('Failed to read image'));
  //         reader.readAsDataURL(blob);
  //       });
  //     } catch (error) {
  //       console.error('Image conversion error:', error);
  //       return '';
  //     }
  //   };

  //   // Process items with images in parallel
  //   const itemsWithImages = await Promise.all(
  //     (product.items || []).map(async (item: any, index: number) => {
  //       const rate = isNRP ? (parseFloat(item.nrp) || 0) : (parseFloat(item.mrp) || 0);
  //       const qty = parseFloat(item.quantity) || 1;
  //       const amount = rate * qty;

  //       const base64 = item.image ? await toBase64(item.image) : '';

  //       return {
  //         ...item,
  //         serialNo: index + 1,
  //         rate,
  //         qty,
  //         amount,
  //         base64,
  //         code: item._id?.slice(-8).toUpperCase() || '',
  //         name: item.name || 'N/A',
  //         description: item.description || ''
  //       };
  //     })
  //   );

  //   // Calculate totals
  //   const othersTotal = itemsWithImages.reduce((sum, item) => sum + item.amount, 0);
  //   const totalAmount = othersTotal;
  //   const netAmount = othersTotal;
  //   const totalWithoutDiscount = othersTotal / (1 - discountPercent / 100);
  //   const cgst = includeGst ? (othersTotal * 0.09) : 0;
  //   const sgst = includeGst ? (othersTotal * 0.09) : 0;
  //   const totalAmountWithGst = othersTotal + cgst + sgst;
  //   const roundOff = Math.round(totalAmountWithGst) - totalAmountWithGst;
  //   const finalAmount = Math.round(totalAmountWithGst);

  //   // Format currency
  //   const formatCurrency = (value: number) => value.toFixed(2);

  //   // Generate item rows
  //   const generateItemRows = () => itemsWithImages.map(item => `
  //     <tr>
  //       <td class="col-srno text-center">${item.serialNo}</td>
  //       <td class="col-desc text-left desc-cell">
  //         <strong>${item.name}</strong>
  //         ${item.description ? `<br><span style="font-size: 9px; color: #666;">${item.description}</span>` : ''}
  //       </td>
  //       <td class="col-sku text-center">${item.code || '-'}</td>
  //       <td class="col-image img-cell">
  //         ${item.base64 ? `<img src="${item.base64}" class="item-image" alt="${item.name}">` : ''}
  //       </td>
  //       <td class="col-price text-right">${formatCurrency(item.rate)}</td>
  //       <td class="col-qty text-center">${formatCurrency(item.qty)} PCS</td>
  //       <td class="col-disc text-right">${formatCurrency(discountPercent)}</td>
  //       <td class="col-amount text-right">${formatCurrency(item.amount)}</td>
  //     </tr>
  //   `).join('');

  //   // HTML template matching reference design
  //   const html = `<!DOCTYPE html>
  // <html lang="en">
  // <head>
  //   <meta charset="UTF-8">
  //   <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //   <title>Quotation - ${product.name || 'Customer'}</title>
  //   <style>
  //     * { margin: 0; padding: 0; box-sizing: border-box; }
  //     body {
  //       font-family: Arial, sans-serif;
  //       background: white;
  //       color: black;
  //       font-size: 10px;
  //       line-height: 1.2;
  //     }
  //     .page {
  //       width: 210mm;
  //       min-height: 297mm;
  //       margin: 0 auto;
  //       background: white;
  //       padding: 10px;
  //       page-break-after: always;
  //     }
  //     .page:last-child {
  //       page-break-after: auto;
  //     }

  //     /* Header Section */
  //     .header {
  //       border: 2px solid #000;
  //       padding: 10px;
  //       margin-bottom: 0;
  //     }
  //     .header-top {
  //       display: flex;
  //       justify-content: space-between;
  //       align-items: flex-start;
  //       margin-bottom: 10px;
  //     }
  //     .company-info {
  //       flex: 1;
  //     }
  //     .logo-section {
  //       width: 80px;
  //       margin-right: 15px;
  //     }
  //     .logo-box {
  //       width: 70px;
  //       height: 70px;
  //       border: 2px solid #000;
  //       display: flex;
  //       align-items: center;
  //       justify-content: center;
  //       background: #f5f5f5;
  //       margin-bottom: 5px;
  //     }
  //     .company-name {
  //       font-size: 18px;
  //       font-weight: bold;
  //       margin-bottom: 3px;
  //     }
  //     .company-address {
  //       font-size: 9px;
  //       line-height: 1.3;
  //       margin-bottom: 5px;
  //     }
  //     .quotation-title {
  //       text-align: center;
  //       font-size: 16px;
  //       font-weight: bold;
  //       border-top: 2px solid #000;
  //       border-bottom: 2px solid #000;
  //       padding: 5px 0;
  //       margin: 10px 0;
  //     }
  //     .header-info {
  //       display: flex;
  //       justify-content: space-between;
  //     }
  //     .header-left, .header-right {
  //       width: 48%;
  //     }
  //     .info-line {
  //       font-size: 9px;
  //       margin-bottom: 3px;
  //       display: flex;
  //     }
  //     .info-label {
  //       font-weight: bold;
  //       width: 120px;
  //       flex-shrink: 0;
  //     }
  //     .info-value {
  //       flex: 1;
  //     }

  //     /* Table Section */
  //     .items-section {
  //       border-left: 2px solid #000;
  //       border-right: 2px solid #000;
  //       border-bottom: 2px solid #000;
  //     }
  //     .section-header {
  //       background: #f0f0f0;
  //       padding: 5px 8px;
  //       font-weight: bold;
  //       font-size: 10px;
  //       border-bottom: 1px solid #000;
  //       text-align: center;
  //     }
  //     table {
  //       width: 100%;
  //       border-collapse: collapse;
  //       font-size: 9px;
  //       table-layout: fixed;
  //     }
  //     th {
  //       background: #f0f0f0;
  //       padding: 6px 4px;
  //       border: 1px solid #000;
  //       text-align: center;
  //       font-weight: bold;
  //       font-size: 9px;
  //     }
  //     td {
  //       padding: 6px 4px;
  //       border: 1px solid #000;
  //       vertical-align: middle;
  //     }

  //     /* Fixed column widths */
  //     .col-srno { width: 5%; }
  //     .col-desc { width: 30%; }
  //     .col-sku { width: 12%; }
  //     .col-image { width: 13%; }
  //     .col-price { width: 10%; }
  //     .col-qty { width: 10%; }
  //     .col-disc { width: 10%; }
  //     .col-amount { width: 10%; }

  //     .text-left { text-align: left; }
  //     .text-right { text-align: right; }
  //     .text-center { text-align: center; }
  //     .desc-cell { 
  //       text-align: left; 
  //       padding-left: 8px;
  //       word-wrap: break-word;
  //     }
  //     .img-cell {
  //       padding: 4px;
  //       text-align: center;
  //     }
  //     .item-image {
  //       width: 60px;
  //       height: 60px;
  //       object-fit: contain;
  //       display: block;
  //       margin: 0 auto;
  //     }

  //     /* Summary Section */
  //     .summary-section {
  //       border-left: 2px solid #000;
  //       border-right: 2px solid #000;
  //       border-bottom: 2px solid #000;
  //       padding: 10px;
  //     }
  //     .summary-table {
  //       width: 100%;
  //       margin-bottom: 10px;
  //     }
  //     .summary-table td {
  //       padding: 4px 8px;
  //       border: 1px solid #000;
  //       font-size: 9px;
  //     }
  //     .summary-label {
  //       font-weight: bold;
  //       background: #f0f0f0;
  //       width: 30%;
  //     }
  //     .summary-value {
  //       text-align: right;
  //       width: 20%;
  //     }
  //     .area-label {
  //       font-weight: bold;
  //       background: #f0f0f0;
  //       text-align: center;
  //     }
  //     .net-amount-row {
  //       font-weight: bold;
  //     }
  //     .final-amount-label {
  //       font-weight: bold;
  //       font-size: 11px;
  //       text-align: right;
  //       padding: 8px;
  //       background: #000;
  //       color: white;
  //     }
  //     .final-amount-value {
  //       font-weight: bold;
  //       font-size: 11px;
  //       text-align: right;
  //       padding: 8px;
  //       background: #000;
  //       color: white;
  //     }

  //     /* Terms and Conditions */
  //     .terms-section {
  //       border: 2px solid #000;
  //       padding: 8px 10px;
  //       margin-bottom: 0;
  //     }
  //     .terms-title {
  //       font-weight: bold;
  //       font-size: 11px;
  //       margin-bottom: 5px;
  //       text-decoration: underline;
  //     }
  //     .terms-list {
  //       font-size: 9px;
  //       line-height: 1.4;
  //       padding-left: 18px;
  //       margin: 0;
  //     }
  //     .terms-list li {
  //       margin-bottom: 3px;
  //     }

  //     /* Brand Logos */
  //     .brands-section {
  //       border-left: 2px solid #000;
  //       border-right: 2px solid #000;
  //       border-bottom: 2px solid #000;
  //       padding: 12px;
  //       display: grid;
  //       grid-template-columns: repeat(4, 1fr);
  //       gap: 12px;
  //       align-items: center;
  //       justify-items: center;
  //     }
  //     .brand-item {
  //       display: flex;
  //       align-items: center;
  //       justify-content: center;
  //       text-align: center;
  //     }

  //     /* Footer */
  //     .footer {
  //       border-left: 2px solid #000;
  //       border-right: 2px solid #000;
  //       border-bottom: 2px solid #000;
  //       padding: 20px 10px 8px;
  //       text-align: right;
  //       font-size: 9px;
  //     }

  //     @media print {
  //       body {
  //         margin: 0;
  //         padding: 0;
  //       }
  //       .page {
  //         margin: 0;
  //         padding: 10mm;
  //         page-break-after: always;
  //       }
  //       .page:last-child {
  //         page-break-after: auto;
  //       }
  //     }
  //   </style>
  // </head>
  // <body>
  //   <!-- PAGE 1 -->
  //   <div class="page">
  //     <!-- Header -->
  //     <div class="header">
  //       <div class="header-top">
  //         <div class="logo-section">
  //           <div class="logo-box">
  //             <span style="font-size: 24px; font-weight: bold;">
  //               <img src="/logo.jpg" alt="AL TILES" style="max-width: 100%; max-height: 100%;">
  //             </span>
  //           </div>
  //         </div>
  //         <div class="company-info">
  //           <div class="company-name">Quantile</div>
  //           <div class="company-address">
  //             'JAL CHHAYA ROW HOUSE, SATELLITE ROAD,<br>
  //             PUNA, MOTA VARACHHA<br>
  //             Surat Gujarat - 394101<br>
  //             98255 32006<br>
  //           </div>
  //         </div>
  //         <div class="header-right" style="text-align: right;">
  //           <div style="font-size: 10px; margin-bottom: 5px;"><strong>Original</strong></div>
  //           <div class="info-line">
  //             <span class="info-label">Quotation No:</span>
  //             <span class="info-value">${product._id?.slice(-8).toUpperCase() || 'QU1005664'}</span>
  //           </div>
  //           <div class="info-line">
  //             <span class="info-label">Date:</span>
  //             <span class="info-value">${new Date(product.date).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}</span>
  //           </div>
  //           <div class="info-line">
  //             <span class="info-label">Validity Date:</span>
  //             <span class="info-value">${new Date(new Date(product.date).getTime() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}</span>
  //           </div>
  //           <div class="info-line">
  //             <span class="info-label">Sales Person:</span>
  //             <span class="info-value">${product.salesPerson || 'MANOJBHAI SAVALIYA'}</span>
  //           </div>
  //           <div class="info-line">
  //             <span class="info-label">Sales Person Mob:</span>
  //             <span class="info-value">${product.salesMobile || '6264878787'}</span>
  //           </div>
  //         </div>
  //       </div>

  //       <div class="quotation-title">Quotation</div>

  //       <div class="header-info">
  //         <div class="header-left">
  //           <div style="font-weight: bold; margin-bottom: 5px; font-size: 10px;">Buyer (Bill To):</div>
  //           <div class="info-line">
  //             <span class="info-value"><strong>${product.name || 'DHRUKESHBHAI'}</strong></span>
  //           </div>
  //           <div class="info-line">
  //             <span class="info-value">${product.address || 'SURAT SURAT Surat India 395003'}</span>
  //           </div>
  //           <div class="info-line">
  //             <span class="info-label">State Name</span>
  //             <span class="info-value">: Gujarat, Code : 24</span>
  //           </div>
  //           <div class="info-line">
  //             <span class="info-label">M:</span>
  //             <span class="info-value">${product.number || '8141904440'}</span>
  //           </div>
  //         </div>
  //         <div class="header-right">
  //           <div style="font-weight: bold; margin-bottom: 5px; font-size: 10px;">Consignee (Ship To):</div>
  //           <div class="info-line">
  //             <span class="info-value"><strong>${product.consigneeName || product.name || 'DHRUKESHBHAI'}</strong></span>
  //           </div>
  //           <div class="info-line">
  //             <span class="info-value">${product.consigneeAddress || product.address || 'SURAT SURAT Surat India 395003'}</span>
  //           </div>
  //           <div class="info-line">
  //             <span class="info-label">State Name</span>
  //             <span class="info-value">: Gujarat, Code : 24</span>
  //           </div>
  //           <div class="info-line">
  //             <span class="info-label">M:</span>
  //             <span class="info-value">${product.consigneeMobile || product.number || '8141904440'}</span>
  //           </div>
  //         </div>
  //       </div>

  //       <table style="margin-top: 10px;">
  //         <thead>
  //           <tr>
  //             <th class="col-srno">SR.<br>NO</th>
  //             <th class="col-desc">DESCRIPTION OF GOODS</th>
  //             <th class="col-sku">SKU CODE</th>
  //             <th class="col-image">IMAGE</th>
  //             <th class="col-price">PRICE</th>
  //             <th class="col-qty">QTY</th>
  //             <th class="col-disc">DISC (%)</th>
  //             <th class="col-amount">AMOUNT</th>
  //           </tr>
  //         </thead>
  //       </table>
  //     </div>

  //     <!-- Items Section -->
  //     <div class="items-section">
  //       <div class="section-header">Others</div>
  //       <table>
  //         <colgroup>
  //           <col class="col-srno">
  //           <col class="col-desc">
  //           <col class="col-sku">
  //           <col class="col-image">
  //           <col class="col-price">
  //           <col class="col-qty">
  //           <col class="col-disc">
  //           <col class="col-amount">
  //         </colgroup>
  //         <tbody>
  //           ${generateItemRows()}
  //         </tbody>
  //       </table>
  //     </div>

  //     <!-- Summary Section -->
  //     <div class="summary-section">
  //       <table class="summary-table">
  //         <tr style="border-bottom: 2px solid #000;">
  //           <td colspan="2" style="border: none; padding: 4px; font-weight: bold;">Total</td>
  //           <td style="border: none;"></td>
  //           <td style="border: none; text-align: right; font-weight: bold;">Others + Total Amount</td>
  //           <td style="border: none; text-align: right; font-weight: bold;">${formatCurrency(othersTotal)}</td>
  //         </tr>
  //       </table>

  //       <table class="summary-table" style="margin-top: 10px;">
  //         <tr>
  //           <td class="summary-label">SR. NO.</td>
  //           <td class="area-label">AREA</td>
  //           <td colspan="3" class="area-label">NET AMOUNT</td>
  //         </tr>
  //         <tr>
  //           <td class="text-center">26</td>
  //           <td class="text-center">Others</td>
  //           <td colspan="3" class="text-right">${formatCurrency(othersTotal)}</td>
  //         </tr>
  //         <tr class="net-amount-row">
  //           <td colspan="2" class="summary-label">Total Amount</td>
  //           <td colspan="3" class="text-right">${formatCurrency(totalAmount)}</td>
  //         </tr>
  //         <tr class="net-amount-row">
  //           <td colspan="2" class="summary-label">Net Amount</td>
  //           <td colspan="3" class="text-right">${formatCurrency(netAmount)}</td>
  //         </tr>
  //         <tr>
  //           <td colspan="2" class="text-right">Total amount without Discount:</td>
  //           <td colspan="3" class="text-right">${formatCurrency(totalWithoutDiscount)}</td>
  //         </tr>
  //         ${includeGst ? `
  //         <tr>
  //           <td colspan="2" class="text-right">CGST</td>
  //           <td colspan="3" class="text-right">${formatCurrency(cgst)}</td>
  //         </tr>
  //         <tr>
  //           <td colspan="2" class="text-right">SGST</td>
  //           <td colspan="3" class="text-right">${formatCurrency(sgst)}</td>
  //         </tr>
  //         ` : ''}
  //         <tr>
  //           <td colspan="2" class="text-right">Total Amount:</td>
  //           <td colspan="3" class="text-right">${formatCurrency(totalAmountWithGst)}</td>
  //         </tr>
  //         <tr>
  //           <td colspan="2" class="text-right">Round Off:</td>
  //           <td colspan="3" class="text-right">${formatCurrency(roundOff)}</td>
  //         </tr>
  //         <tr>
  //           <td colspan="2" class="final-amount-label">Final Amount:</td>
  //           <td colspan="3" class="final-amount-value">${formatCurrency(finalAmount)}</td>
  //         </tr>
  //       </table>

  //       <div style="margin-top: 10px; font-size: 8px;">
  //         <strong>Amount Chargeable (in words):</strong> ${numberToWords(finalAmount)} Rupees Only
  //       </div>

  //       <div style="font-size: 8px; margin: 10px 0 0 0;">
  //         Please find below items are also available please contact for further details.
  //       </div>
  //     </div>
  //   </div>

  //   <!-- PAGE 2 -->
  //   <div class="page">
  //     <!-- Terms and Conditions -->
  //     <div class="terms-section">
  //       <div class="terms-title">Terms & Conditions :</div>
  //       <ul class="terms-list" style="list-style-type: disc;">
  //         <li>No return policy – Sold goods will not be taken back.</li>
  //         <li>Free delivery on truckload orders.</li>
  //         <li>Delivery orders must be placed at least 15 days in advance.</li>
  //         <li>Only Cash Rate.</li>
  //       </ul>
  //     </div>

  //     <!-- Brand Logos -->
  //     <div class="brands-section">
  //       <!-- Row 1 -->
  //       <div class="brand-item" style="font-weight: bold; font-size: 11px; font-style: italic; color: #2d5555;">Jaquar</div>
  //       <div class="brand-item" style="font-weight: bold; font-size: 13px; letter-spacing: 0.5px; color: #333;">kerakoll</div>
  //       <div class="brand-item" style="font-weight: bold; font-size: 13px; color: #d32f2f;">Roff<br><span style="font-size: 7px; color: #555;">PREVENT • PROTECT • PRESERVE</span></div>
  //       <div class="brand-item">
  //         <div style="width: 50px; height: 50px; border: 3px solid #333; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
  //           <div style="font-size: 20px; font-weight: bold; color: #333;">S</div>
  //         </div>
  //       </div>

  //       <!-- Row 2 -->
  //       <div class="brand-item" style="font-weight: bold; font-size: 10px; color: #444;">
  //         <div style="text-align: center; line-height: 1.2;">
  //           <div style="font-size: 8px;">◐</div>
  //           <div>simola</div>
  //           <div style="font-size: 7px;">VITRIFIED TILES</div>
  //         </div>
  //       </div>
  //       <div class="brand-item" style="font-weight: bold; font-size: 13px; color: #666; letter-spacing: 2px;">SEGA<br><span style="font-size: 8px; letter-spacing: 1px;">TILES</span></div>
  //       <div class="brand-item" style="background: #1565c0; color: white; padding: 8px 12px; font-weight: bold; font-size: 10px;">
  //         <div style="line-height: 1.2;">
  //           <div style="font-size: 7px;">▀▀▀</div>
  //           <div>MYK LATICRETE</div>
  //         </div>
  //       </div>
  //       <div class="brand-item" style="font-weight: bold; font-size: 11px; color: #c89860;">
  //         <div style="text-align: center; line-height: 1.3;">
  //           <div style="font-size: 14px;">SONARA</div>
  //           <div style="font-size: 7px;">SANITARY WARES PVT. LTD.</div>
  //         </div>
  //       </div>

  //       <!-- Row 3 -->
  //       <div class="brand-item" style="background: #2d2d2d; color: white; padding: 10px 15px; font-weight: bold; font-size: 11px;">
  //         <div style="text-align: center; line-height: 1.3;">
  //           <div style="font-size: 14px; letter-spacing: 1px;">W</div>
  //           <div style="font-size: 9px;">Wintouch</div>
  //         </div>
  //       </div>
  //       <div class="brand-item" style="background: #2d2d2d; color: white; padding: 10px 15px; font-weight: bold; font-size: 12px; letter-spacing: 2px;">AGILIS</div>
  //       <div class="brand-item" style="font-weight: bold; font-size: 13px; color: #1a5490;">
  //         <div style="text-align: center; line-height: 1.3;">
  //           <div style="font-size: 15px; letter-spacing: 1px;">LEMZON</div>
  //           <div style="font-size: 7px; color: #555;">empire of tiles</div>
  //         </div>
  //       </div>
  //       <div class="brand-item" style="font-weight: bold; font-size: 13px; color: #c62828;">
  //         <div style="text-align: center; line-height: 1.3;">
  //           <div style="font-size: 15px; letter-spacing: 1px;">LEZORA</div>
  //           <div style="font-size: 7px; color: #555;">empire of tiles</div>
  //         </div>
  //       </div>

  //       <!-- Row 4 -->
  //       <div class="brand-item" style="background: #2d2d2d; color: white; padding: 10px 15px; font-weight: bold; font-size: 12px; letter-spacing: 2px;">
  //         <div style="text-align: center; line-height: 1.3;">
  //           <div style="font-size: 15px;">LEZWIN</div>
  //           <div style="font-size: 7px;">THE CERAMIC WORLD</div>
  //         </div>
  //       </div>
  //     </div>

  //     <!-- Footer -->
  //     <div class="footer">
  //       <div style="text-align: right; margin-bottom: 35px;">
  //         For <strong>VRAJ DIGITAL TILES</strong>
  //       </div>
  //       <div style="border-top: 1px solid #000; padding-top: 5px; text-align: right;">
  //         <strong>Authorized Signatory</strong>
  //       </div>
  //       <div style="margin-top: 8px; text-align: left; font-size: 8px;">
  //         <strong>Prepared By:</strong> CHARMI VORA
  //       </div>
  //     </div>
  //   </div>

  //   <script>
  //     window.onload = () => window.print();
  //   </script>
  // </body>
  // </html>`;

  //   // Create filename
  //   const sanitizedName = (product.name || 'Customer').replace(/[^a-z0-9]/gi, '_');
  //   const filename = `Quotation_${sanitizedName}_${new Date().toISOString().split('T')[0]}.html`;

  //   // Download file
  //   const blob = new Blob([html], { type: 'text/html' });
  //   const url = URL.createObjectURL(blob);
  //   const anchor = document.createElement('a');
  //   anchor.href = url;
  //   anchor.download = filename;
  //   anchor.style.display = 'none';
  //   document.body.appendChild(anchor);
  //   anchor.click();
  //   document.body.removeChild(anchor);
  //   URL.revokeObjectURL(url);

  //   // Open print window
  //   const printWindow = window.open('', '_blank');
  //   if (printWindow) {
  //     printWindow.document.open();
  //     printWindow.document.write(html);
  //     printWindow.document.close();
  //   }
  // };
  // const handleDownloadPDF = async (product: any) => {
  //   const discountPercent = parseFloat(product.dis) || 0;
  //   const isNRP = product.value === 'nrp';
  //   const includeGst = product.includeGst === true;

  //   // Optimized image to base64 conversion
  //   const toBase64 = async (url: string): Promise<string> => {
  //     try {
  //       const res = await fetch(url);
  //       if (!res.ok) throw new Error('Image fetch failed');
  //       const blob = await res.blob();
  //       return new Promise((resolve, reject) => {
  //         const reader = new FileReader();
  //         reader.onloadend = () => resolve(reader.result as string);
  //         reader.onerror = () => reject(new Error('Failed to read image'));
  //         reader.readAsDataURL(blob);
  //       });
  //     } catch (error) {
  //       console.error('Image conversion error:', error);
  //       return '';
  //     }
  //   };

  //   // Process items with images in parallel
  //   const itemsWithImages = await Promise.all(
  //     (product.items || []).map(async (item: any, index: number) => {
  //       const rate = isNRP ? (parseFloat(item.nrp) || 0) : (parseFloat(item.mrp) || 0);
  //       const qty = parseFloat(item.quantity) || 1;
  //       const amount = rate * qty;

  //       const base64 = item.image ? await toBase64(item.image) : '';

  //       return {
  //         ...item,
  //         serialNo: index + 1,
  //         rate,
  //         qty,
  //         amount,
  //         base64,
  //         code: item._id?.slice(-8).toUpperCase() || '',
  //         name: item.name || 'N/A',
  //         description: item.description || ''
  //       };
  //     })
  //   );

  //   // Calculate totals
  //   const othersTotal = itemsWithImages.reduce((sum, item) => sum + item.amount, 0);
  //   const totalAmount = othersTotal;
  //   const netAmount = othersTotal;
  //   const totalWithoutDiscount = othersTotal / (1 - discountPercent / 100);
  //   const cgst = includeGst ? (othersTotal * 0.09) : 0;
  //   const sgst = includeGst ? (othersTotal * 0.09) : 0;
  //   const totalAmountWithGst = othersTotal + cgst + sgst;
  //   const roundOff = Math.round(totalAmountWithGst) - totalAmountWithGst;
  //   const finalAmount = Math.round(totalAmountWithGst);

  //   // Format currency
  //   const formatCurrency = (value: number) => value.toFixed(2);

  //   // Generate item rows
  //   const generateItemRows = () => itemsWithImages.map(item => `
  //     <tr>
  //       <td class="col-srno text-center">${item.serialNo}</td>
  //       <td class="col-desc text-left desc-cell">
  //         <strong>${item.name}</strong>
  //         ${item.description ? `<br><span style="font-size: 9px; color: #666;">${item.description}</span>` : ''}
  //       </td>
  //       <td class="col-sku text-center">${item.code || '-'}</td>
  //       <td class="col-image img-cell">
  //         ${item.base64 ? `<img src="${item.base64}" class="item-image" alt="${item.name}">` : ''}
  //       </td>
  //       <td class="col-price text-right">${formatCurrency(item.rate)}</td>
  //       <td class="col-qty text-center">${formatCurrency(item.qty)} PCS</td>
  //       <td class="col-disc text-right">${formatCurrency(discountPercent)}</td>
  //       <td class="col-amount text-right">${formatCurrency(item.amount)}</td>
  //     </tr>
  //   `).join('');

  //   // HTML template matching reference design
  //   const html = `<!DOCTYPE html>
  // <html lang="en">
  // <head>
  //   <meta charset="UTF-8">
  //   <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //   <title>Quotation - ${product.name || 'Customer'}</title>
  //   <style>
  //     * { margin: 0; padding: 0; box-sizing: border-box; }
  //     body {
  //       font-family: Arial, sans-serif;
  //       background: white;
  //       color: black;
  //       padding: 10px;
  //       font-size: 10px;
  //       line-height: 1.2;
  //     }
  //     .page {
  //       width: 210mm;
  //       margin: 0 auto;
  //       background: white;
  //       padding: 0;
  //     }

  //     /* Header Section */
  //     .header {
  //       border: 2px solid #000;
  //       padding: 10px;
  //       margin-bottom: 0;
  //     }
  //     .header-top {
  //       display: flex;
  //       justify-content: space-between;
  //       align-items: flex-start;
  //       margin-bottom: 10px;
  //     }
  //     .company-info {
  //       flex: 1;
  //     }
  //     .logo-section {
  //       width: 80px;
  //       margin-right: 15px;
  //     }
  //     .logo-box {
  //       width: 70px;
  //       height: 70px;
  //       border: 2px solid #000;
  //       display: flex;
  //       align-items: center;
  //       justify-content: center;
  //       background: #f5f5f5;
  //       margin-bottom: 5px;
  //     }
  //     .company-name {
  //       font-size: 18px;
  //       font-weight: bold;
  //       margin-bottom: 3px;
  //     }
  //     .company-address {
  //       font-size: 9px;
  //       line-height: 1.3;
  //       margin-bottom: 5px;
  //     }
  //     .quotation-title {
  //       text-align: center;
  //       font-size: 16px;
  //       font-weight: bold;
  //       border-top: 2px solid #000;
  //       border-bottom: 2px solid #000;
  //       padding: 5px 0;
  //       margin: 10px 0;
  //     }
  //     .header-info {
  //       display: flex;
  //       justify-content: space-between;
  //     }
  //     .header-left, .header-right {
  //       width: 48%;
  //     }
  //     .info-line {
  //       font-size: 9px;
  //       margin-bottom: 3px;
  //       display: flex;
  //     }
  //     .info-label {
  //       font-weight: bold;
  //       width: 120px;
  //       flex-shrink: 0;
  //     }
  //     .info-value {
  //       flex: 1;
  //     }

  //     /* Table Section */
  //     .items-section {
  //       border-left: 2px solid #000;
  //       border-right: 2px solid #000;
  //       border-bottom: 2px solid #000;
  //     }
  //     .section-header {
  //       background: #f0f0f0;
  //       padding: 5px 8px;
  //       font-weight: bold;
  //       font-size: 10px;
  //       border-bottom: 1px solid #000;
  //       text-align: center;
  //     }
  //     table {
  //       width: 100%;
  //       border-collapse: collapse;
  //       font-size: 9px;
  //       table-layout: fixed;
  //     }
  //     th {
  //       background: #f0f0f0;
  //       padding: 6px 4px;
  //       border: 1px solid #000;
  //       text-align: center;
  //       font-weight: bold;
  //       font-size: 9px;
  //     }
  //     td {
  //       padding: 6px 4px;
  //       border: 1px solid #000;
  //       vertical-align: middle;
  //     }

  //     /* Fixed column widths */
  //     .col-srno { width: 5%; }
  //     .col-desc { width: 30%; }
  //     .col-sku { width: 12%; }
  //     .col-image { width: 13%; }
  //     .col-price { width: 10%; }
  //     .col-qty { width: 10%; }
  //     .col-disc { width: 10%; }
  //     .col-amount { width: 10%; }

  //     .text-left { text-align: left; }
  //     .text-right { text-align: right; }
  //     .text-center { text-align: center; }
  //     .desc-cell { 
  //       text-align: left; 
  //       padding-left: 8px;
  //       word-wrap: break-word;
  //     }
  //     .img-cell {
  //       padding: 4px;
  //       text-align: center;
  //     }
  //     .item-image {
  //       width: 60px;
  //       height: 60px;
  //       object-fit: contain;
  //       display: block;
  //       margin: 0 auto;
  //     }

  //     /* Summary Section */
  //     .summary-section {
  //       border-left: 2px solid #000;
  //       border-right: 2px solid #000;
  //       border-bottom: 2px solid #000;
  //       padding: 10px;
  //     }
  //     .summary-table {
  //       width: 100%;
  //       margin-bottom: 10px;
  //     }
  //     .summary-table td {
  //       padding: 4px 8px;
  //       border: 1px solid #000;
  //       font-size: 9px;
  //     }
  //     .summary-label {
  //       font-weight: bold;
  //       background: #f0f0f0;
  //       width: 30%;
  //     }
  //     .summary-value {
  //       text-align: right;
  //       width: 20%;
  //     }
  //     .area-label {
  //       font-weight: bold;
  //       background: #f0f0f0;
  //       text-align: center;
  //     }
  //     .net-amount-row {
  //       font-weight: bold;
  //     }
  //     .final-amount-label {
  //       font-weight: bold;
  //       font-size: 11px;
  //       text-align: right;
  //       padding: 8px;
  //       background: #000;
  //       color: white;
  //     }
  //     .final-amount-value {
  //       font-weight: bold;
  //       font-size: 11px;
  //       text-align: right;
  //       padding: 8px;
  //       background: #000;
  //       color: white;
  //     }

  //     /* Terms and Conditions */
  //     .terms-section {
  //       border-left: 2px solid #000;
  //       border-right: 2px solid #000;
  //       border-bottom: 2px solid #000;
  //       padding: 10px;
  //     }
  //     .terms-title {
  //       font-weight: bold;
  //       font-size: 12px;
  //       margin-bottom: 8px;
  //       text-decoration: underline;
  //     }
  //     .terms-list {
  //       font-size: 10px;
  //       line-height: 1.6;
  //       padding-left: 20px;
  //     }
  //     .terms-list li {
  //       margin-bottom: 5px;
  //     }

  //     /* Brand Logos */
  //     .brands-section {
  //       border-left: 2px solid #000;
  //       border-right: 2px solid #000;
  //       border-bottom: 2px solid #000;
  //       padding: 20px;
  //       display: grid;
  //       grid-template-columns: repeat(4, 1fr);
  //       gap: 20px;
  //       align-items: center;
  //       justify-items: center;
  //     }
  //     .brand-item {
  //       display: flex;
  //       align-items: center;
  //       justify-content: center;
  //       text-align: center;
  //     }

  //     /* Footer */
  //     .footer {
  //       border-left: 2px solid #000;
  //       border-right: 2px solid #000;
  //       border-bottom: 2px solid #000;
  //       padding: 30px 10px 10px;
  //       text-align: right;
  //       font-size: 9px;
  //     }

  //     @media print {
  //       .page-break {
  //         page-break-before: always;
  //       }
  //     }
  //   </style>
  // </head>
  // <body>
  //   <div class="page">
  //     <!-- Header -->
  //     <div class="header">
  //       <div class="header-top">
  //         <div class="logo-section">
  //           <div class="logo-box">
  //             <span style="font-size: 24px; font-weight: bold;">
  //               <img src="/logo.jpg" alt="AL TILES" style="max-width: 100%; max-height: 100%;">
  //             </span>
  //           </div>
  //         </div>
  //         <div class="company-info">
  //           <div class="company-name">Quantile</div>
  //           <div class="company-address">
  //             'JAL CHHAYA ROW HOUSE, SATELLITE ROAD,<br>
  //             PUNA, MOTA VARACHHA<br>
  //             Surat Gujarat - 394101<br>
  //             98255 32006<br>
  //           </div>
  //         </div>
  //         <div class="header-right" style="text-align: right;">
  //           <div style="font-size: 10px; margin-bottom: 5px;"><strong>Original</strong></div>
  //           <div class="info-line">
  //             <span class="info-label">Quotation No:</span>
  //             <span class="info-value">${product._id?.slice(-8).toUpperCase() || 'QU1005664'}</span>
  //           </div>
  //           <div class="info-line">
  //             <span class="info-label">Date:</span>
  //             <span class="info-value">${new Date(product.date).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}</span>
  //           </div>
  //           <div class="info-line">
  //             <span class="info-label">Validity Date:</span>
  //             <span class="info-value">${new Date(new Date(product.date).getTime() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}</span>
  //           </div>
  //           <div class="info-line">
  //             <span class="info-label">Sales Person:</span>
  //             <span class="info-value">${product.salesPerson || 'MANOJBHAI SAVALIYA'}</span>
  //           </div>
  //           <div class="info-line">
  //             <span class="info-label">Sales Person Mob:</span>
  //             <span class="info-value">${product.salesMobile || '6264878787'}</span>
  //           </div>
  //         </div>
  //       </div>

  //       <div class="quotation-title">Quotation</div>

  //       <div class="header-info">
  //         <div class="header-left">
  //           <div style="font-weight: bold; margin-bottom: 5px; font-size: 10px;">Buyer (Bill To):</div>
  //           <div class="info-line">
  //             <span class="info-value"><strong>${product.name || 'DHRUKESHBHAI'}</strong></span>
  //           </div>
  //           <div class="info-line">
  //             <span class="info-value">${product.address || 'SURAT SURAT Surat India 395003'}</span>
  //           </div>
  //           <div class="info-line">
  //             <span class="info-label">State Name</span>
  //             <span class="info-value">: Gujarat, Code : 24</span>
  //           </div>
  //           <div class="info-line">
  //             <span class="info-label">M:</span>
  //             <span class="info-value">${product.number || '8141904440'}</span>
  //           </div>
  //         </div>
  //         <div class="header-right">
  //           <div style="font-weight: bold; margin-bottom: 5px; font-size: 10px;">Consignee (Ship To):</div>
  //           <div class="info-line">
  //             <span class="info-value"><strong>${product.consigneeName || product.name || 'DHRUKESHBHAI'}</strong></span>
  //           </div>
  //           <div class="info-line">
  //             <span class="info-value">${product.consigneeAddress || product.address || 'SURAT SURAT Surat India 395003'}</span>
  //           </div>
  //           <div class="info-line">
  //             <span class="info-label">State Name</span>
  //             <span class="info-value">: Gujarat, Code : 24</span>
  //           </div>
  //           <div class="info-line">
  //             <span class="info-label">M:</span>
  //             <span class="info-value">${product.consigneeMobile || product.number || '8141904440'}</span>
  //           </div>
  //         </div>
  //       </div>

  //       <table style="margin-top: 10px;">
  //         <thead>
  //           <tr>
  //             <th class="col-srno">SR.<br>NO</th>
  //             <th class="col-desc">DESCRIPTION OF GOODS</th>
  //             <th class="col-sku">SKU CODE</th>
  //             <th class="col-image">IMAGE</th>
  //             <th class="col-price">PRICE</th>
  //             <th class="col-qty">QTY</th>
  //             <th class="col-disc">DISC (%)</th>
  //             <th class="col-amount">AMOUNT</th>
  //           </tr>
  //         </thead>
  //       </table>
  //     </div>

  //     <!-- Items Section -->
  //     <div class="items-section">
  //       <div class="section-header">Others</div>
  //       <table>
  //         <colgroup>
  //           <col class="col-srno">
  //           <col class="col-desc">
  //           <col class="col-sku">
  //           <col class="col-image">
  //           <col class="col-price">
  //           <col class="col-qty">
  //           <col class="col-disc">
  //           <col class="col-amount">
  //         </colgroup>
  //         <tbody>
  //           ${generateItemRows()}
  //         </tbody>
  //       </table>
  //     </div>

  //     <!-- Summary Section -->
  //     <div class="summary-section">
  //       <table class="summary-table">
  //         <tr style="border-bottom: 2px solid #000;">
  //           <td colspan="2" style="border: none; padding: 4px; font-weight: bold;">Total</td>
  //           <td style="border: none;"></td>
  //           <td style="border: none; text-align: right; font-weight: bold;">Others + Total Amount</td>
  //           <td style="border: none; text-align: right; font-weight: bold;">${formatCurrency(othersTotal)}</td>
  //         </tr>
  //       </table>

  //       <table class="summary-table" style="margin-top: 10px;">
  //         <tr>
  //           <td class="summary-label">SR. NO.</td>
  //           <td class="area-label">AREA</td>
  //           <td colspan="3" class="area-label">NET AMOUNT</td>
  //         </tr>
  //         <tr>
  //           <td class="text-center">26</td>
  //           <td class="text-center">Others</td>
  //           <td colspan="3" class="text-right">${formatCurrency(othersTotal)}</td>
  //         </tr>
  //         <tr class="net-amount-row">
  //           <td colspan="2" class="summary-label">Total Amount</td>
  //           <td colspan="3" class="text-right">${formatCurrency(totalAmount)}</td>
  //         </tr>
  //         <tr class="net-amount-row">
  //           <td colspan="2" class="summary-label">Net Amount</td>
  //           <td colspan="3" class="text-right">${formatCurrency(netAmount)}</td>
  //         </tr>
  //         <tr>
  //           <td colspan="2" class="text-right">Total amount without Discount:</td>
  //           <td colspan="3" class="text-right">${formatCurrency(totalWithoutDiscount)}</td>
  //         </tr>
  //         ${includeGst ? `
  //         <tr>
  //           <td colspan="2" class="text-right">CGST</td>
  //           <td colspan="3" class="text-right">${formatCurrency(cgst)}</td>
  //         </tr>
  //         <tr>
  //           <td colspan="2" class="text-right">SGST</td>
  //           <td colspan="3" class="text-right">${formatCurrency(sgst)}</td>
  //         </tr>
  //         ` : ''}
  //         <tr>
  //           <td colspan="2" class="text-right">Total Amount:</td>
  //           <td colspan="3" class="text-right">${formatCurrency(totalAmountWithGst)}</td>
  //         </tr>
  //         <tr>
  //           <td colspan="2" class="text-right">Round Off:</td>
  //           <td colspan="3" class="text-right">${formatCurrency(roundOff)}</td>
  //         </tr>
  //         <tr>
  //           <td colspan="2" class="final-amount-label">Final Amount:</td>
  //           <td colspan="3" class="final-amount-value">${formatCurrency(finalAmount)}</td>
  //         </tr>
  //       </table>

  //       <div style="margin-top: 10px; font-size: 8px;">
  //         <strong>Amount Chargeable (in words):</strong> ${numberToWords(finalAmount)} Rupees Only
  //       </div>

  //       <div style="font-size: 8px; margin: 10px 0;">
  //         Please find below items are also available please contact for further details.
  //       </div>
  //     </div>

  //     <!-- PAGE 2 START -->
  //     <div class="page-break"></div>

  //     <!-- Terms and Conditions - Page 2 -->
  //     <div class="terms-section">
  //       <div class="terms-title">Terms & Conditions :</div>
  //       <ul class="terms-list" style="list-style-type: disc;">
  //         <li>No return policy – Sold goods will not be taken back.</li>
  //         <li>Free delivery on truckload orders.</li>
  //         <li>Delivery orders must be placed at least 15 days in advance.</li>
  //         <li>Only Cash Rate.</li>
  //       </ul>
  //     </div>

  //     <!-- Brand Logos - Page 2 -->
  //     <div class="brands-section">
  //       <!-- Row 1 -->
  //       <div class="brand-item" style="font-weight: bold; font-size: 11px; font-style: italic; color: #2d5555;">Jaquar</div>
  //       <div class="brand-item" style="font-weight: bold; font-size: 13px; letter-spacing: 0.5px; color: #333;">kerakoll</div>
  //       <div class="brand-item" style="font-weight: bold; font-size: 13px; color: #d32f2f;">Roff<br><span style="font-size: 7px; color: #555;">PREVENT • PROTECT • PRESERVE</span></div>
  //       <div class="brand-item">
  //         <div style="width: 50px; height: 50px; border: 3px solid #333; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
  //           <div style="font-size: 20px; font-weight: bold; color: #333;">S</div>
  //         </div>
  //       </div>

  //       <!-- Row 2 -->
  //       <div class="brand-item" style="font-weight: bold; font-size: 10px; color: #444;">
  //         <div style="text-align: center; line-height: 1.2;">
  //           <div style="font-size: 8px;">◐</div>
  //           <div>simola</div>
  //           <div style="font-size: 7px;">VITRIFIED TILES</div>
  //         </div>
  //       </div>
  //       <div class="brand-item" style="font-weight: bold; font-size: 13px; color: #666; letter-spacing: 2px;">SEGA<br><span style="font-size: 8px; letter-spacing: 1px;">TILES</span></div>
  //       <div class="brand-item" style="background: #1565c0; color: white; padding: 8px 12px; font-weight: bold; font-size: 10px;">
  //         <div style="line-height: 1.2;">
  //           <div style="font-size: 7px;">▀▀▀</div>
  //           <div>MYK LATICRETE</div>
  //         </div>
  //       </div>
  //       <div class="brand-item" style="font-weight: bold; font-size: 11px; color: #c89860;">
  //         <div style="text-align: center; line-height: 1.3;">
  //           <div style="font-size: 14px;">SONARA</div>
  //           <div style="font-size: 7px;">SANITARY WARES PVT. LTD.</div>
  //         </div>
  //       </div>

  //       <!-- Row 3 -->
  //       <div class="brand-item" style="background: #2d2d2d; color: white; padding: 10px 15px; font-weight: bold; font-size: 11px;">
  //         <div style="text-align: center; line-height: 1.3;">
  //           <div style="font-size: 14px; letter-spacing: 1px;">W</div>
  //           <div style="font-size: 9px;">Wintouch</div>
  //         </div>
  //       </div>
  //       <div class="brand-item" style="background: #2d2d2d; color: white; padding: 10px 15px; font-weight: bold; font-size: 12px; letter-spacing: 2px;">AGILIS</div>
  //       <div class="brand-item" style="font-weight: bold; font-size: 13px; color: #1a5490;">
  //         <div style="text-align: center; line-height: 1.3;">
  //           <div style="font-size: 15px; letter-spacing: 1px;">LEMZON</div>
  //           <div style="font-size: 7px; color: #555;">empire of tiles</div>
  //         </div>
  //       </div>
  //       <div class="brand-item" style="font-weight: bold; font-size: 13px; color: #c62828;">
  //         <div style="text-align: center; line-height: 1.3;">
  //           <div style="font-size: 15px; letter-spacing: 1px;">LEZORA</div>
  //           <div style="font-size: 7px; color: #555;">empire of tiles</div>
  //         </div>
  //       </div>

  //       <!-- Row 4 -->
  //       <div class="brand-item" style="background: #2d2d2d; color: white; padding: 10px 15px; font-weight: bold; font-size: 12px; letter-spacing: 2px;">
  //         <div style="text-align: center; line-height: 1.3;">
  //           <div style="font-size: 15px;">LEZWIN</div>
  //           <div style="font-size: 7px;">THE CERAMIC WORLD</div>
  //         </div>
  //       </div>
  //     </div>

  //     <!-- Footer - Page 2 -->
  //     <div class="footer">
  //       <div style="text-align: right; margin-bottom: 50px;">
  //         For <strong>VRAJ DIGITAL TILES</strong>
  //       </div>
  //       <div style="border-top: 1px solid #000; padding-top: 5px; text-align: right;">
  //         <strong>Authorized Signatory</strong>
  //       </div>
  //       <div style="margin-top: 10px; text-align: left; font-size: 8px;">
  //         <strong>Prepared By:</strong> CHARMI VORA
  //       </div>
  //     </div>
  //   </div>

  //   <script>
  //     window.onload = () => window.print();
  //   </script>
  // </body>
  // </html>`;

  //   // Create filename
  //   const sanitizedName = (product.name || 'Customer').replace(/[^a-z0-9]/gi, '_');
  //   const filename = `Quotation_${sanitizedName}_${new Date().toISOString().split('T')[0]}.html`;

  //   // Download file
  //   const blob = new Blob([html], { type: 'text/html' });
  //   const url = URL.createObjectURL(blob);
  //   const anchor = document.createElement('a');
  //   anchor.href = url;
  //   anchor.download = filename;
  //   anchor.style.display = 'none';
  //   document.body.appendChild(anchor);
  //   anchor.click();
  //   document.body.removeChild(anchor);
  //   URL.revokeObjectURL(url);

  //   // Open print window
  //   const printWindow = window.open('', '_blank');
  //   if (printWindow) {
  //     printWindow.document.open();
  //     printWindow.document.write(html);
  //     printWindow.document.close();
  //   }
  // };
  const filteredAvailableItems = availableItems.filter((item: any) =>
    item.name.toLowerCase().includes(itemSearchTerm.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(itemSearchTerm.toLowerCase()))
  );

  const renderItemForm = (formData: any, isEdit: any) => {
    const handleFormChange = isEdit ? handleEditFormChange : handleCreateFormChange;

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-premium-text-faint mb-1.5 uppercase tracking-widest">
              Customer Name <span className="text-premium-amber-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
              className="input-premium"
              placeholder="Enter customer name"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-premium-text-faint mb-1.5 uppercase tracking-widest">
              Phone Number <span className="text-premium-amber-500">*</span>
            </label>
            <input
              type="text"
              value={formData.number}
              onChange={(e) => handleFormChange('number', e.target.value)}
              className="input-premium"
              placeholder="Enter phone number"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-black text-premium-text-faint mb-1.5 uppercase tracking-widest">
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => handleFormChange('address', e.target.value)}
              rows={2}
              className="input-premium py-2.5 resize-none"
              placeholder="Enter customer address"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-premium-text-faint mb-1.5 uppercase tracking-widest">
              Date <span className="text-premium-amber-500">*</span>
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleFormChange('date', e.target.value)}
              className="input-premium [color-scheme:dark]"
            />
          </div>
          {/* <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Price Type <span className="text-red-600">*</span>
            </label>
            <select
              value={formData.value}
              onChange={(e) => handleFormChange('value', e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="mrp">MRP</option>
              <option value="nrp">NRP</option>
            </select>
          </div> */}

          <div>
            <label className="block text-[10px] font-black text-premium-text-faint mb-1.5 uppercase tracking-widest">
              Pricing Scheme <span className="text-premium-amber-500">*</span>
            </label>
            <select
              value={formData.value}
              onChange={(e) => handleFormChange('value', e.target.value)}
              className="input-premium appearance-none"
            >
              <option value="mrp">MRP - Premium Retail</option>
              <option value="nrp">NRP - Professional</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-premium-text-faint mb-1.5 uppercase tracking-widest">
              Trade Discount (%)
            </label>
            <input
              type="number"
              value={formData.dis}
              onChange={(e) => handleFormChange('dis', parseFloat(e.target.value) || 0)}
              min="0"
              max="100"
              step="0.1"
              className="input-premium"
            />
          </div>
          <div className="flex items-center gap-3 p-3 bg-premium-raised/40 rounded-xl border border-premium-border">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                id={isEdit ? "includeGstEdit" : "includeGstCreate"}
                checked={formData.includeGst === true}
                onChange={(e) => handleFormChange('includeGst', e.target.checked)}
                className="w-5 h-5 bg-premium-base border-premium-border rounded text-premium-amber-500 focus:ring-premium-amber-500/30 transition-all cursor-pointer"
              />
            </div>
            <label htmlFor={isEdit ? "includeGstEdit" : "includeGstCreate"} className="text-[10px] font-black text-premium-text-faint uppercase tracking-widest cursor-pointer select-none">
              Include GST (18%)
            </label>
          </div>
        </div>

        <div className="border-t border-premium-border pt-6 mt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-premium-amber-500 rounded-full"></span>
              <h4 className="text-sm font-black text-premium-text-primary uppercase tracking-widest">Selected Items</h4>
            </div>
            <button
              onClick={() => {
                setIsCreateMode(!isEdit);
                setShowItemSelector(true);
              }}
              className="flex items-center gap-2 bg-premium-raised border border-premium-border text-premium-text-muted px-4 py-2 text-[10px] rounded-xl font-bold hover:bg-premium-surface hover:text-premium-amber-500 transition-all uppercase tracking-widest"
            >
              <Plus size={16} />
              Add Item
            </button>
          </div>

          {formData.items.length === 0 ? (
            <div className="text-center py-10 bg-zinc-950/20 rounded-2xl border-2 border-dashed border-zinc-800">
              <ShoppingCart className="mx-auto text-zinc-700 mb-3" size={32} />
              <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">No items selected</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.items.map((item: any, index: any) => {
                const rate = formData.value === 'nrp' ? (item.nrp || 0) : (item.mrp || 0);
                const itemTotal = (item.quantity || 1) * rate;

                return (
                  <div key={index} className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-4 hover:border-amber-500/50 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => removeItem(index, isEdit)}
                        className="p-2 bg-red-950/30 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-900/30"
                        title="Remove Item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex gap-4">
                      {item.image && (
                        <div className="w-20 h-20 rounded-xl overflow-hidden border border-zinc-800 flex-shrink-0 group-hover:border-amber-500/30 transition-colors">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0 pr-8">
                        <div className="mb-3">
                          <h4 className="font-black text-zinc-100 text-sm uppercase tracking-tight truncate">{item.name}</h4>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-tighter truncate font-bold">{item.description}</p>
                          <p className="text-xs text-amber-500 font-mono font-bold mt-1">
                            ₹{rate.toLocaleString("en-IN")} <span className="text-[10px] text-zinc-600 font-sans uppercase">per unit</span>
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-3 bg-zinc-950/50 rounded-xl p-2 border border-zinc-800/50">
                          <div className="flex items-center bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                            <button
                              onClick={() => {
                                const newQty = Math.max(1, (item.quantity || 1) - 1);
                                handleItemChange(index, 'quantity', newQty, isEdit);
                              }}
                              className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-amber-500 hover:bg-zinc-800 transition-colors rounded-md"
                            >
                              <Minus size={14} />
                            </button>
                            <input
                              type="number"
                              value={item.quantity || 1}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 1;
                                handleItemChange(index, 'quantity', Math.max(1, val), isEdit);
                              }}
                              min="1"
                              className="w-10 text-center text-xs font-black text-zinc-100 bg-transparent border-none focus:ring-0"
                            />
                            <button
                              onClick={() => {
                                const newQty = (item.quantity || 1) + 1;
                                handleItemChange(index, 'quantity', newQty, isEdit);
                              }}
                              className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-amber-500 hover:bg-zinc-800 transition-colors rounded-md"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Subtotal</p>
                            <p className="text-sm font-black text-white font-mono">
                              ₹{itemTotal.toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-premium-base selection:bg-premium-amber-500/30 antialiased">
      <div className="mx-auto space-y-4">
        {error && (
          <div className="mx-4 mt-4 bg-red-900/10 border border-red-900/20 text-red-500 px-4 py-3 rounded-xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={18} className="flex-shrink-0" />
            <span className="font-medium">Error: {error}</span>
          </div>
        )}

        <div className="bg-premium-surface/80 sticky top-0 z-30 backdrop-blur-xl border-b border-premium-border p-4 transition-all">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            <div className="flex-1 min-w-0">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-premium-text-faint group-focus-within:text-premium-amber-500 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Search by customer name, phone, or quotation ID..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="input-premium pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl font-semibold transition-all shadow-lg ${showSearch
                  ? "bg-premium-amber-500 text-premium-base shadow-premium-amber-500/20"
                  : "bg-premium-raised text-premium-text-muted border border-premium-border hover:border-premium-amber-500/50 hover:text-premium-amber-500 shadow-black/20"
                  }`}
              >
                <Filter size={18} />
                <span>Date Range</span>
              </button>

              <button
                onClick={handleCreateClick}
                className="btn-premium-primary px-4 py-2.5 text-sm"
              >
                <Plus size={18} />
                <span>New Quotation</span>
              </button>

              {(searchTerm || (fromDate && toDate)) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center justify-center p-2.5 bg-premium-raised text-premium-text-faint border border-premium-border rounded-xl hover:text-premium-text-primary transition-colors shadow-lg shadow-black/20"
                  title="Clear Filters"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          {showSearch && (
            <div className="mt-4 p-4 bg-premium-raised/40 rounded-xl border border-premium-border animate-in fade-in slide-in-from-top-3">
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end">
                <div className="flex-1 min-w-0">
                  <label className="block text-[10px] font-black text-premium-text-faint mb-1.5 uppercase tracking-widest">From Date</label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="input-premium"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="block text-[10px] font-black text-premium-text-faint mb-1.5 uppercase tracking-widest">To Date</label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="input-premium"
                  />
                </div>
                <button
                  onClick={applyCustomDateFilter}
                  className="btn-premium-primary px-6 py-2.5 text-sm"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          <div className="mt-3 text-[10px] text-premium-text-faint font-bold flex items-center gap-2 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-premium-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span>
            Showing {filteredProducts.length} quotation{filteredProducts.length !== 1 ? 's' : ''}
            {fromDate && toDate && (
              <span>
                {" "}from <strong className="text-premium-text-muted">{new Date(fromDate).toLocaleDateString("en-IN")}</strong> to{" "}
                <strong className="text-premium-text-muted">{new Date(toDate).toLocaleDateString("en-IN")}</strong>
              </span>
            )}
          </div>
        </div>

        <div className="mx-4 lg:mx-6 mb-8 bg-premium-surface border border-premium-border rounded-2xl shadow-2xl shadow-black/40 overflow-hidden transition-all">
          {loading ? (
            <div className="text-center py-24 bg-premium-surface/20 backdrop-blur-sm">
              <div className="relative inline-block">
                <div className="w-12 h-12 rounded-full border-2 border-premium-border border-t-premium-amber-500 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-premium-amber-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]"></div>
                </div>
              </div>
              <p className="mt-4 text-[10px] text-premium-text-faint font-bold uppercase tracking-widest">Retrieving premium quotations...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-24 bg-premium-surface/20 backdrop-blur-sm">
              <div className="w-20 h-20 bg-premium-raised rounded-full flex items-center justify-center mx-auto mb-6 border border-premium-border">
                <AlertCircle className="text-premium-text-faint" size={40} />
              </div>
              <p className="text-premium-text-primary text-sm font-black uppercase tracking-widest">No quotations found</p>
              <p className="text-premium-text-faint text-[10px] mt-2 max-w-xs mx-auto font-bold uppercase tracking-tight">Try adjusting your filters or search terms to find what you're looking for.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] border-collapse">
                <thead className="bg-premium-raised border-b border-premium-border">
                  <tr>
                    <th className="px-5 py-4 text-left text-[10px] font-black text-premium-text-faint uppercase tracking-widest">Date</th>
                    <th className="px-5 py-4 text-left text-[10px] font-black text-premium-text-faint uppercase tracking-widest">Customer</th>
                    <th className="px-5 py-4 text-left text-[10px] font-black text-premium-text-faint uppercase tracking-widest">Phone</th>
                    <th className="px-5 py-4 text-center text-[10px] font-black text-premium-text-faint uppercase tracking-widest">Disc%</th>
                    <th className="px-5 py-4 text-center text-[10px] font-black text-premium-text-faint uppercase tracking-widest">Type</th>
                    <th className="px-5 py-4 text-center text-[10px] font-black text-premium-text-faint uppercase tracking-widest">GST</th>
                    <th className="px-5 py-4 text-center text-[10px] font-black text-premium-text-faint uppercase tracking-widest">Items</th>
                    <th className="px-5 py-4 text-right text-[10px] font-black text-premium-text-faint uppercase tracking-widest">Amount</th>
                    <th className="px-5 py-4 text-center text-[10px] font-black text-premium-text-faint uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-premium-border/50">
                  {filteredProducts.map((product: any) => (
                    <tr key={product._id} className="hover:bg-premium-amber-500/[0.02] transition-colors group">
                      <td className="px-5 py-4 text-sm text-premium-text-muted whitespace-nowrap font-bold font-mono italic">
                        {new Date(product.date).toLocaleDateString("en-IN", {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-premium-text-primary group-hover:text-premium-amber-500 transition-colors uppercase tracking-tight">{product.name}</span>
                          <span className="text-[10px] text-premium-text-faint font-black uppercase tracking-widest italic opacity-50">#{product._id.slice(-6).toUpperCase()}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-premium-text-muted font-bold tracking-tighter">
                        {product.number}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black ${parseFloat(product.dis) > 0
                          ? "bg-premium-amber-500/10 text-premium-amber-500 border border-premium-amber-500/20"
                          : "bg-premium-raised text-premium-text-faint border border-premium-border"
                          }`}>
                          {product.dis || 0}%
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="text-[9px] font-black text-premium-text-faint uppercase tracking-widest bg-premium-raised px-2 py-1 rounded border border-premium-border italic">
                          {product.value}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        {product.includeGst ? (
                          <span className="text-green-500/60" title="GST Included">
                            <CheckCircle2 size={16} className="mx-auto" />
                          </span>
                        ) : (
                          <span className="text-premium-text-faint opacity-30" title="GST Not Included">
                            <AlertCircle size={16} className="mx-auto" />
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-premium-text-muted">
                          <Package size={14} className="text-premium-text-faint" />
                          <span className="text-xs font-black font-mono">{product.items?.length || 0}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-black text-premium-amber-500 italic tracking-tighter drop-shadow-[0_0_8px_rgba(245,158,11,0.2)]">₹{calculateProductTotal(product).toLocaleString("en-IN")}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowViewModal(true);
                            }}
                            className="p-2 text-premium-text-faint hover:text-premium-amber-500 hover:bg-premium-amber-500/10 rounded-xl transition-all border border-transparent hover:border-premium-amber-500/20"
                            title="Quick View"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleDownloadPDF(product)}
                            className="p-2 text-premium-text-faint hover:text-green-500 hover:bg-green-500/10 rounded-xl transition-all border border-transparent hover:border-green-500/20"
                            title="Download PDF"
                          >
                            <Download size={18} />
                          </button>
                          <button
                            onClick={() => handleEditClick(product)}
                            className="p-2 text-premium-text-faint hover:text-premium-amber-500 hover:bg-premium-amber-500/10 rounded-xl transition-all border border-transparent hover:border-premium-amber-500/20"
                            title="Edit Quotation"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 text-premium-text-faint hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
                            title="Delete Quotation"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showCreateModal && (
          <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#0f0f0f] border border-zinc-800 rounded-2xl shadow-2xl max-w-4xl w-full p-6 animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh] custom-scrollbar">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
                    <Plus className="text-amber-500" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-widest text-zinc-100">Draft New Quotation</h3>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">Enter customer and item specifications</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setCreateFormData({
                      name: "",
                      number: "",
                      address: "",
                      date: new Date().toISOString().split('T')[0],
                      value: "mrp",
                      dis: 0,
                      includeGst: false,
                      items: []
                    });
                  }}
                  className="p-2 hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                {renderItemForm(createFormData, false)}
              </div>

              <div className="flex gap-4 mt-8 pt-6 border-t border-zinc-800">
                <button
                  onClick={confirmCreate}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-800 text-white py-3.5 rounded-xl font-bold hover:from-amber-700 hover:to-orange-900 transition-all shadow-lg shadow-amber-900/40 disabled:opacity-50"
                >
                  <Save size={18} />
                  {loading ? "Creating..." : "Generate Quotation"}
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setCreateFormData({
                      name: "",
                      number: "",
                      address: "",
                      date: new Date().toISOString().split('T')[0],
                      value: "mrp",
                      dis: 0,
                      includeGst: false,
                      items: []
                    });
                  }}
                  disabled={loading}
                  className="flex-1 bg-zinc-900 text-zinc-400 py-3.5 rounded-xl font-bold hover:bg-zinc-800 hover:text-white transition-all border border-zinc-800 disabled:opacity-50"
                >
                  Discard
                </button>
              </div>
            </div>
          </div>
        )}

        {showEditModal && selectedProduct && editFormData && (
          <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#0f0f0f] border border-zinc-800 rounded-2xl shadow-2xl max-w-4xl w-full p-6 animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh] custom-scrollbar">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
                    <Edit className="text-amber-500" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-widest text-zinc-100">Refine Quotation</h3>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">Modify attributes for #{selectedProduct._id.slice(-6).toUpperCase()}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedProduct(null);
                    setEditFormData(null);
                  }}
                  className="p-2 hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                {renderItemForm(editFormData, true)}
              </div>

              <div className="flex gap-4 mt-8 pt-6 border-t border-zinc-800">
                <button
                  onClick={confirmEdit}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-800 text-white py-3.5 rounded-xl font-bold hover:from-amber-700 hover:to-orange-900 transition-all shadow-lg shadow-amber-900/40 disabled:opacity-50"
                >
                  <Save size={18} />
                  {loading ? "Saving Changes..." : "Secure Updates"}
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedProduct(null);
                    setEditFormData(null);
                  }}
                  disabled={loading}
                  className="flex-1 bg-zinc-900 text-zinc-400 py-3.5 rounded-xl font-bold hover:bg-zinc-800 hover:text-white transition-all border border-zinc-800 disabled:opacity-50"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Modal */}
        {showViewModal && selectedProduct && (
          <div className="fixed inset-0 bg-zinc-950/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in transition-all" onClick={() => setShowViewModal(false)}>
            <div
              className="bg-[#0a0a0a] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-zinc-800 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gradient-to-r from-zinc-950 to-[#0f0f0f] border-b border-zinc-800 px-6 py-5 flex items-center justify-between z-20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20 shadow-lg shadow-amber-900/10">
                    <Eye className="text-amber-500" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-widest text-zinc-100 italic">Quotation Archive</h2>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Serial #{selectedProduct._id.slice(-8).toUpperCase()}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 hover:bg-zinc-800 rounded-xl transition-all text-zinc-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800/50 hover:bg-zinc-900 transition-colors group">
                    <div className="flex items-center gap-3 mb-2">
                      <User className="text-amber-500 group-hover:scale-110 transition-transform" size={16} />
                      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Customer</p>
                    </div>
                    <p className="font-bold text-zinc-200 truncate">{selectedProduct.name}</p>
                  </div>

                  <div className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800/50 hover:bg-zinc-900 transition-colors group">
                    <div className="flex items-center gap-3 mb-2">
                      <Phone className="text-amber-500 group-hover:scale-110 transition-transform" size={16} />
                      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Phone</p>
                    </div>
                    <p className="font-bold text-zinc-200 truncate">{selectedProduct.number}</p>
                  </div>

                  <div className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800/50 hover:bg-zinc-900 transition-colors group">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="text-amber-500 group-hover:scale-110 transition-transform" size={16} />
                      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Date</p>
                    </div>
                    <p className="font-bold text-zinc-200">
                      {new Date(selectedProduct.date).toLocaleDateString("en-IN", {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>

                  <div className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800/50 hover:bg-zinc-900 transition-colors group">
                    <div className="flex items-center gap-3 mb-2">
                      <DollarSign className="text-amber-500 group-hover:scale-110 transition-transform" size={16} />
                      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Price Mode</p>
                    </div>
                    <p className="font-bold text-zinc-200 uppercase tracking-wider">{selectedProduct.value}</p>
                  </div>
                </div>

                {selectedProduct.address && (
                  <div className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800/50">
                    <div className="flex items-start gap-4">
                      <MapPin className="text-amber-500 mt-1" size={16} />
                      <div>
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Destination Address</p>
                        <p className="text-zinc-300 leading-relaxed font-medium">{selectedProduct.address}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-red-950/20 rounded-2xl p-5 border border-red-900/20 relative overflow-hidden group hover:border-red-500/30 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Percent size={40} className="text-red-500" />
                    </div>
                    <p className="text-[10px] font-black text-red-900 uppercase tracking-widest mb-1 group-hover:text-red-500 transition-colors">Trade Discount</p>
                    <p className="text-3xl font-black text-red-500 font-mono tracking-tighter">{selectedProduct.dis || 0}%</p>
                  </div>
                  <div className="bg-zinc-950 rounded-2xl p-5 border border-zinc-800 relative overflow-hidden group hover:border-amber-500/30 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <CreditCard size={40} className="text-amber-500" />
                    </div>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1 group-hover:text-amber-500 transition-colors">Valuation Total</p>
                    <p className="text-3xl font-black text-amber-500 font-mono tracking-tighter">
                      ₹{calculateProductTotal(selectedProduct).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950/20">
                  <div className="bg-zinc-900/50 px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
                    <h3 className="font-black text-xs text-zinc-500 uppercase tracking-widest flex items-center gap-3">
                      <Package className="text-amber-500" size={18} />
                      Inventory Manifest ({selectedProduct.items?.length || 0})
                    </h3>
                  </div>

                  {selectedProduct.items && selectedProduct.items.length > 0 ? (
                    <div className="divide-y divide-zinc-900">
                      {selectedProduct.items.map((item: any, index: any) => {
                        const rate = selectedProduct.value === 'nrp' ? (item.nrp || 0) : (item.mrp || 0);
                        const quantity = item.quantity || 1;
                        const itemTotal = rate * quantity;

                        return (
                          <div key={index} className="p-4 group hover:bg-zinc-950 transition-colors">
                            <div className="flex gap-4">
                              {item.image && (
                                <div className="w-20 h-20 rounded-xl overflow-hidden border border-zinc-800 flex-shrink-0 group-hover:border-amber-500/30 transition-colors">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}

                              <div className="flex-1 min-w-0 pr-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="min-w-0 flex-1">
                                    <h4 className="font-black text-zinc-100 text-sm uppercase tracking-tight truncate group-hover:text-amber-500 transition-colors">{item.name}</h4>
                                    {item.description && (
                                      <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-tighter font-bold line-clamp-1">{item.description}</p>
                                    )}
                                  </div>
                                  <span className="bg-zinc-900 text-zinc-600 px-2 py-1 rounded text-[9px] font-black uppercase tracking-tighter border border-zinc-800 ml-3">
                                    Item {index + 1}
                                  </span>
                                </div>

                                <div className="flex items-center gap-4 text-xs mt-3">
                                  <div className="flex flex-col">
                                    <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1">Quantity</span>
                                    <span className="text-zinc-200 font-mono font-bold">x{quantity}</span>
                                  </div>
                                  <div className="flex flex-col border-l border-zinc-800 pl-4">
                                    <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1">Rate</span>
                                    <span className="text-zinc-200 font-mono font-bold">₹{rate.toLocaleString("en-IN")}</span>
                                  </div>
                                  <div className="flex flex-col border-l border-zinc-800 pl-4 ml-auto text-right">
                                    <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1">Total</span>
                                    <span className="text-amber-500 font-mono font-black text-sm italic tracking-tighter">₹{itemTotal.toLocaleString("en-IN")}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-16 text-center flex flex-col items-center">
                      <div className="w-20 h-20 bg-zinc-900/50 rounded-full flex items-center justify-center mb-6 border border-zinc-800">
                        <ShoppingCart className="text-zinc-700" size={40} />
                      </div>
                      <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm italic">Manifest is currently empty</p>
                    </div>
                  )}
                </div>

                <div className="bg-premium-surface/50 rounded-2xl p-4 sm:p-5 border border-premium-border space-y-3">
                  {(() => {
                    const itemsTotal = (selectedProduct.items || []).reduce((sum: any, item: any) => {
                      const price = selectedProduct.value === 'nrp' ? (item.nrp || 0) : (item.mrp || 0);
                      const quantity = item.quantity || 1;
                      return sum + (quantity * price);
                    }, 0);
                    const discountPercent = parseFloat(selectedProduct.dis) || 0;
                    const discountAmount = (itemsTotal * discountPercent) / 100;
                    const taxable = itemsTotal - discountAmount;
                    const includeGst = selectedProduct.includeGst === true;
                    const gst = includeGst ? taxable * 0.18 : 0;
                    const grandTotal = taxable + gst;

                    return (
                      <>
                        <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-premium-text-faint">
                          <span>Subtotal Base</span>
                          <span className="text-premium-text-muted font-mono">₹{itemsTotal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
                        </div>
                        {discountPercent > 0 && (
                          <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-red-900">
                            <span>Strategic Discount ({discountPercent}%)</span>
                            <span className="text-red-500 font-mono">-₹{discountAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-premium-text-faint">
                          <span>Taxable Valuation</span>
                          <span className="text-premium-text-muted font-mono">₹{taxable.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
                        </div>
                        {includeGst && (
                          <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-green-900">
                            <span>GST Protocol (18%)</span>
                            <span className="text-green-500/80 font-mono">₹{gst.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
                          </div>
                        )}
                        <div className="pt-4 mt-2 border-t border-premium-border flex justify-between items-center">
                          <span className="font-black text-premium-text-primary uppercase tracking-[0.2em] text-[11px] italic">Grand Valuation</span>
                          <span className="font-black text-3xl text-premium-amber-500 drop-shadow-[0_0_20px_rgba(245,158,11,0.4)] font-mono tracking-tighter italic">
                            ₹{grandTotal.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      handleEditClick(selectedProduct);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-premium-raised text-premium-text-muted py-3.5 text-xs rounded-xl hover:bg-premium-surface hover:text-premium-amber-500 transition-all font-black uppercase tracking-widest border border-premium-border shadow-xl active:scale-[0.98]"
                  >
                    <Edit size={18} />
                    Edit Quotation
                  </button>
                  <button
                    onClick={() => handleDownloadPDF(selectedProduct)}
                    className="flex-1 flex items-center justify-center gap-2 btn-premium-primary py-3.5 text-xs rounded-xl font-black uppercase tracking-widest shadow-2xl active:scale-[0.98]"
                  >
                    <Download size={18} />
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && selectedProduct && (
          <div className="fixed inset-0 bg-premium-base/90 backdrop-blur-md flex items-center justify-center z-[110] p-4 animate-in fade-in">
            <div className="bg-premium-surface border border-premium-border rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-200">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-20 h-20 bg-red-950/20 border border-red-900/30 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-red-900/20">
                  <AlertCircle className="text-red-500" size={36} />
                </div>
                <h3 className="text-xl font-black text-premium-text-primary uppercase tracking-[0.2em] italic">De-Authorize Record</h3>
                <p className="text-premium-text-faint mt-3 text-xs font-bold leading-relaxed uppercase tracking-tight">Are you sure you want to permanently remove the quotation for <strong className="text-premium-text-muted">{selectedProduct.name}</strong>?<br />This protocol is irreversible.</p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedProduct(null);
                  }}
                  disabled={loading}
                  className="flex-1 bg-premium-raised text-premium-text-faint py-3.5 text-[10px] rounded-xl font-black uppercase tracking-widest hover:bg-premium-surface hover:text-premium-text-primary transition-all border border-premium-border disabled:opacity-50"
                >
                  Terminate Action
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-900 text-white py-3.5 text-[10px] rounded-xl font-black uppercase tracking-widest hover:from-red-700 hover:to-red-950 transition-all shadow-xl shadow-red-900/40 disabled:opacity-50 active:scale-[0.98]"
                >
                  {loading ? "Processing..." : "Confirm Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {showItemSelector && (
          <div className="fixed inset-0 bg-premium-base/90 backdrop-blur-md flex items-center justify-center z-[120] p-4 animate-in fade-in">
            <div className="bg-premium-surface border border-premium-border rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between p-5 border-b border-premium-border bg-gradient-to-r from-premium-surface to-premium-base text-premium-text-primary">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-premium-amber-500/10 rounded-xl flex items-center justify-center border border-premium-amber-500/20 shadow-lg shadow-premium-amber-500/10">
                    <Package className="text-premium-amber-500" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-[0.2em] italic">Select Premium Item</h3>
                    <p className="text-[10px] text-premium-text-faint font-bold uppercase tracking-widest mt-0.5">Browse and add products to active session</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowItemSelector(false);
                    setItemSearchTerm("");
                  }}
                  className="p-2.5 hover:bg-premium-raised rounded-xl transition-all text-premium-text-faint hover:text-premium-text-primary border border-transparent hover:border-premium-border"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-5 border-b border-premium-border bg-premium-base/30">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-premium-text-faint group-focus-within:text-premium-amber-500 transition-colors" size={20} />
                  <input
                    type="text"
                    placeholder="Identify items by name, narrative or secure identifier..."
                    value={itemSearchTerm}
                    onChange={(e) => setItemSearchTerm(e.target.value)}
                    className="input-premium pl-12 py-3"
                    autoFocus
                  />
                </div>
              </div>

              <div className="p-4 overflow-y-auto max-h-[calc(90vh-180px)] bg-premium-obsidian/40 custom-scrollbar">
                {filteredAvailableItems.length === 0 ? (
                  <div className="text-center py-20 flex flex-col items-center">
                    <div className="w-16 h-16 bg-zinc-900/50 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
                      <AlertCircle className="text-zinc-600" size={32} />
                    </div>
                    <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm">
                      {availableItems.length === 0 ? "Inventory Empty" : "No matches found"}
                    </p>
                    <p className="text-zinc-600 text-xs mt-2 uppercase tracking-tight">Try refining your search vocabulary</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAvailableItems.map((item: any) => (
                      <div
                        key={item._id}
                        className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-4 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-900/10 transition-all cursor-pointer group relative overflow-hidden"
                        onClick={() => addItemToQuotation(item, !isCreateMode)}
                      >
                        <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <div className="w-8 h-8 bg-amber-500 text-zinc-950 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <Plus size={18} />
                          </div>
                        </div>
                        {item.image && (
                          <div className="relative overflow-hidden rounded-xl mb-4 border border-zinc-800 group-hover:border-amber-500/30 transition-colors h-40">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent"></div>
                          </div>
                        )}
                        <div className="space-y-2">
                          <h4 className="font-black text-zinc-100 text-sm uppercase tracking-tight group-hover:text-amber-500 transition-colors truncate">{item.name}</h4>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-tighter font-bold line-clamp-2 h-7">{item.description}</p>
                          <div className="pt-2 flex items-center justify-between border-t border-zinc-800/50">
                            <span className="text-xs font-black text-amber-500 font-mono tracking-tighter italic">₹{item.mrp?.toLocaleString("en-IN")}</span>
                            <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest group-hover:text-zinc-400 transition-colors">Add to Cart</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;