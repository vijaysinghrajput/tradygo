'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Button, Input } from '@tradygo/ui';
import { useDebounce } from '@/hooks/use-debounce';
import { SearchSuggestions } from './search-suggestions';

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setQuery(suggestion);
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  // Close suggestions when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show suggestions when query changes and input is focused
  React.useEffect(() => {
    if (debouncedQuery && isFocused) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [debouncedQuery, isFocused]);

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search products, brands, and more..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              if (debouncedQuery) setIsOpen(true);
            }}
            className="pl-10 pr-20 h-10"
            autoComplete="off"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={handleClear}
                aria-label="Clear search"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            <Button
              type="submit"
              size="sm"
              className="h-8 px-3"
              disabled={!query.trim()}
            >
              <Search className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </form>

      {/* Search Suggestions */}
      {isOpen && debouncedQuery && (
        <SearchSuggestions
          query={debouncedQuery}
          onSelect={handleSuggestionSelect}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}