import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Save, Palette } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Note } from './NoteCard';
import { useToast } from '@/hooks/use-toast';

interface NoteEditorProps {
  isOpen: boolean;
  onClose: () => void;
  note?: Note | null;
  onSave: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const colors = [
  { name: 'yellow', class: 'bg-note-yellow border-yellow-200' },
  { name: 'green', class: 'bg-note-green border-green-200' },
  { name: 'blue', class: 'bg-note-blue border-blue-200' },
  { name: 'purple', class: 'bg-note-purple border-purple-200' },
  { name: 'pink', class: 'bg-note-pink border-pink-200' },
] as const;

export const NoteEditor = ({ isOpen, onClose, note, onSave }: NoteEditorProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedColor, setSelectedColor] = useState<'yellow' | 'green' | 'blue' | 'purple' | 'pink'>('yellow');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setSelectedColor(note.color);
    } else {
      setTitle('');
      setContent('');
      setSelectedColor('yellow');
    }
  }, [note, isOpen]);

  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
      toast({
        title: "Empty note",
        description: "Please add a title or content to save the note",
        variant: "destructive",
      });
      return;
    }

    onSave({
      title: title.trim(),
      content: content.trim(),
      color: selectedColor,
    });

    toast({
      title: note ? "Note updated" : "Note created",
      description: note ? "Your note has been updated successfully" : "Your new note has been created",
    });

    onClose();
  };

  const handleClose = () => {
    if ((title.trim() || content.trim()) && (!note || title !== note.title || content !== note.content || selectedColor !== note.color)) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <div className={`rounded-lg border-2 ${colors.find(c => c.name === selectedColor)?.class}`}>
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">
                {note ? 'Edit Note' : 'New Note'}
              </DialogTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="h-8 w-8"
                >
                  <Palette className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {showColorPicker && (
              <div className="flex space-x-2 mt-3">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => {
                      setSelectedColor(color.name);
                      setShowColorPicker(false);
                    }}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                      color.class
                    } ${selectedColor === color.name ? 'ring-2 ring-primary' : ''}`}
                  />
                ))}
              </div>
            )}
          </DialogHeader>

          <div className="px-6 pb-6 space-y-4">
            <Input
              placeholder="Note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-semibold bg-white/50 border-white/50"
            />
            
            <Textarea
              placeholder="Start writing your note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[300px] bg-white/50 border-white/50 resize-none"
            />
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                {note ? 'Update Note' : 'Save Note'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};