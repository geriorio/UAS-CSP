'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  nama_produk: string;
  harga_satuan: number;
  quantity: number;
}

interface Props {
  products: Product[];
  role: 'admin' | 'user';
  onRefresh: () => void;
}

export default function ProductTable({ products, role, onRefresh }: Props) {
  const [edited, setEdited] = useState<Record<string, Partial<Product>>>({});
  const [newProduct, setNewProduct] = useState({
    nama_produk: '',
    harga_satuan: '',
    quantity: ''
  });

  // CREATE
  const handleNewChange = (field: string, value: string) => {
    setNewProduct(prev => ({ ...prev, [field]: value }));
  };

  const handleCreate = async () => {
    if (!newProduct.nama_produk || !newProduct.harga_satuan || !newProduct.quantity) {
      toast.error('Semua field harus diisi!');
      return;
    }

    const { error } = await supabase.from('products').insert({
      nama_produk: newProduct.nama_produk,
      harga_satuan: Number(newProduct.harga_satuan),
      quantity: Number(newProduct.quantity)
    });

    if (error) {
      console.error('Create Error:', error.message);
      toast.error('❌ Gagal menambahkan produk');
    } else {
      toast.success('✅ Produk berhasil ditambahkan');
      setNewProduct({ nama_produk: '', harga_satuan: '', quantity: '' });
      onRefresh();
    }
  };

  // DELETE
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      console.error('Delete Error:', error.message);
      toast.error('❌ Gagal menghapus produk');
    } else {
      toast.success('🗑️ Produk berhasil dihapus');
      onRefresh();
    }
  };

  // UPDATE
  const handleChange = (id: string, field: keyof Product, value: string | number) => {
    setEdited(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const handleUpdate = async (id: string) => {
    const updated = edited[id];
    if (!updated) return;

    const { error } = await supabase.from('products').update(updated).eq('id', id);

    if (error) {
      console.error('Update Error:', error.message);
      toast.error('❌ Gagal memperbarui produk');
    } else {
      toast.success('✅ Perubahan berhasil disimpan');
      onRefresh();
    }
  };

  return (
    <div className="p-4 bg-gray-100">
      {role === 'admin' && (
        <div className="mb-6 p-4 border rounded bg-white shadow">
          <h2 className="text-lg font-semibold mb-3">Tambah Produk Baru</h2>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            <input
              type="text"
              placeholder="Nama Produk"
              className="border px-3 py-2 rounded w-full sm:w-auto"
              value={newProduct.nama_produk}
              onChange={(e) => handleNewChange('nama_produk', e.target.value)}
            />
            <input
              type="number"
              placeholder="Harga Satuan"
              className="border px-3 py-2 rounded w-full sm:w-auto"
              value={newProduct.harga_satuan}
              onChange={(e) => handleNewChange('harga_satuan', e.target.value)}
            />
            <input
              type="number"
              placeholder="Quantity"
              className="border px-3 py-2 rounded w-full sm:w-auto"
              value={newProduct.quantity}
              onChange={(e) => handleNewChange('quantity', e.target.value)}
            />
            <button
              onClick={handleCreate}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
            >
              Tambah
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-max w-full text-sm text-left border-collapse bg-white rounded shadow">
          <thead className="bg-blue-100 text-gray-800">
            <tr>
              <th className="px-4 py-2 border">Nama Produk</th>
              <th className="px-4 py-2 border">Harga Satuan</th>
              <th className="px-4 py-2 border">Quantity</th>
              {role === 'admin' && <th className="px-4 py-2 border text-center">Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const idStr = p.id.toString();
              return (
                <tr key={idStr} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2 border">
                    {role === 'admin' ? (
                      <input
                        className="border px-2 py-1 w-full rounded"
                        value={edited[idStr]?.nama_produk ?? p.nama_produk}
                        onChange={(e) => handleChange(idStr, 'nama_produk', e.target.value)}
                      />
                    ) : p.nama_produk}
                  </td>
                  <td className="px-4 py-2 border">
                    {role === 'admin' ? (
                      <input
                        type="number"
                        className="border px-2 py-1 w-full rounded"
                        value={edited[idStr]?.harga_satuan ?? p.harga_satuan}
                        onChange={(e) => handleChange(idStr, 'harga_satuan', Number(e.target.value))}
                      />
                    ) : p.harga_satuan}
                  </td>
                  <td className="px-4 py-2 border">
                    {role === 'admin' ? (
                      <input
                        type="number"
                        className="border px-2 py-1 w-full rounded"
                        value={edited[idStr]?.quantity ?? p.quantity}
                        onChange={(e) => handleChange(idStr, 'quantity', Number(e.target.value))}
                      />
                    ) : p.quantity}
                  </td>
                  {role === 'admin' && (
                    <td className="px-4 py-2 border text-center space-y-1 sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={() => handleUpdate(idStr)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 w-full sm:w-auto"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => handleDelete(idStr)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 w-full sm:w-auto"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
