import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { CartScreenProps } from '@/navigation/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/types';
import { formatCurrency } from '@/utils/currency';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: string;
  maxQuantity: number;
}

type MainStackNavigationProp = NativeStackNavigationProp<MainStackParamList>;

const CartScreen: React.FC<CartScreenProps> = () => {
  const navigation = useNavigation<MainStackNavigationProp>();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    try {
      // TODO: Replace with actual cart store or API call
      // For now, using mock data
      const mockCartItems: CartItem[] = [
        {
          id: '1',
          productId: 'prod1',
          name: 'Wireless Bluetooth Headphones',
          price: 2999,
          quantity: 1,
          variant: 'Black',
          maxQuantity: 5,
        },
        {
          id: '2',
          productId: 'prod2',
          name: 'Smartphone Case',
          price: 599,
          quantity: 2,
          variant: 'Clear',
          maxQuantity: 10,
        },
        {
          id: '3',
          productId: 'prod3',
          name: 'USB-C Cable',
          price: 299,
          quantity: 1,
          maxQuantity: 20,
        },
      ];
      setCartItems(mockCartItems);
    } catch (error) {
      console.error('Failed to load cart items:', error);
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId);
      return;
    }

    setCartItems(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: Math.min(newQuantity, item.maxQuantity),
          };
        }
        return item;
      })
    );
  };

  const removeItem = (itemId: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setCartItems(prev => prev.filter(item => item.id !== itemId));
          },
        },
      ]
    );
  };

  const handleProductPress = (productId: string) => {
    navigation.navigate('ProductDetail', { productId });
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before checkout.');
      return;
    }
    navigation.navigate('Checkout');
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = subtotal > 500 ? 0 : 50; // Free shipping above ₹500
    return subtotal + shipping;
  };

  const getShippingCost = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 500 ? 0 : 50;
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <TouchableOpacity
        style={styles.itemImageContainer}
        onPress={() => handleProductPress(item.productId)}
      >
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.itemImage} />
        ) : (
          <View style={styles.itemImagePlaceholder}>
            <Text style={styles.itemImagePlaceholderText}>
              {item.name.charAt(0)}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.itemDetails}>
        <TouchableOpacity onPress={() => handleProductPress(item.productId)}>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.name}
          </Text>
        </TouchableOpacity>
        
        {item.variant && (
          <Text style={styles.itemVariant}>{item.variant}</Text>
        )}
        
        <Text style={styles.itemPrice}>
          {formatCurrency(item.price, 'INR')}
        </Text>

        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={[
              styles.quantityButton,
              item.quantity <= 1 && styles.quantityButtonDisabled,
            ]}
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity
            style={[
              styles.quantityButton,
              item.quantity >= item.maxQuantity && styles.quantityButtonDisabled,
            ]}
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
            disabled={item.quantity >= item.maxQuantity}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeItem(item.id)}
      >
        <Text style={styles.removeButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Your cart is empty</Text>
      <Text style={styles.emptySubtitle}>
        Add some products to get started
      </Text>
      <TouchableOpacity
        style={styles.shopButton}
        onPress={() => navigation.navigate('HomeTabs', { screen: 'Home' })}
      >
        <Text style={styles.shopButtonText}>Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSummary = () => {
    const subtotal = calculateSubtotal();
    const shipping = getShippingCost();
    const total = calculateTotal();

    return (
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>
            {formatCurrency(subtotal, 'INR')}
          </Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={[styles.summaryValue, shipping === 0 && styles.freeShipping]}>
            {shipping === 0 ? 'FREE' : formatCurrency(shipping, 'INR')}
          </Text>
        </View>
        
        {shipping > 0 && (
          <Text style={styles.freeShippingNote}>
            Add {formatCurrency(500 - subtotal, 'INR')} more for free shipping
          </Text>
        )}
        
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            {formatCurrency(total, 'INR')}
          </Text>
        </View>
      </View>
    );
  };

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {renderEmptyCart()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <Text style={styles.headerSubtitle}>
          {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
        </Text>
      </View>

      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
      />

      {renderSummary()}

      <View style={styles.checkoutContainer}>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
          disabled={isLoading}
        >
          <Text style={styles.checkoutButtonText}>
            {isLoading ? 'Processing...' : 'Proceed to Checkout'}
          </Text>
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
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  headerTitle: {
    ...typography.heading.h2,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.body.medium,
    color: colors.text.secondary,
  },
  listContent: {
    paddingVertical: spacing.sm,
  },
  cartItem: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.primary,
  },
  itemImageContainer: {
    marginRight: spacing.md,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: spacing.sm,
    backgroundColor: colors.background.secondary,
  },
  itemImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: spacing.sm,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImagePlaceholderText: {
    ...typography.heading.h3,
    color: colors.text.secondary,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    ...typography.body.large,
    color: colors.text.primary,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  itemVariant: {
    ...typography.body.small,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  itemPrice: {
    ...typography.body.medium,
    color: colors.primary[500],
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  quantityButtonDisabled: {
    backgroundColor: colors.gray[100],
    borderColor: colors.gray[200],
  },
  quantityButtonText: {
    ...typography.body.medium,
    color: colors.text.primary,
    fontWeight: '600',
  },
  quantityText: {
    ...typography.body.medium,
    color: colors.text.primary,
    marginHorizontal: spacing.md,
    minWidth: 30,
    textAlign: 'center',
  },
  removeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  removeButtonText: {
    ...typography.heading.h2,
    color: colors.error[500],
    fontWeight: '300',
  },
  itemSeparator: {
    height: 1,
    backgroundColor: colors.border.primary,
    marginLeft: spacing.lg + 80 + spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: {
    ...typography.heading.h2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...typography.body.large,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  shopButton: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: spacing.sm,
  },
  shopButtonText: {
    ...typography.button,
    color: colors.white,
  },
  summaryContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.primary,
    backgroundColor: colors.background.secondary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    ...typography.body.medium,
    color: colors.text.secondary,
  },
  summaryValue: {
    ...typography.body.medium,
    color: colors.text.primary,
    fontWeight: '500',
  },
  freeShipping: {
    color: colors.success[500],
  },
  freeShippingNote: {
    ...typography.body.small,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border.primary,
    paddingTop: spacing.sm,
    marginBottom: 0,
  },
  totalLabel: {
    ...typography.body.large,
    color: colors.text.primary,
    fontWeight: '600',
  },
  totalValue: {
    ...typography.body.large,
    color: colors.primary[500],
    fontWeight: '700',
  },
  checkoutContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.primary,
  },
  checkoutButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.md,
    borderRadius: spacing.sm,
    alignItems: 'center',
  },
  checkoutButtonText: {
    ...typography.button,
    color: colors.white,
  },
});

export default CartScreen;