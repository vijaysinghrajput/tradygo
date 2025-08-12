import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { SearchScreenProps } from '@/navigation/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/types';
import { validateFormData, schemas } from '@/utils/validation';

interface SearchResult {
  id: string;
  name: string;
  price: number;
  image?: string;
  rating: number;
  reviewCount: number;
}

interface RecentSearch {
  id: string;
  query: string;
  timestamp: Date;
}

type MainStackNavigationProp = NativeStackNavigationProp<MainStackParamList>;

const SearchScreen: React.FC<SearchScreenProps> = () => {
  const navigation = useNavigation<MainStackNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      // TODO: Load from AsyncStorage or MMKV
      // For now, using mock data
      const mockRecentSearches: RecentSearch[] = [
        {
          id: '1',
          query: 'smartphone',
          timestamp: new Date(Date.now() - 86400000), // 1 day ago
        },
        {
          id: '2',
          query: 'laptop',
          timestamp: new Date(Date.now() - 172800000), // 2 days ago
        },
        {
          id: '3',
          query: 'headphones',
          timestamp: new Date(Date.now() - 259200000), // 3 days ago
        },
      ];
      setRecentSearches(mockRecentSearches);
    } catch (error) {
      console.error('Failed to load recent searches:', error);
    }
  };

  const handleSearch = async (query: string = searchQuery) => {
    if (!query.trim()) return;

    // Validate search query
    const validation = validateFormData(schemas.search, { query: query.trim() });
    if (!validation.isValid) {
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResults: SearchResult[] = [
        {
          id: '1',
          name: `${query} Product 1`,
          price: 299.99,
          rating: 4.5,
          reviewCount: 128,
        },
        {
          id: '2',
          name: `${query} Product 2`,
          price: 199.99,
          rating: 4.2,
          reviewCount: 89,
        },
        {
          id: '3',
          name: `${query} Product 3`,
          price: 399.99,
          rating: 4.8,
          reviewCount: 256,
        },
      ];
      
      setSearchResults(mockResults);
      
      // Add to recent searches
      const newSearch: RecentSearch = {
        id: Date.now().toString(),
        query: query.trim(),
        timestamp: new Date(),
      };
      setRecentSearches(prev => [newSearch, ...prev.slice(0, 4)]); // Keep only 5 recent searches
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductPress = (product: SearchResult) => {
    navigation.navigate('ProductDetail', {
      productId: product.id,
    });
  };

  const handleRecentSearchPress = (query: string) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    // TODO: Clear from AsyncStorage or MMKV
  };

  const renderSearchResult = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleProductPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.resultImageContainer}>
        <View style={styles.resultImagePlaceholder}>
          <Text style={styles.resultImagePlaceholderText}>
            {item.name.charAt(0)}
          </Text>
        </View>
      </View>
      
      <View style={styles.resultInfo}>
        <Text style={styles.resultName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.resultPrice}>₹{item.price}</Text>
        <View style={styles.resultRating}>
          <Text style={styles.resultRatingText}>★ {item.rating}</Text>
          <Text style={styles.resultReviewCount}>({item.reviewCount})</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderRecentSearch = ({ item }: { item: RecentSearch }) => (
    <TouchableOpacity
      style={styles.recentSearchItem}
      onPress={() => handleRecentSearchPress(item.query)}
      activeOpacity={0.7}
    >
      <Text style={styles.recentSearchIcon}>🕒</Text>
      <Text style={styles.recentSearchText}>{item.query}</Text>
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      );
    }

    if (hasSearched && searchResults.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No results found</Text>
          <Text style={styles.emptySubtitle}>
            Try searching with different keywords
          </Text>
        </View>
      );
    }

    if (hasSearched && searchResults.length > 0) {
      return (
        <FlatList
          data={searchResults}
          renderItem={renderSearchResult}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.resultsContainer}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.resultSeparator} />}
        />
      );
    }

    // Show recent searches when not searching
    return (
      <View style={styles.recentContainer}>
        <View style={styles.recentHeader}>
          <Text style={styles.recentTitle}>Recent Searches</Text>
          {recentSearches.length > 0 && (
            <TouchableOpacity onPress={clearRecentSearches}>
              <Text style={styles.clearButton}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {recentSearches.length > 0 ? (
          <FlatList
            data={recentSearches}
            renderItem={renderRecentSearch}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <Text style={styles.noRecentText}>
            No recent searches
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor={colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch()}
            returnKeyType="search"
            autoFocus
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => handleSearch()}
            disabled={!searchQuery.trim() || isLoading}
          >
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    ...typography.body.medium,
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background.primary,
    color: colors.text.primary,
    marginRight: spacing.sm,
  },
  searchButton: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.sm,
  },
  searchButtonText: {
    ...typography.button,
    color: colors.white,
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body.medium,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: {
    ...typography.heading.h3,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...typography.body.medium,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  resultsContainer: {
    paddingVertical: spacing.md,
  },
  resultItem: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.primary,
  },
  resultImageContainer: {
    marginRight: spacing.md,
  },
  resultImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: spacing.sm,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultImagePlaceholderText: {
    ...typography.heading.h3,
    color: colors.text.secondary,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    ...typography.body.large,
    color: colors.text.primary,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  resultPrice: {
    ...typography.body.medium,
    color: colors.primary[500],
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  resultRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultRatingText: {
    ...typography.body.small,
    color: colors.warning[500],
    marginRight: spacing.xs,
  },
  resultReviewCount: {
    ...typography.body.small,
    color: colors.text.secondary,
  },
  resultSeparator: {
    height: 1,
    backgroundColor: colors.border.primary,
    marginLeft: spacing.lg + 60 + spacing.md,
  },
  recentContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  recentTitle: {
    ...typography.heading.h3,
    color: colors.text.primary,
  },
  clearButton: {
    ...typography.body.medium,
    color: colors.primary[500],
    fontWeight: '500',
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  recentSearchIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  recentSearchText: {
    ...typography.body.medium,
    color: colors.text.primary,
  },
  noRecentText: {
    ...typography.body.medium,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});

export default SearchScreen;