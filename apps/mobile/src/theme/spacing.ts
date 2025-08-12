export const spacing = {
  // Base spacing unit (4px)
  unit: 4,
  
  // Spacing scale
  xs: 4,   // 4px
  sm: 8,   // 8px
  md: 12,  // 12px
  lg: 16,  // 16px
  xl: 20,  // 20px
  '2xl': 24, // 24px
  '3xl': 32, // 32px
  '4xl': 40, // 40px
  '5xl': 48, // 48px
  '6xl': 64, // 64px
  
  // Semantic spacing
  padding: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  
  margin: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  
  // Component specific spacing
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  
  input: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  
  card: {
    padding: 16,
    margin: 8,
  },
  
  screen: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  
  // Border radius
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    '3xl': 24,
    full: 9999,
  },
};

export type Spacing = typeof spacing;