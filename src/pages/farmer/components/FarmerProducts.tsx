import { useState } from "react";
import { X, Plus, Loader2, Image } from "lucide-react";
import { useMyProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/useApi";

type ProductStatus = "Available" | "Low Stock" | "Out of Stock";
type Quality = "Standard" | "Premium" | "Organic";

const categories = ["Vegetables", "Fruits", "Grains", "Dairy", "Other"];
const units = ["Gram", "KG", "Litre", "Quintal"];
const qualities: Quality[] = ["Standard", "Premium", "Organic"];

function statusBadge(status: string) {
  const styles: Record<string, string> = {
    Available: "bg-gradient-to-r from-green-500 to-emerald-600 text-white",
    "Low Stock": "bg-gradient-to-r from-yellow-400 to-orange-500 text-white",
    "Out of Stock": "bg-gradient-to-r from-red-500 to-rose-600 text-white",
  };
  return (
    <span className={`px-3 py-1 text-xs rounded-full font-semibold ${styles[status] || styles["Available"]}`}>
      {status}
    </span>
  );
}

function qualityBadge(quality: string) {
  const styles: Record<string, string> = {
    Standard: "bg-gray-100 text-gray-700 border border-gray-300",
    Premium: "bg-purple-100 text-purple-700 border border-purple-300",
    Organic: "bg-green-100 text-green-700 border border-green-300",
  };
  return (
    <span className={`px-2 py-1 text-xs rounded-md font-medium ${styles[quality] || styles["Standard"]}`}>
      {quality}
    </span>
  );
}

export default function FarmerProducts() {
  const { data: products, isLoading } = useMyProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [customCategory, setCustomCategory] = useState("");
  const [form, setForm] = useState({
    name: "", 
    category: "", 
    quantity: "", 
    unit: "KG", 
    price: "", 
    status: "Available" as ProductStatus,
    description: "",
    quality: "Standard" as Quality,
    imageUrl: "",
    isOrganic: false,
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const category = form.category === "Other" ? customCategory : form.category;
    const productData = {
      name: form.name,
      category,
      quantity: Number(form.quantity),
      unit: form.unit,
      price: parseFloat(form.price.replace(/[₹/kg]/g, "")),
      status: form.status.toLowerCase(),
      description: form.description,
      quality: form.quality,
      imageUrl: form.imageUrl,
      isOrganic: form.isOrganic,
    };

    if (editingId) {
      await updateProduct.mutateAsync({ id: editingId, data: productData });
    } else {
      await createProduct.mutateAsync(productData);
    }
    setOpen(false);
    setEditingId(null);
    setForm({ 
      name: "", 
      category: "", 
      quantity: "", 
      unit: "KG", 
      price: "", 
      status: "Available",
      description: "",
      quality: "Standard",
      imageUrl: "",
      isOrganic: false,
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this product?")) {
      await deleteProduct.mutateAsync(id);
    }
  };

  const handleEdit = (product: any) => {
    setForm({
      name: product.name,
      category: product.category,
      quantity: product.availableQuantity || product.quantity,
      unit: product.unit || "KG",
      price: `₹${product.pricePerUnit || product.price}/${product.unit || "kg"}`,
      status: product.isAvailable !== false ? "Available" : "Out of Stock",
      description: product.description || "",
      quality: product.quality || "Standard",
      imageUrl: product.imageUrl || "",
      isOrganic: product.isOrganic || false,
    });
    setEditingId(product._id);
    setOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
        <span className="ml-2">Loading products...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-gradient-to-r from-green-600 to-emerald-500 p-6 rounded-2xl text-white shadow">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Product Management</h1>
          <p className="text-sm">Manage your agricultural products and stock</p>
        </div>
        <button
          onClick={() => { 
            setOpen(true); 
            setEditingId(null); 
            setForm({ 
              name: "", 
              category: "", 
              quantity: "", 
              unit: "KG", 
              price: "", 
              status: "Available",
              description: "",
              quality: "Standard",
              imageUrl: "",
              isOrganic: false,
            }); 
          }}
          className="flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-105 transition"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="bg-white border rounded-xl shadow-lg overflow-x-auto w-full">
        <table className="w-full min-w-[1100px]">
          <thead className="bg-gradient-to-r from-green-50 to-emerald-50">
            <tr>
              {["Name", "Category", "Stock", "Price", "Quality", "Organic", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(products || []).map((p: any) => (
              <tr key={p._id} className="border-t hover:bg-green-50 transition">
                <td className="px-6 py-4 font-medium whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {p.imageUrl && (
                      <img src={p.imageUrl} alt={p.name} className="w-8 h-8 object-cover rounded" />
                    )}
                    <span>{p.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{p.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">{p.availableQuantity || p.quantity} {p.unit}</td>
                <td className="px-6 py-4 font-semibold text-green-700 whitespace-nowrap">₹{p.pricePerUnit || p.price}/{p.unit}</td>
                <td className="px-6 py-4 whitespace-nowrap">{qualityBadge(p.quality || "Standard")}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {p.isOrganic ? (
                    <span className="px-2 py-1 text-xs rounded-md font-medium bg-green-100 text-green-700 border border-green-300">
                      Organic
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded-md font-medium bg-gray-100 text-gray-500 border border-gray-200">
                      No
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{statusBadge(p.isAvailable !== false ? "Available" : "Out of Stock")}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-nowrap gap-2">
                    <button onClick={() => handleEdit(p)} className="px-3 py-1 text-xs rounded-md text-white bg-blue-600 hover:bg-blue-700 whitespace-nowrap">Edit</button>
                    <button onClick={() => handleDelete(p._id)} className="px-3 py-1 text-xs rounded-md text-white bg-red-600 hover:bg-red-700 whitespace-nowrap">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {(!products || products.length === 0) && (
              <tr><td colSpan={8} className="px-6 py-8 text-center text-gray-400">No products yet. Add your first product!</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative shadow-xl max-h-[90vh] overflow-y-auto">
            <button onClick={() => setOpen(false)} className="absolute right-4 top-4 text-gray-500"><X size={18} /></button>
            <h3 className="text-lg font-semibold mb-4">{editingId ? "Edit Product" : "Add Product"}</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="name" value={form.name} placeholder="Product Name *" onChange={handleChange} className="border rounded-lg px-4 py-2" required />
              <select name="category" value={form.category} onChange={handleChange} className="border rounded-lg px-4 py-2" required>
                <option value="">Select Category *</option>
                {categories.map((c) => (<option key={c}>{c}</option>))}
              </select>
              {form.category === "Other" && (
                <input placeholder="Add Category" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} className="border rounded-lg px-4 py-2 md:col-span-2" />
              )}
              <input name="quantity" value={form.quantity} type="number" placeholder="Quantity *" onChange={handleChange} className="border rounded-lg px-4 py-2" required />
              <select name="unit" value={form.unit} onChange={handleChange} className="border rounded-lg px-4 py-2">
                {units.map((u) => (<option key={u}>{u}</option>))}
              </select>
              <input name="price" value={form.price} placeholder="Price (₹) *" onChange={handleChange} className="border rounded-lg px-4 py-2" required />
              <select name="quality" value={form.quality} onChange={handleChange} className="border rounded-lg px-4 py-2">
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
                <option value="Organic">Organic</option>
              </select>
              <div className="md:col-span-2">
                <textarea name="description" value={form.description} placeholder="Description" onChange={handleChange} className="border rounded-lg px-4 py-2 w-full" rows={3} />
              </div>
              <div className="md:col-span-2 flex items-center gap-2">
                <input 
                  type="checkbox" 
                  name="isOrganic" 
                  checked={form.isOrganic} 
                  onChange={handleChange} 
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="isOrganic" className="text-sm font-medium text-gray-700">
                  Organic Product
                </label>
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <Image size={16} className="text-gray-400" />
                  <label className="text-sm font-medium text-gray-700">Image URL (Optional)</label>
                </div>
                <input 
                  name="imageUrl" 
                  value={form.imageUrl} 
                  placeholder="https://example.com/image.jpg" 
                  onChange={handleChange} 
                  className="border rounded-lg px-4 py-2 w-full" 
                />
                {form.imageUrl && (
                  <div className="mt-2">
                    <img src={form.imageUrl} alt="Preview" className="w-20 h-20 object-cover rounded border" />
                  </div>
                )}
              </div>
              <div className="md:col-span-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createProduct.isPending || updateProduct.isPending}
                  className="px-6 py-2 rounded-lg text-white bg-gradient-to-r from-green-600 to-emerald-500 disabled:opacity-50"
                >
                  {(createProduct.isPending || updateProduct.isPending) ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
