import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { CategoriesScreenProps } from '@/navigation/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/types';

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  productCount: number;
  subcategories?: Category[];
}

type MainStackNavigationProp = NativeStackNavigationProp<MainStackParamList>;

const CategoriesScreen: React.FC<CategoriesScreenProps> = () => {
  const navigation = useNavigation<MainStackNavigationProp>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      // TODO: Replace with actual API call
      // Simulating API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockCategories: Category[] = [
        {
          id: '1',
          name: 'Electronics',
          slug: 'electronics',
          productCount: 1250,
        },
        {
          id: '2',
          name: 'Fashion',
          slug: 'fashion',
          productCount: 2100,
        },
        {
          id: '3',
          name: 'Home & Kitchen',
          slug: 'home-kitchen',
          productCount: 890,
        },
        {
          id: '4',
          name: 'Books',
          slug: 'books',
          productCount: 560,
        },
        {
          id: '5',
          name: 'Sports & Fitness',
          slug: 'sports-fitness',
          productCount: 340,
        },
        {
          id: '6',
          name: 'Beauty & Personal Care',
          slug: 'beauty-personal-care',
          productCount: 780,
        },
        {
          id: '7',
          name: 'Automotive',
          slug: 'automotive',
          productCount: 420,
        },
        {
          id: '8',
          name: 'Toys & Games',
          slug: 'toys-games',
          productCount: 290,
        },
      ];
      
      setCategories(mockCategories);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryPress = (category: Category) => {
    navigation.navigate('ProductList', {
      categorySlug: category.slug,
      categoryId: category.id,
      title: category.name,
    });
  };

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => handleCategoryPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.categoryImageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.categoryImage} />
        ) : (
          <View style={styles.categoryImagePlaceholder}>
            <Text style={styles.categoryImagePlaceholderText}>
              {item.name.charAt(0)}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName}>{item.name}</Text>
        <Text style={styles.categoryProductCount}>
          {item.productCount} products
        </Text>
      </View>
      
      <View style={styles.categoryArrow}>
        <Text style={styles.categoryArrowText}>›</Text>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Categories</Text>
      <Text style={styles.headerSubtitle}>
        Browse products by category
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Text style={styles.loadingText}>Loading categories...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    ...typography.body.medium,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  listContent: {
    paddingBottom: spacing.lg,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.background.primary,
  },
  headerTitle: {
    ...typography.heading.h1,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.body.large,
    color: colors.text.secondary,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.primary,
  },
  categoryImageContainer: {
    marginRight: spacing.md,
  },
  categoryImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.background.secondary,
  },
  categoryImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryImagePlaceholderText: {
    ...typography.heading.h3,
    color: colors.primary[500],
    fontWeight: '600',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    ...typography.body.large,
    color: colors.text.primary,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  categoryProductCount: {
    ...typography.body.small,
    color: colors.text.secondary,
  },
  categoryArrow: {
    marginLeft: spacing.sm,
  },
  categoryArrowText: {
    ...typography.heading.h2,
    color: colors.text.tertiary,
    fontWeight: '300',
  },
  separator: {
    height: 1,
    backgroundColor: colors.border.primary,
    marginLeft: spacing.lg + 50 + spacing.md, // Align with category info
  },
});

export default CategoriesScreen;