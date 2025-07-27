import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MoreVertical, Edit, Trash2, Calendar } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

export interface Note {
  id: string;
  title: string;
  content: string;
  color: 'yellow' | 'green' | 'blue' | 'purple' | 'pink';
  createdAt: Date;
  updatedAt: Date;
}

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
}

const colorClasses = {
  yellow: 'bg-note-yellow border-yellow-200',
  green: 'bg-note-green border-green-200',
  blue: 'bg-note-blue border-blue-200',
  purple: 'bg-note-purple border-purple-200',
  pink: 'bg-note-pink border-pink-200',
};

export const NoteCard = ({ note, onEdit, onDelete }: NoteCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();

  const handleDelete = () => {
    onDelete(note.id);
    toast({
      title: "Note deleted",
      description: "Your note has been successfully deleted",
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className={`relative p-4 rounded-xl border-2 transition-all hover:shadow-md cursor-pointer group ${colorClasses[note.color]}`}>
      {/* Menu button */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/50 hover:bg-white/80">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={() => onEdit(note)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Note content */}
      <div className="pr-8" onClick={() => onEdit(note)}>
        <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2">
          {note.title || 'Untitled Note'}
        </h3>
        
        {note.content && (
          <p className="text-muted-foreground text-sm mb-3 line-clamp-4">
            {truncateContent(note.content)}
          </p>
        )}
        
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="h-3 w-3 mr-1" />
          <span>{formatDate(note.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
};