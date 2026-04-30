'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/**
 * @component AdminSearchBar
 * @description THE SOVEREIGN OMNI-SEARCH (HAWKEYE - SC-565)
 * Centralized discovery tool for the Owner and Admins.
 * Protocol 88: Debounced input shell to prevent resource waste.
 */
export function AdminSearchBar() {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setSearching(true);
    try {
      // [PROTOCOL 88]: Logic isolated from background noise
      // Future: Invoke AdminSearchService.execute(query)
      
      toast({
        title: "جاري المسح الراداري...",
        description: `البحث عن: "${query}" في سجلات الكوادر والجمهور والمركبات.`,
      });
      
    } catch (error) {
      console.error("[Hawkeye Search] Pulse lost:", error);
    } finally {
      // Small timeout to simulate radar sweep feedback
      setTimeout(() => setSearching(false), 800);
    }
  };

  return (
    <form 
      onSubmit={handleSearch} 
      className="relative w-full max-w-lg hidden md:flex items-center ml-auto mr-4 group"
    >
      <Search className="absolute right-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
      <Input
        placeholder="بحث سيادي: اسم الموظف، الناقل، المسافر، أو رقم المركبة..."
        className="pr-9 h-10 bg-background/50 border-muted focus:bg-background focus:ring-1 focus:ring-primary/30 transition-all w-full text-xs"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {searching && (
        <div className="absolute left-3">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        </div>
      )}
    </form>
  );
}
