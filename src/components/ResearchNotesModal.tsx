import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Link, 
  Lightbulb,
  BookOpen,
  Search
} from 'lucide-react';
import { ResearchNote } from '../types';

interface ResearchNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: ResearchNote[];
  onUpdateNotes: (notes: ResearchNote[]) => void;
}

export const ResearchNotesModal: React.FC<ResearchNotesModalProps> = ({
  isOpen,
  onClose,
  notes,
  onUpdateNotes,
}) => {
  const [localNotes, setLocalNotes] = useState<ResearchNote[]>(notes);
  const [selectedNote, setSelectedNote] = useState<ResearchNote | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

  if (!isOpen) return null;

  const categories = ['research', 'ideas', 'characters', 'worldbuilding', 'plot', 'general'];
  
  const filteredNotes = localNotes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSave = () => {
    onUpdateNotes(localNotes);
    onClose();
  };

  const handleAddNote = () => {
    const newNote: ResearchNote = {
      id: crypto.randomUUID(),
      title: 'New Note',
      content: '',
      category: 'general',
      tags: [],
      links: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setLocalNotes(prev => [...prev, newNote]);
    setSelectedNote(newNote);
    setIsEditing(true);
  };

  const handleUpdateNote = (updatedNote: ResearchNote) => {
    setLocalNotes(prev => prev.map(note => 
      note.id === updatedNote.id 
        ? { ...updatedNote, updatedAt: new Date().toISOString() }
        : note
    ));
    setSelectedNote(updatedNote);
  };

  const handleDeleteNote = (noteId: string) => {
    setLocalNotes(prev => prev.filter(note => note.id !== noteId));
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
      setIsEditing(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'research': return <Search className="w-4 h-4" />;
      case 'ideas': return <Lightbulb className="w-4 h-4" />;
      case 'characters': return <BookOpen className="w-4 h-4" />;
      case 'worldbuilding': return <FileText className="w-4 h-4" />;
      case 'plot': return <Edit3 className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'research': return 'bg-blue-100 text-blue-800';
      case 'ideas': return 'bg-yellow-100 text-yellow-800';
      case 'characters': return 'bg-green-100 text-green-800';
      case 'worldbuilding': return 'bg-purple-100 text-purple-800';
      case 'plot': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] overflow-hidden flex">
        {/* Sidebar */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-500" />
              Research & Notes
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search and Filter */}
          <div className="p-4 border-b border-gray-100 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {filteredNotes.map(note => (
                <div
                  key={note.id}
                  onClick={() => {
                    setSelectedNote(note);
                    setIsEditing(false);
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedNote?.id === note.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 truncate flex-1">
                      {note.title}
                    </h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(note.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(note.category)}`}>
                      {getCategoryIcon(note.category)}
                      {note.category}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {note.content || 'No content yet...'}
                  </p>
                  
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {note.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                      {note.tags.length > 3 && (
                        <span className="text-gray-500 text-xs">+{note.tags.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Add Note Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleAddNote}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Note
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {selectedNote ? (
            <>
              {/* Note Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={selectedNote.title}
                      onChange={(e) => handleUpdateNote({ ...selectedNote, title: e.target.value })}
                      className="text-xl font-bold text-gray-900 bg-transparent border-none outline-none focus:ring-0 w-full"
                      placeholder="Note title..."
                    />
                  ) : (
                    <h3 className="text-xl font-bold text-gray-900">{selectedNote.title}</h3>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    Last updated: {new Date(selectedNote.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      isEditing 
                        ? 'bg-green-500 text-white hover:bg-green-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                    {isEditing ? 'Save' : 'Edit'}
                  </button>
                </div>
              </div>

              {/* Note Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                {isEditing ? (
                  <div className="space-y-4">
                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={selectedNote.category}
                        onChange={(e) => handleUpdateNote({ ...selectedNote, category: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={selectedNote.tags.join(', ')}
                        onChange={(e) => handleUpdateNote({ 
                          ...selectedNote, 
                          tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                        })}
                        placeholder="tag1, tag2, tag3..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    {/* Links */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Links (one per line)
                      </label>
                      <textarea
                        value={selectedNote.links.join('\n')}
                        onChange={(e) => handleUpdateNote({ 
                          ...selectedNote, 
                          links: e.target.value.split('\n').filter(Boolean)
                        })}
                        placeholder="https://example.com&#10;https://research-source.com"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      />
                    </div>

                    {/* Content */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content
                      </label>
                      <textarea
                        value={selectedNote.content}
                        onChange={(e) => handleUpdateNote({ ...selectedNote, content: e.target.value })}
                        placeholder="Write your notes, research, ideas, or any other information here..."
                        rows={15}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedNote.category)}`}>
                        {getCategoryIcon(selectedNote.category)}
                        {selectedNote.category}
                      </span>
                      
                      {selectedNote.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedNote.tags.map(tag => (
                            <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Links */}
                    {selectedNote.links.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <Link className="w-4 h-4" />
                          Links
                        </h4>
                        <div className="space-y-1">
                          {selectedNote.links.map((link, index) => (
                            <a
                              key={index}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-blue-600 hover:text-blue-800 text-sm break-all"
                            >
                              {link}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div>
                      <div className="prose max-w-none">
                        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                          {selectedNote.content || (
                            <span className="text-gray-400 italic">
                              No content yet. Click "Edit" to add your notes.
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Note Selected</h3>
                <p className="text-gray-600 mb-4">
                  Select a note from the sidebar or create a new one to get started.
                </p>
                <button
                  onClick={handleAddNote}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Create First Note
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 right-0 p-6">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
};