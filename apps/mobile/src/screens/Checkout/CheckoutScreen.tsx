import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  TextInput,
} from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { CheckoutScreenProps } from '@/navigation/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/types';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'netbanking' | 'cod';
  name: string;
  details?: string;
}

type MainStackNavigationProp = NativeStackNavigationProp<MainStackParamList>;

const CheckoutScreen: React.FC<CheckoutScreenProps> = () => {
  const navigation = useNavigation<MainStackNavigationProp>();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [paymentMethods] = useState<PaymentMethod[]>([
    { id: '1', type: 'card', name: 'Credit/Debit Card' },
    { id: '2', type: 'upi', name: 'UPI Payment' },
    { id: '3', type: 'netbanking', name: 'Net Banking' },
    { id: '4', type: 'cod', name: 'Cash on Delivery' },
  ]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockCartItems: CartItem[] = [
      {
        id: '1',
        name: 'Premium Wireless Headphones',
        price: 2999,
        quantity: 1,
        image: 'https://via.placeholder.com/80x80/007bff/ffffff?text=P1',
      },
      {
        id: '2',
        name: 'Smart Fitness Watch',
        price: 1999,
        quantity: 2,
        image: 'https://via.placeholder.com/80x80/28a745/ffffff?text=P2',
      },
    ];

    const mockAddresses: Address[] = [
      {
        id: '1',
        name: 'John Doe',
        phone: '+91 9876543210',
        addressLine1: '123 Main Street',
        addressLine2: 'Apartment 4B',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        isDefault: true,
      },
      {
        id: '2',
        name: 'John Doe',
        phone: '+91 9876543210',
        addressLine1: '456 Office Complex',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400002',
        isDefault: false,
      },
    ];

    setTimeout(() => {
      setCartItems(mockCartItems);
      setAddresses(mockAddresses);
      setSelectedAddress(mockAddresses.find(addr => addr.isDefault) || mockAddresses[0]);
      setLoading(false);
    }, 1000);
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 500 ? 0 : 50;
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const total = subtotal + deliveryFee - discount;

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === 'save10') {
      setAppliedCoupon({ code: couponCode, discount: Math.min(subtotal * 0.1, 500) });
      Alert.alert('Coupon Applied', 'You saved ₹' + Math.min(subtotal * 0.1, 500));
    } else {
      Alert.alert('Invalid Coupon', 'Please enter a valid coupon code');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      Alert.alert('Address Required', 'Please select a delivery address');
      return;
    }

    if (!selectedPaymentMethod) {
      Alert.alert('Payment Method Required', 'Please select a payment method');
      return;
    }

    Alert.alert(
      'Order Placed',
      `Your order of ₹${total.toLocaleString()} has been placed successfully!`,
      [
        {
          text: 'View Orders',
          onPress: () => navigation.navigate('OrdersList'),
        },
        {
          text: 'Continue Shopping',
          onPress: () => navigation.navigate('HomeTabs', { screen: 'Home' }),
        },
      ]
    );
  };

  const renderCartItems = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Order Summary</Text>
      {cartItems.map((item) => (
        <View key={item.id} style={styles.cartItem}>
          <View style={styles.itemImagePlaceholder}>
            <Text style={styles.itemImageText}>IMG</Text>
          </View>
          
          <View style={styles.itemDetails}>
            <Text style={styles.itemName} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.itemPrice}>
              ₹{item.price.toLocaleString()} × {item.quantity}
            </Text>
          </View>
          
          <Text style={styles.itemTotal}>
            ₹{(item.price * item.quantity).toLocaleString()}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderAddressSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddressList')}
        >
          <Text style={styles.changeButton}>Change</Text>
        </TouchableOpacity>
      </View>
      
      {selectedAddress ? (
        <View style={styles.addressCard}>
          <Text style={styles.addressName}>{selectedAddress.name}</Text>
          <Text style={styles.addressPhone}>{selectedAddress.phone}</Text>
          <Text style={styles.addressText}>
            {selectedAddress.addressLine1}
            {selectedAddress.addressLine2 && `, ${selectedAddress.addressLine2}`}
          </Text>
          <Text style={styles.addressText}>
            {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
          </Text>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.addAddressButton}
          onPress={() => navigation.navigate('AddressForm', { isEditing: false })}
        >
          <Text style={styles.addAddressText}>+ Add Delivery Address</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderPaymentSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Payment Method</Text>
      {paymentMethods.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.paymentMethod,
            selectedPaymentMethod?.id === method.id && styles.selectedPaymentMethod,
          ]}
          onPress={() => setSelectedPaymentMethod(method)}
        >
          <View style={styles.paymentMethodLeft}>
            <View
              style={[
                styles.radioButton,
                selectedPaymentMethod?.id === method.id && styles.selectedRadioButton,
              ]}
            >
              {selectedPaymentMethod?.id === method.id && (
                <View style={styles.radioButtonInner} />
              )}
            </View>
            <Text style={styles.paymentMethodName}>{method.name}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderCouponSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Apply Coupon</Text>
      {appliedCoupon ? (
        <View style={styles.appliedCoupon}>
          <Text style={styles.appliedCouponText}>
            {appliedCoupon.code} - ₹{appliedCoupon.discount} off
          </Text>
          <TouchableOpacity onPress={handleRemoveCoupon}>
            <Text style={styles.removeCouponText}>Remove</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.couponContainer}>
          <TextInput
            style={styles.couponInput}
            placeholder="Enter coupon code"
            placeholderTextColor={colors.text.tertiary}
            value={couponCode}
            onChangeText={setCouponCode}
          />
          <TouchableOpacity
            style={styles.applyCouponButton}
            onPress={handleApplyCoupon}
          >
            <Text style={styles.applyCouponText}>Apply</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderPriceBreakdown = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Price Details</Text>
      
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Subtotal ({cartItems.length} items)</Text>
        <Text style={styles.priceValue}>₹{subtotal.toLocaleString()}</Text>
      </View>
      
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Delivery Fee</Text>
        <Text style={[styles.priceValue, deliveryFee === 0 && styles.freeText]}>
          {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
        </Text>
      </View>
      
      {discount > 0 && (
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Coupon Discount</Text>
          <Text style={[styles.priceValue, styles.discountText]}>
            -₹{discount.toLocaleString()}
          </Text>
        </View>
      )}
      
      <View style={[styles.priceRow, styles.totalRow]}>
        <Text style={styles.totalLabel}>Total Amount</Text>
        <Text style={styles.totalValue}>₹{total.toLocaleString()}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading checkout...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderCartItems()}
        {renderAddressSection()}
        {renderPaymentSection()}
        {renderCouponSection()}
        {renderPriceBreakdown()}
      </ScrollView>
      
      <View style={styles.bottomContainer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>₹{total.toLocaleString()}</Text>
          <Text style={styles.totalSubtext}>
            {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.placeOrderButton}
          onPress={handlePlaceOrder}
        >
          <Text style={styles.placeOrderText}>Place Order</Text>
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
  section: {
    backgroundColor: colors.background.primary,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.heading.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  changeButton: {
    ...typography.body.medium,
    color: colors.primary[500],
    fontWeight: '600',
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  itemImagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: colors.gray[100],
    borderRadius: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  itemImageText: {
    ...typography.body.small,
    color: colors.text.secondary,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    ...typography.body.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  itemPrice: {
    ...typography.body.small,
    color: colors.text.secondary,
  },
  itemTotal: {
    ...typography.body.large,
    color: colors.text.primary,
    fontWeight: '600',
  },
  addressCard: {
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  addressName: {
    ...typography.body.large,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  addressPhone: {
    ...typography.body.medium,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  addressText: {
    ...typography.body.medium,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  addAddressButton: {
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary[500],
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  addAddressText: {
    ...typography.body.medium,
    color: colors.primary[500],
    fontWeight: '600',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  selectedPaymentMethod: {
    backgroundColor: colors.primary[50],
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border.primary,
    marginRight: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadioButton: {
    borderColor: colors.primary[500],
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary[500],
  },
  paymentMethodName: {
    ...typography.body.medium,
    color: colors.text.primary,
  },
  couponContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  couponInput: {
    ...typography.body.medium,
    flex: 1,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.md,
    color: colors.text.primary,
  },
  applyCouponButton: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: spacing.sm,
  },
  applyCouponText: {
    ...typography.button,
    color: colors.white,
  },
  appliedCoupon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.success[50],
    padding: spacing.md,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.success[200],
  },
  appliedCouponText: {
    ...typography.body.medium,
    color: colors.success[700],
    fontWeight: '600',
  },
  removeCouponText: {
    ...typography.body.medium,
    color: colors.error[500],
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  priceLabel: {
    ...typography.body.medium,
    color: colors.text.secondary,
  },
  priceValue: {
    ...typography.body.medium,
    color: colors.text.primary,
  },
  freeText: {
    color: colors.success[500],
    fontWeight: '600',
  },
  discountText: {
    color: colors.success[500],
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border.primary,
    paddingTop: spacing.md,
    marginTop: spacing.sm,
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
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: colors.border.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  totalContainer: {
    flex: 1,
  },
  totalText: {
    ...typography.heading.h3,
    color: colors.text.primary,
  },
  totalSubtext: {
    ...typography.body.small,
    color: colors.text.secondary,
  },
  placeOrderButton: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: spacing.sm,
  },
  placeOrderText: {
    ...typography.button,
    color: colors.white,
  },
});

export default CheckoutScreen;