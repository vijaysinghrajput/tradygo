'use client';

import * as React from 'react';
import { Search, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@tradygo/ui';

interface SearchSuggestionsProps {
  query: string;
  onSelect: (suggestion: string) => void;
  onClose: () => void;
}

// Mock data - in real app, this would come from API
const popularSearches = [
  'iPhone 15',
  'Samsung Galaxy',
  'MacBook Pro',
  'AirPods',
  'Nike shoes',
  'Adidas sneakers',
  'Gaming laptop',
  'Wireless headphones',
];

const recentSearches = [
  'iPhone 14',
  'Bluetooth speaker',
  'Running shoes',
];

export function SearchSuggestions({ query, onSelect, onClose }: SearchSuggestionsProps) {
  // Filter suggestions based on query
  const filteredSuggestions = popularSearches.filter(item =>
    item.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const showRecentSearches = query.length < 2;
  const showPopularSearches = filteredSuggestions.length > 0;

  if (!showRecentSearches && !showPopularSearches) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border rounded-lg shadow-lg max-h-96 overflow-y-auto">
      <div className="p-2">
        {/* Query suggestion */}
        {query.length >= 2 && (
          <Button
            variant="ghost"
            className="w-full justify-start h-auto p-3 text-left"
            onClick={() => onSelect(query)}
          >
            <Search className="h-4 w-4 mr-3 text-muted-foreground" />
            <span>Search for "<strong>{query}</strong>"</span>
          </Button>
        )}

        {/* Filtered suggestions */}
        {showPopularSearches && (
          <div className="space-y-1">
            {query.length >= 2 && (
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-t">
                Suggestions
              </div>
            )}
            {filteredSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start h-auto p-3 text-left"
                onClick={() => onSelect(suggestion)}
              >
                <Search className="h-4 w-4 mr-3 text-muted-foreground" />
                <span>{suggestion}</span>
              </Button>
            ))}
          </div>
        )}

        {/* Recent searches */}
        {showRecentSearches && recentSearches.length > 0 && (
          <div className="space-y-1">
            <div className="px-3 py-2 text-xs font-medium text-muted-foreground flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Recent searches
            </div>
            {recentSearches.map((search, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start h-auto p-3 text-left"
                onClick={() => onSelect(search)}
              >
                <Clock className="h-4 w-4 mr-3 text-muted-foreground" />
                <span>{search}</span>
              </Button>
            ))}
          </div>
        )}

        {/* Popular searches */}
        {showRecentSearches && (
          <div className="space-y-1">
            <div className="px-3 py-2 text-xs font-medium text-muted-foreground flex items-center border-t">
              <TrendingUp className="h-3 w-3 mr-1" />
              Popular searches
            </div>
            {popularSearches.slice(0, 4).map((search, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start h-auto p-3 text-left"
                onClick={() => onSelect(search)}
              >
                <TrendingUp className="h-4 w-4 mr-3 text-muted-foreground" />
                <span>{search}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}