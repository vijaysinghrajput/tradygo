import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { colors, spacing, typography } from '@/theme';

const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome to TradyGo</Text>
          <Text style={styles.subtitleText}>Discover amazing products</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Categories</Text>
          <View style={styles.categoriesContainer}>
            <Text style={styles.placeholderText}>Categories will be displayed here</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <View style={styles.productsContainer}>
            <Text style={styles.placeholderText}>Products will be displayed here</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Offers</Text>
          <View style={styles.offersContainer}>
            <Text style={styles.placeholderText}>Special offers will be displayed here</Text>
          </View>
        </View>
      </ScrollView>
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
  contentContainer: {
    paddingBottom: spacing.xl,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.primary[500],
    marginBottom: spacing.md,
  },
  welcomeText: {
    ...typography.heading.h1,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  subtitleText: {
    ...typography.body.large,
    color: colors.white,
    opacity: 0.9,
  },
  section: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    ...typography.heading.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  categoriesContainer: {
    backgroundColor: colors.background.secondary,
    padding: spacing.lg,
    borderRadius: spacing.sm,
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productsContainer: {
    backgroundColor: colors.background.secondary,
    padding: spacing.lg,
    borderRadius: spacing.sm,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  offersContainer: {
    backgroundColor: colors.background.secondary,
    padding: spacing.lg,
    borderRadius: spacing.sm,
    minHeight: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    ...typography.body.medium,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

export default HomeScreen;