import React, { useState, useEffect } from "react";
import { Upload, PlusCircle, Trash2 } from "lucide-react";
import { showSuccess, showError, showWarning } from '../utils/sweetalert';
let userString = localStorage.getItem("user");
let user = typeof userString === 'string' ? JSON.parse(userString) : null;
const API_URL = `${process.env.REACT_APP_API_BASE_URL}/api/items?userId=${user?.id}`; // ✅ backend endpoint

export default function AddSearchItem() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    nrp: "",
    mrp: "",
    image: null as File | null,
  });
  const [preview, setPreview] = useState<string | null>(null);

  // 🧾 Fetch all items from backend
  const fetchItems = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // 🧩 Handle text field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🖼️ Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  // ➕ Add new item (multipart/form-data)
  const handleAddItem = async () => {
    if (!form.name || !form.description || !form.nrp || !form.mrp) {
      showWarning('Incomplete Data', 'Provisioning requires all mandatory fields to be populated.');
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("nrp", form.nrp);
    formData.append("mrp", form.mrp);
    formData.append("userId", user?.id || '');
    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setItems((prev) => [...prev, data.item]);
        showSuccess('Item Registered', 'New catalog entry successfully synchronized.');
        setForm({ name: "", description: "", nrp: "", mrp: "", image: null });
        setPreview(null);
      } else {
        showError('Registration Rejected', data.message || "Central protocol denied item registration.");
      }
    } catch (error) {
      console.error("Error adding item:", error);
      showError('Matrix Overflow', 'Resource collision detected. Error adding item to matrix.');
    }
  };

  // ❌ Delete item
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item._id !== id));
        showSuccess('Resource Purged', 'Item successfully removed from catalog.');
      } else {
        showError('Purge Denied', 'Central authority denied resource deletion.');
      }
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  // 🧱 UI
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="px-6 py-4 flex justify-between items-center backdrop-blur-xl shadow-md" style={{ background: "var(--premium-surface)", borderBottom: "1px solid var(--premium-border)" }}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-800 flex items-center justify-center shadow-lg shadow-amber-900/20 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect width="7" height="7" x="3" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="14" rx="1" />
              <rect width="7" height="7" x="3" y="14" rx="1" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">QUAN<span className="text-amber-500">TILE</span></span>
        </div>
        <h2 className="text-lg font-semibold text-white">Search Item Add</h2>
      </header>

      <main className="flex-1 p-6 flex flex-col items-center">
        {/* Add Item Form */}
        <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-3xl">
          <h1 className="text-2xl font-bold text-center text-red-800 mb-6">
            Add New Item
          </h1>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Item Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter item name"
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter item description"
                rows={3}
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-red-500 outline-none"
              ></textarea>
            </div>

            {/* NRP & MRP */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  NRP
                </label>
                <input
                  type="number"
                  name="nrp"
                  value={form.nrp}
                  onChange={handleChange}
                  placeholder="Enter NRP"
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  MRP
                </label>
                <input
                  type="number"
                  name="mrp"
                  value={form.mrp}
                  onChange={handleChange}
                  placeholder="Enter MRP"
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Upload Image
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center px-4 py-2 bg-red-700 text-white rounded-md cursor-pointer hover:bg-red-800">
                  <Upload className="mr-2" size={20} /> Upload
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-16 w-16 rounded-md border object-cover"
                  />
                )}
              </div>
            </div>

            {/* Add Button */}
            <div className="flex justify-center">
              <button
                onClick={handleAddItem}
                className="flex items-center space-x-2 bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-all"
              >
                <PlusCircle size={20} />
                <span>Add Item</span>
              </button>
            </div>
          </div>
        </div>

        {/* Items Table */}
        {items.length > 0 && (
          <div className="bg-white mt-10 p-6 rounded-2xl shadow-md w-full max-w-5xl">
            <h2 className="text-xl font-semibold text-center text-red-800 mb-4">
              Added Items
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-red-800 text-white">
                  <tr>
                    <th className="p-2 border">Image</th>
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Description</th>
                    <th className="p-2 border">NRP</th>
                    <th className="p-2 border">MRP</th>
                    <th className="p-2 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-red-50 text-center transition-all"
                    >
                      <td className="p-2 border">
                        {item.image ? (
                          <img
                            src={
                              item.image.startsWith("http")
                                ? item.image
                                : `${process.env.REACT_APP_API_BASE_URL}${item.image}`
                            }
                            alt={item.name}
                            className="h-12 w-12 object-cover rounded-md mx-auto"
                          />
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="p-2 border font-semibold">{item.name}</td>
                      <td className="p-2 border text-sm">{item.description}</td>
                      <td className="p-2 border">{item.nrp}</td>
                      <td className="p-2 border">{item.mrp}</td>
                      <td className="p-2 border">
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-700 hover:text-red-900 transition"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-800 text-white text-center py-4 text-sm">
        &copy; {new Date().getFullYear()} Quantile. All Rights Reserved.
      </footer>
    </div>
  );
}
