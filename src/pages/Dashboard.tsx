import { useState, useEffect } from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { NotesGrid } from '@/components/notes/NotesGrid';
import { NoteEditor } from '@/components/notes/NoteEditor';
import { Note } from '@/components/notes/NoteCard';
import { useToast } from '@/hooks/use-toast';

interface DashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
  };
  onLogout: () => void;
}

// Mock data - replace with actual API calls
const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Welcome to ScribeSnap!',
    content: 'This is your first note. You can edit or delete it, and create new ones by clicking the "New Note" button.',
    color: 'blue',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Meeting Notes',
    content: 'Discussed project timeline and deliverables. Next meeting scheduled for Friday.',
    color: 'yellow',
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 86400000),
  },
  {
    id: '3',
    title: 'Ideas',
    content: 'New feature ideas for the app:\n- Dark mode\n- Note categories\n- Export to PDF',
    color: 'green',
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 172800000),
  },
];

export const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const { toast } = useToast();

  // Filter notes based on search query
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewNote = () => {
    setEditingNote(null);
    setIsEditorOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  const handleSaveNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingNote) {
      // Update existing note
      setNotes(prev => prev.map(note => 
        note.id === editingNote.id
          ? { ...note, ...noteData, updatedAt: new Date() }
          : note
      ));
    } else {
      // Create new note
      const newNote: Note = {
        id: Date.now().toString(),
        ...noteData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setNotes(prev => [newNote, ...prev]);
    }
    setIsEditorOpen(false);
    setEditingNote(null);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        user={user}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNewNote={handleNewNote}
        onLogout={onLogout}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Welcome back, {user.name}!
          </h2>
          <p className="text-muted-foreground">
            {notes.length === 0 
              ? 'Start by creating your first note'
              : `You have ${notes.length} note${notes.length === 1 ? '' : 's'}`
            }
          </p>
        </div>

        {searchQuery && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              {filteredNotes.length === 0 
                ? `No notes found for "${searchQuery}"`
                : `Found ${filteredNotes.length} note${filteredNotes.length === 1 ? '' : 's'} for "${searchQuery}"`
              }
            </p>
          </div>
        )}

        <NotesGrid
          notes={filteredNotes}
          onEditNote={handleEditNote}
          onDeleteNote={handleDeleteNote}
        />
      </main>

      <NoteEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        note={editingNote}
        onSave={handleSaveNote}
      />
    </div>
  );
};