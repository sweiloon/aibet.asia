
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface UserSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const UserSearch = ({ searchTerm, setSearchTerm }: UserSearchProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search by email or name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-8 pr-8"
      />
      {searchTerm && (
        <button 
          className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
          onClick={() => setSearchTerm("")}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
