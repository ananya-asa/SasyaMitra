import 'package:flutter/material.dart';

class AppTheme {
  // Swatch Palette (Natural Organic Agriculture)
  static const primaryGreen = Color(0xFF598923); // #598923 - Vibrant Leaf Green
  static const sproutGreen  = Color(0xFF84AF57); // #84af57 - Fresh Sprout Green
  static const fieldGreen   = Color(0xFF447111); // #447111 - Rich Field Green
  static const oliveGreen   = Color(0xFF75853E); // #75853e - Olive Moss
  static const deepOlive    = Color(0xFF576F1C); // #576f1c - Deep Olive
  static const deepHarvest  = Color(0xFF2D5007); // #2d5007 - Deep Harvest Green
  static const forestGreen  = Color(0xFF334E3C); // #334e3c - Deep Forest Spruce
  static const slateSage    = Color(0xFF4B6861); // #4b6861 - Slate Sage
  static const earthClay    = Color(0xFFAE7B6A); // #ae7b6a - Warm Terracotta Clay
  static const mistGrey     = Color(0xFFB4B5C2); // #b4b5c2 - Soft Mist Grey
  
  // Dark Theme Backgrounds & Surfaces
  static const darkBg       = Color(0xFF131B11); // #131b11 - Deep Charcoal Green
  static const panel        = Color(0xFF203015); // #203015 - Deep Surface Panel
  static const panelAlt     = Color(0xFF334E3C); // #334e3c - Spruce Accent Panel
  
  // Semantic Tokens
  static const success      = Color(0xFF598923); // Vibrant Green
  static const accentGreen  = Color(0xFF84AF57); // Light Sprout
  static const warning      = Color(0xFFAE7B6A); // Terracotta Alert
  static const danger       = Color(0xFFDC2626); // Alert Red
  static const lightBg      = Color(0xFFF7F9F6); // Soft clean agricultural paper
  static const paleGreen    = Color(0xFFEAF2E4);

  static ThemeData get dark {
    final scheme = ColorScheme.fromSeed(
      seedColor: primaryGreen,
      brightness: Brightness.dark,
      primary: primaryGreen,
      secondary: sproutGreen,
      surface: panel,
    );
    return ThemeData(
      useMaterial3: true,
      colorScheme: scheme,
      scaffoldBackgroundColor: darkBg,
      fontFamily: 'Roboto',
      cardTheme: CardThemeData(
        color: panel,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(22),
          side: const BorderSide(color: Color(0xFF334E3C), width: 1.5),
        ),
      ),
      navigationRailTheme: NavigationRailThemeData(
        backgroundColor: darkBg,
        selectedIconTheme: const IconThemeData(color: sproutGreen),
        selectedLabelTextStyle: const TextStyle(color: sproutGreen, fontWeight: FontWeight.bold),
        unselectedIconTheme: const IconThemeData(color: mistGrey),
        unselectedLabelTextStyle: const TextStyle(color: mistGrey),
      ),
    );
  }

  static ThemeData get light {
    final scheme = ColorScheme.fromSeed(
      seedColor: primaryGreen,
      primary: primaryGreen,
      secondary: sproutGreen,
    );
    return ThemeData(
      useMaterial3: true,
      colorScheme: scheme,
      scaffoldBackgroundColor: lightBg,
      cardTheme: CardThemeData(
        color: Colors.white,
        elevation: 2,
        shadowColor: Colors.black.withOpacity(0.04),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(22),
          side: const BorderSide(color: Color(0xFFE2E9DF), width: 1.5),
        ),
      ),
    );
  }
}
