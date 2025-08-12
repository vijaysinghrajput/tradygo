import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { ProductListScreenProps } from '@/navigation/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/types';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  slug: string;
}

type SortOption = 'popularity' | 'price_low' | 'price_high' | 'rating' | 'newest';

type MainStackNavigationProp = NativeStackNavigationProp<MainStackParamList>;

const ProductListScreen: React.FC<ProductListScreenProps> = ({ route }) => {
  const navigation = useNavigation<MainStackNavigationProp>();
  const { categorySlug, categoryId, title } = route.params;
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [showSortOptions, setShowSortOptions] = useState(false);

  useEffect(() => {
    // Mock products data - replace with actual API call
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Premium Wireless Headphones',
        price: 2999,
        originalPrice: 3999,
        image: 'https://via.placeholder.com/200x200/007bff/ffffff?text=Product+1',
        rating: 4.5,
        reviewCount: 128,
        inStock: true,
        slug: 'premium-wireless-headphones',
      },
      {
        id: '2',
        name: 'Smart Fitness Watch',
        price: 1999,
        originalPrice: 2499,
        image: 'https://via.placeholder.com/200x200/28a745/ffffff?text=Product+2',
        rating: 4.2,
        reviewCount: 89,
        inStock: true,
        slug: 'smart-fitness-watch',
      },
      {
        id: '3',
        name: 'Bluetooth Speaker',
        price: 1499,
        image: 'https://via.placeholder.com/200x200/dc3545/ffffff?text=Product+3',
        rating: 4.0,
        reviewCount: 156,
        inStock: false,
        slug: 'bluetooth-speaker',
      },
      {
        id: '4',
        name: 'Wireless Charging Pad',
        price: 899,
        originalPrice: 1199,
        image: 'https://via.placeholder.com/200x200/ffc107/ffffff?text=Product+4',
        rating: 3.8,
        reviewCount: 67,
        inStock: true,
        slug: 'wireless-charging-pad',
      },
      {
        id: '5',
        name: 'USB-C Hub',
        price: 1299,
        image: 'https://via.placeholder.com/200x200/17a2b8/ffffff?text=Product+5',
        rating: 4.3,
        reviewCount: 94,
        inStock: true,
        slug: 'usb-c-hub',
      },
      {
        id: '6',
        name: 'Portable Power Bank',
        price: 799,
        originalPrice: 999,
        image: 'https://via.placeholder.com/200x200/6f42c1/ffffff?text=Product+6',
        rating: 4.1,
        reviewCount: 203,
        inStock: true,
        slug: 'portable-power-bank',
      },
    ];

    setTimeout(() => {
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, [categoryId]);

  useEffect(() => {
    let filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Apply sorting
    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // For demo, reverse the order
        filtered.reverse();
        break;
      default:
        // popularity - keep original order
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, sortBy]);

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', {
      productId: product.id,
      productSlug: product.slug,
    });
  };

  const handleAddToCart = (product: Product) => {
    if (!product.inStock) {
      Alert.alert('Out of Stock', 'This product is currently out of stock.');
      return;
    }
    Alert.alert('Added to Cart', `${product.name} added to cart`);
  };

  const sortOptions = [
    { key: 'popularity', label: 'Popularity' },
    { key: 'price_low', label: 'Price: Low to High' },
    { key: 'price_high', label: 'Price: High to Low' },
    { key: 'rating', label: 'Customer Rating' },
    { key: 'newest', label: 'Newest First' },
  ];

  const renderSortOptions = () => {
    if (!showSortOptions) return null;

    return (
      <View style={styles.sortOptionsContainer}>
        {sortOptions.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.sortOption,
              sortBy === option.key && styles.activeSortOption,
            ]}
            onPress={() => {
              setSortBy(option.key as SortOption);
              setShowSortOptions(false);
            }}
          >
            <Text
              style={[
                styles.sortOptionText,
                sortBy === option.key && styles.activeSortOptionText,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => handleProductPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.productImageContainer}>
        <View style={styles.productImagePlaceholder}>
          <Text style={styles.productImageText}>IMG</Text>
        </View>
        {!item.inStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
      </View>
      
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
          <Text style={styles.reviewCount}>({item.reviewCount})</Text>
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>₹{item.price.toLocaleString()}</Text>
          {item.originalPrice && (
            <Text style={styles.originalPrice}>
              ₹{item.originalPrice.toLocaleString()}
            </Text>
          )}
        </View>
        
        {item.originalPrice && (
          <Text style={styles.discount}>
            {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
          </Text>
        )}
      </View>
      
      <TouchableOpacity
        style={[
          styles.addToCartButton,
          !item.inStock && styles.disabledButton,
        ]}
        onPress={() => handleAddToCart(item)}
        disabled={!item.inStock}
      >
        <Text
          style={[
            styles.addToCartText,
            !item.inStock && styles.disabledButtonText,
          ]}
        >
          {item.inStock ? 'Add to Cart' : 'Out of Stock'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
      <Text style={styles.productCount}>
        {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
      </Text>
    </View>
  );

  const renderSearchAndSort = () => (
    <View style={styles.searchSortContainer}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor={colors.text.tertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <TouchableOpacity
        style={styles.sortButton}
        onPress={() => setShowSortOptions(!showSortOptions)}
      >
        <Text style={styles.sortButtonText}>Sort</Text>
        <Text style={styles.sortIcon}>⌄</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderSearchAndSort()}
      {renderSortOptions()}
      
      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your search or filters
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body.large,
    color: colors.text.secondary,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  headerTitle: {
    ...typography.heading.h1,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  productCount: {
    ...typography.body.medium,
    color: colors.text.secondary,
  },
  searchSortContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.secondary,
  },
  searchContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  searchInput: {
    ...typography.body.medium,
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text.primary,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  sortButtonText: {
    ...typography.body.medium,
    color: colors.text.primary,
    marginRight: spacing.xs,
  },
  sortIcon: {
    ...typography.body.medium,
    color: colors.text.secondary,
  },
  sortOptionsContainer: {
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
    paddingHorizontal: spacing.lg,
  },
  sortOption: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  activeSortOption: {
    backgroundColor: colors.primary[50],
  },
  sortOptionText: {
    ...typography.body.medium,
    color: colors.text.primary,
  },
  activeSortOptionText: {
    color: colors.primary[500],
    fontWeight: '600',
  },
  productList: {
    padding: spacing.md,
  },
  productCard: {
    flex: 1,
    backgroundColor: colors.background.primary,
    borderRadius: spacing.md,
    margin: spacing.xs,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  productImageContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  productImagePlaceholder: {
    height: 120,
    backgroundColor: colors.gray[100],
    borderRadius: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImageText: {
    ...typography.body.medium,
    color: colors.text.secondary,
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    ...typography.body.medium,
    color: colors.white,
    fontWeight: '600',
  },
  productInfo: {
    marginBottom: spacing.md,
  },
  productName: {
    ...typography.body.large,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  rating: {
    ...typography.body.small,
    color: colors.text.primary,
    marginRight: spacing.xs,
  },
  reviewCount: {
    ...typography.body.small,
    color: colors.text.secondary,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  price: {
    ...typography.body.large,
    color: colors.primary[500],
    fontWeight: '600',
    marginRight: spacing.sm,
  },
  originalPrice: {
    ...typography.body.medium,
    color: colors.text.secondary,
    textDecorationLine: 'line-through',
  },
  discount: {
    ...typography.body.small,
    color: colors.success[500],
    fontWeight: '600',
  },
  addToCartButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.sm,
    borderRadius: spacing.sm,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: colors.gray[300],
  },
  addToCartText: {
    ...typography.button,
    color: colors.white,
    fontSize: 12,
  },
  disabledButtonText: {
    color: colors.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    ...typography.heading.h3,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    ...typography.body.medium,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
});

export default ProductListScreen;