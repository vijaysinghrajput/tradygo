import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { ProductDetailScreenProps } from '@/navigation/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/types';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  brand: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  specifications: { [key: string]: string };
  features: string[];
}

type MainStackNavigationProp = NativeStackNavigationProp<MainStackParamList>;

const { width } = Dimensions.get('window');

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ route }) => {
  const navigation = useNavigation<MainStackNavigationProp>();
  const { productId, productSlug } = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock product data - replace with actual API call
    const mockProduct: Product = {
      id: productId,
      name: 'Premium Wireless Headphones',
      description: 'Experience crystal-clear audio with our premium wireless headphones. Featuring advanced noise cancellation technology and up to 30 hours of battery life.',
      price: 2999,
      originalPrice: 3999,
      images: [
        'https://via.placeholder.com/400x400/007bff/ffffff?text=Product+1',
        'https://via.placeholder.com/400x400/28a745/ffffff?text=Product+2',
        'https://via.placeholder.com/400x400/dc3545/ffffff?text=Product+3',
      ],
      category: 'Electronics',
      brand: 'TechBrand',
      rating: 4.5,
      reviewCount: 128,
      inStock: true,
      specifications: {
        'Battery Life': '30 hours',
        'Connectivity': 'Bluetooth 5.0',
        'Weight': '250g',
        'Warranty': '1 year',
      },
      features: [
        'Active Noise Cancellation',
        'Quick Charge (15 min = 3 hours)',
        'Voice Assistant Compatible',
        'Foldable Design',
      ],
    };

    setTimeout(() => {
      setProduct(mockProduct);
      setLoading(false);
    }, 1000);
  }, [productId]);

  const handleAddToCart = () => {
    Alert.alert(
      'Added to Cart',
      `${quantity} x ${product?.name} added to cart`,
      [{ text: 'OK' }]
    );
  };

  const handleBuyNow = () => {
    // Navigate to checkout with this product
    navigation.navigate('Checkout');
  };

  const renderImageGallery = () => {
    if (!product?.images.length) return null;

    return (
      <View style={styles.imageContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setSelectedImageIndex(index);
          }}
        >
          {product.images.map((image, index) => (
            <View key={index} style={styles.imagePlaceholder}>
              <Text style={styles.imageText}>Image {index + 1}</Text>
            </View>
          ))}
        </ScrollView>
        
        <View style={styles.imageIndicators}>
          {product.images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                selectedImageIndex === index && styles.activeIndicator,
              ]}
            />
          ))}
        </View>
      </View>
    );
  };

  const renderQuantitySelector = () => (
    <View style={styles.quantityContainer}>
      <Text style={styles.quantityLabel}>Quantity:</Text>
      <View style={styles.quantitySelector}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => setQuantity(Math.max(1, quantity - 1))}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        
        <Text style={styles.quantityText}>{quantity}</Text>
        
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => setQuantity(quantity + 1)}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading product...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Product not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderImageGallery()}
        
        <View style={styles.contentContainer}>
          <View style={styles.headerSection}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.brandName}>{product.brand}</Text>
            
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {product.rating}</Text>
              <Text style={styles.reviewCount}>({product.reviewCount} reviews)</Text>
            </View>
          </View>

          <View style={styles.priceSection}>
            <Text style={styles.price}>₹{product.price.toLocaleString()}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>
                ₹{product.originalPrice.toLocaleString()}
              </Text>
            )}
            {product.originalPrice && (
              <Text style={styles.discount}>
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </Text>
            )}
          </View>

          <View style={styles.stockSection}>
            <Text style={[styles.stockText, { color: product.inStock ? colors.success[500] : colors.error[500] }]}>
              {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
            </Text>
          </View>

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Key Features</Text>
            {product.features.map((feature, index) => (
              <Text key={index} style={styles.feature}>
                • {feature}
              </Text>
            ))}
          </View>

          <View style={styles.specificationsSection}>
            <Text style={styles.sectionTitle}>Specifications</Text>
            {Object.entries(product.specifications).map(([key, value]) => (
              <View key={key} style={styles.specRow}>
                <Text style={styles.specKey}>{key}:</Text>
                <Text style={styles.specValue}>{value}</Text>
              </View>
            ))}
          </View>

          {renderQuantitySelector()}
        </View>
      </ScrollView>

      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.addToCartButton]}
          onPress={handleAddToCart}
          disabled={!product.inStock}
        >
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.buyNowButton]}
          onPress={handleBuyNow}
          disabled={!product.inStock}
        >
          <Text style={styles.buyNowText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  errorText: {
    ...typography.heading.h2,
    color: colors.error[500],
    marginBottom: spacing.lg,
  },
  backButton: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: spacing.sm,
  },
  backButtonText: {
    ...typography.button,
    color: colors.white,
  },
  imageContainer: {
    height: 300,
    backgroundColor: colors.background.secondary,
  },
  imagePlaceholder: {
    width,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
  },
  imageText: {
    ...typography.body.large,
    color: colors.text.secondary,
  },
  imageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: spacing.md,
    left: 0,
    right: 0,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray[300],
    marginHorizontal: spacing.xs / 2,
  },
  activeIndicator: {
    backgroundColor: colors.primary[500],
  },
  contentContainer: {
    padding: spacing.lg,
  },
  headerSection: {
    marginBottom: spacing.lg,
  },
  productName: {
    ...typography.heading.h1,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  brandName: {
    ...typography.body.large,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    ...typography.body.medium,
    color: colors.text.primary,
    marginRight: spacing.sm,
  },
  reviewCount: {
    ...typography.body.medium,
    color: colors.text.secondary,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  price: {
    ...typography.heading.h2,
    color: colors.primary[500],
    marginRight: spacing.md,
  },
  originalPrice: {
    ...typography.body.large,
    color: colors.text.secondary,
    textDecorationLine: 'line-through',
    marginRight: spacing.sm,
  },
  discount: {
    ...typography.body.medium,
    color: colors.success[500],
    fontWeight: '600',
  },
  stockSection: {
    marginBottom: spacing.lg,
  },
  stockText: {
    ...typography.body.medium,
    fontWeight: '600',
  },
  descriptionSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.heading.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body.large,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  featuresSection: {
    marginBottom: spacing.lg,
  },
  feature: {
    ...typography.body.medium,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  specificationsSection: {
    marginBottom: spacing.lg,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  specKey: {
    ...typography.body.medium,
    color: colors.text.primary,
    flex: 1,
  },
  specValue: {
    ...typography.body.medium,
    color: colors.text.secondary,
    flex: 1,
    textAlign: 'right',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  quantityLabel: {
    ...typography.body.large,
    color: colors.text.primary,
    marginRight: spacing.md,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: spacing.sm,
  },
  quantityButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background.secondary,
  },
  quantityButtonText: {
    ...typography.button,
    color: colors.text.primary,
  },
  quantityText: {
    ...typography.body.large,
    color: colors.text.primary,
    paddingHorizontal: spacing.md,
    minWidth: 40,
    textAlign: 'center',
  },
  bottomActions: {
    flexDirection: 'row',
    padding: spacing.lg,
    backgroundColor: colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: colors.border.primary,
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: spacing.sm,
    alignItems: 'center',
  },
  addToCartButton: {
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.primary[500],
    marginRight: spacing.sm,
  },
  addToCartText: {
    ...typography.button,
    color: colors.primary[500],
  },
  buyNowButton: {
    backgroundColor: colors.primary[500],
    marginLeft: spacing.sm,
  },
  buyNowText: {
    ...typography.button,
    color: colors.white,
  },
});

export default ProductDetailScreen;