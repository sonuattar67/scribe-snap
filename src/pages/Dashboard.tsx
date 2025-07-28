import { useState, useEffect } from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { NotesGrid } from '@/components/notes/NotesGrid';
import { NoteEditor } from '@/components/notes/NoteEditor';
import { UserProfile } from '@/components/layout/UserProfile';
import { Note } from '@/components/notes/NoteCard';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
  };
  onLogout: () => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
}

export const Dashboard = ({ user: initialUser, onLogout }: DashboardProps) => {
  const [user, setUser] = useState<User>(initialUser);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { toast } = useToast();

  // Load notes from Supabase
  useEffect(() => {
    loadNotes();
  }, [user.id]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        throw error;
      }

      const formattedNotes: Note[] = data.map(note => ({
        id: note.id,
        title: note.title,
        content: note.content || '',
        color: 'blue', // Default color for now
        createdAt: new Date(note.created_at),
        updatedAt: new Date(note.updated_at),
      }));

      setNotes(formattedNotes);
    } catch (error: any) {
      toast({
        title: "Error loading notes",
        description: error.message || "Failed to load notes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  const handleSaveNote = async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingNote) {
        // Update existing note
        const { error } = await supabase
          .from('notes')
          .update({
            title: noteData.title,
            content: noteData.content,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingNote.id);

        if (error) {
          throw error;
        }

        setNotes(prev => prev.map(note => 
          note.id === editingNote.id
            ? { ...note, ...noteData, updatedAt: new Date() }
            : note
        ));

        toast({
          title: "Note updated",
          description: "Your note has been updated successfully",
        });
      } else {
        // Create new note
        const { data, error } = await supabase
          .from('notes')
          .insert({
            title: noteData.title,
            content: noteData.content,
            user_id: user.id,
          })
          .select()
          .single();

        if (error) {
          throw error;
        }

        const newNote: Note = {
          id: data.id,
          title: data.title,
          content: data.content || '',
          color: noteData.color,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
        };

        setNotes(prev => [newNote, ...prev]);

        toast({
          title: "Note created",
          description: "Your new note has been created successfully",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error saving note",
        description: error.message || "Failed to save note",
        variant: "destructive",
      });
    }
    setIsEditorOpen(false);
    setEditingNote(null);
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (error) {
        throw error;
      }

      setNotes(prev => prev.filter(note => note.id !== noteId));

      toast({
        title: "Note deleted",
        description: "Your note has been deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting note",
        description: error.message || "Failed to delete note",
        variant: "destructive",
      });
    }
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
    // Update localStorage as well
    localStorage.setItem('scribeSnapUser', JSON.stringify(updatedUser));
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        user={user}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNewNote={handleNewNote}
        onLogout={onLogout}
        onProfileClick={() => setIsProfileOpen(true)}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Welcome back, {user.name}!
          </h2>
          <p className="text-muted-foreground">
            {loading
              ? 'Loading your notes...'
              : notes.length === 0 
                ? 'Start by creating your first note'
                : `You have ${notes.length} note${notes.length === 1 ? '' : 's'}`
            }
          </p>
        </div>

        {searchQuery && !loading && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              {filteredNotes.length === 0 
                ? `No notes found for "${searchQuery}"`
                : `Found ${filteredNotes.length} note${filteredNotes.length === 1 ? '' : 's'} for "${searchQuery}"`
              }
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <NotesGrid
            notes={filteredNotes}
            onEditNote={handleEditNote}
            onDeleteNote={handleDeleteNote}
          />
        )}
      </main>

      <NoteEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        note={editingNote}
        onSave={handleSaveNote}
      />

      <UserProfile
        user={user}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onUserUpdate={handleUserUpdate}
      />
    </div>
  );
};