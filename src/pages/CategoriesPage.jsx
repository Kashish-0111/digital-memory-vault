import { useState } from 'react';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { generateId } from '../utils/helpers.js';
import Modal from '../components/common/Modal.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import GlassCard from '../components/common/GlassCard.jsx';

const EMOJI_OPTIONS = ['📁','💼','👤','❤️','💡','💰','🏠','📚','🎯','✈️','🎂','🔔','⭐','🎮','🏋️'];
const COLOR_OPTIONS = [
  '#3b82f6','#ec4899','#8b5cf6','#10b981','#f59e0b',
  '#ef4444','#06b6d4','#84cc16','#f97316','#6366f1',
];

export default function CategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [form, setForm] = useState({ name: '', color: COLOR_OPTIONS[0], icon: EMOJI_OPTIONS[0] });
  const [error, setError] = useState('');

  const openAdd = () => {
    setEditingCat(null);
    setForm({ name: '', color: COLOR_OPTIONS[0], icon: EMOJI_OPTIONS[0] });
    setError('');
    setIsModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditingCat(cat);
    setForm({ name: cat.name, color: cat.color, icon: cat.icon });
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Category name is required'); return; }
    const duplicate = categories.find(
      (c) => c.name.toLowerCase() === form.name.trim().toLowerCase() && c.id !== editingCat?.id
    );
    if (duplicate) { setError('A category with this name already exists'); return; }

    if (editingCat) {
      updateCategory(editingCat.id, { name: form.name.trim(), color: form.color, icon: form.icon });
    } else {
      addCategory({ id: generateId(), name: form.name.trim(), color: form.color, icon: form.icon });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this category?')) {
      deleteCategory(id);
    }
  };

  return (
    <div className="page-container max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Categories</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{categories.length} categories</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Category
        </button>
      </div>

      {categories.length === 0 ? (
        <EmptyState
          icon={<Tag className="w-16 h-16 text-gray-300 dark:text-gray-600" />}
          title="No categories yet"
          description="Create categories to organize your notes."
          action={<button onClick={openAdd} className="btn-primary flex items-center gap-2 mx-auto"><Plus className="w-4 h-4" />Add Category</button>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <GlassCard key={cat.id} className="p-5 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md"
                  style={{ backgroundColor: cat.color + '22', border: `2px solid ${cat.color}44` }}
                >
                  {cat.icon}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{cat.name}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-xs text-gray-400 font-mono">{cat.color}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(cat)} className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(cat.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCat ? 'Edit Category' : 'New Category'}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <input
              className="input-field"
              placeholder="e.g. Travel, Health, Goals..."
              value={form.name}
              onChange={(e) => { setForm({ ...form, name: e.target.value }); setError(''); }}
              autoFocus
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Icon</label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((em) => (
                <button type="button" key={em} onClick={() => setForm({ ...form, icon: em })}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                    form.icon === em ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/30 scale-110' : 'bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700'
                  }`}
                >{em}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button type="button" key={c} onClick={() => setForm({ ...form, color: c })}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${form.color === c ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: form.color + '22' }}>{form.icon}</div>
            <span className="font-medium text-gray-900 dark:text-white">{form.name || 'Preview'}</span>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{editingCat ? 'Save Changes' : 'Create Category'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
