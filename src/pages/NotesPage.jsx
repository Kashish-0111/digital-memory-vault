import { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Pin,
  Lock,
  Unlock,
  Trash2,
  Edit3,
  Mic,
  MicOff,
  Tag,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { notesActions } from '../reducers/notesReducer.js';
import { useVoiceInput } from '../hooks/useVoiceInput.js';
import { formatDate } from '../utils/helpers.js';
import GlassCard from '../components/common/GlassCard.jsx';
import Modal from '../components/common/Modal.jsx';
import EmptyState from '../components/common/EmptyState.jsx';

export default function NotesPage() {
  const { notes, categories } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
  });
  const [showPrivate, setShowPrivate] = useState({});
  const { isListening, transcript, error, startListening, stopListening, resetTranscript, isSupported } =
    useVoiceInput();

  const filteredNotes = useMemo(() => {
    let result = [...notes.state.notes];

    if (notes.state.searchQuery) {
      const q = notes.state.searchQuery.toLowerCase();
      result = result.filter(
        (note) =>
          note.title.toLowerCase().includes(q) ||
          note.description.toLowerCase().includes(q) ||
          note.tags?.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    if (notes.state.filterCategory !== 'All') {
      result = result.filter((note) => note.category === notes.state.filterCategory);
    }

    result.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    return result;
  }, [
    notes.state.notes,
    notes.state.searchQuery,
    notes.state.filterCategory,
  ]);

  const openAddModal = () => {
    setEditingNote(null);
    setFormData({
      title: '',
      description: '',
      category: categories[0]?.name || '',
      tags: '',
    });
    setShowModal(true);
  };

  const openEditModal = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      description: note.description,
      category: note.category,
      tags: note.tags?.join(', ') || '',
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      tags: formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    if (editingNote) {
      notes.dispatch({
        type: notesActions.UPDATE_NOTE,
        payload: { id: editingNote.id, data },
      });
    } else {
      notes.dispatch({ type: notesActions.ADD_NOTE, payload: data });
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      notes.dispatch({ type: notesActions.DELETE_NOTE, payload: id });
    }
  };

  const togglePrivate = (id) => {
    notes.dispatch({ type: notesActions.TOGGLE_PRIVATE, payload: id });
  };

  const togglePin = (id) => {
    notes.dispatch({ type: notesActions.TOGGLE_PIN, payload: id });
  };

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
      setFormData((prev) => ({ ...prev, description: prev.description + ' ' + transcript }));
      resetTranscript();
    } else {
      resetTranscript();
      startListening();
    }
  };

  return (
    <div className="page-container space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Memory Notes</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {notes.state.notes.length} notes saved
          </p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center gap-2 self-start">
          <Plus className="w-5 h-5" />
          Add Note
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={notes.state.searchQuery}
            onChange={(e) =>
              notes.dispatch({ type: notesActions.SET_SEARCH, payload: e.target.value })
            }
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={notes.state.filterCategory}
            onChange={(e) =>
              notes.dispatch({ type: notesActions.SET_FILTER, payload: e.target.value })
            }
            className="pl-10 pr-8 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-none appearance-none cursor-pointer transition-all"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredNotes.length === 0 ? (
        <EmptyState
          icon={<Tag className="w-12 h-12 text-gray-400" />}
          title="No notes found"
          description={notes.state.notes.length === 0 ? 'Add your first memory note!' : 'Try adjusting your search or filters'}
          action={notes.state.notes.length === 0 ? (
            <button onClick={openAddModal} className="btn-primary flex items-center gap-2 mx-auto">
              <Plus className="w-4 h-4" /> Add Note
            </button>
          ) : null}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <GlassCard
              key={note.id}
              className={`p-5 relative group hover:scale-[1.02] transition-transform ${
                note.isPinned ? 'border-primary-300 dark:border-primary-700 ring-1 ring-primary-200 dark:ring-primary-800' : ''
              }`}
            >
              {note.isPinned && (
                <Pin className="absolute top-3 right-3 w-4 h-4 text-primary-500 fill-primary-500" />
              )}
              <div className="flex items-start justify-between mb-3 pr-6">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {note.isPrivate && !showPrivate[note.id] ? 'Private Note' : note.title}
                  </h3>
                  <span className="text-xs text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded-full">
                    {note.category}
                  </span>
                </div>
              </div>

              <div className="mb-3">
                {note.isPrivate && !showPrivate[note.id] ? (
                  <p className="text-sm text-gray-400 italic flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Content hidden
                  </p>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                    {note.description}
                  </p>
                )}
              </div>

              {note.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700">
                <span className="text-xs text-gray-400">{formatDate(note.updatedAt)}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => togglePin(note.id)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 hover:text-primary-500 transition-colors"
                    title={note.isPinned ? 'Unpin' : 'Pin'}
                  >
                    <Pin className={`w-4 h-4 ${note.isPinned ? 'fill-primary-500 text-primary-500' : ''}`} />
                  </button>
                  <button
                    onClick={() => togglePrivate(note.id)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 hover:text-primary-500 transition-colors"
                    title={note.isPrivate ? 'Make public' : 'Make private'}
                  >
                    {note.isPrivate ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => openEditModal(note)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 hover:text-primary-500 transition-colors"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
<button
                    onClick={() => handleDelete(note.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                </div>

              {note.isPrivate && (
                <button
                  onClick={() =>
                    setShowPrivate((prev) => ({ ...prev, [note.id]: !prev[note.id] }))
                  }
                  className="mt-2 text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                >
                  {showPrivate[note.id] ? (
                    <>
                      <Lock className="w-3 h-3" /> Hide content
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3 h-3" /> View content
                    </>
                  )}
                </button>
              )}
            </GlassCard>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingNote ? 'Edit Note' : 'Add Note'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field"
              placeholder="Enter note title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
              {isSupported && (
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  className={`ml-2 inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors ${
                    isListening
                      ? 'bg-red-100 text-red-600 dark:bg-red-900/30'
                      : 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-400'
                  }`}
                >
                  {isListening ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                  {isListening ? 'Stop' : 'Voice'}
                </button>
              )}
            </label>
            <textarea
              required
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field resize-none"
              placeholder="Write your memory..."
            />
            {isListening && transcript && (
              <p className="text-xs text-primary-600 dark:text-primary-400 mt-1 italic">Listening: {transcript}</p>
            )}
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input-field"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="input-field"
              placeholder="personal, idea, important..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingNote ? 'Update' : 'Add'} Note
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
