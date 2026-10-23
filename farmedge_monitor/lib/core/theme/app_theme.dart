import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Palette extracted from the dark-forest farming UI reference.
/// Translucent cards, white type, one lime accent, traffic-light status.
class AppTheme {
  AppTheme._();

  // Background gradient
  static const bgTop = Color(0xFF06140C);
  static const bgMid = Color(0xFF0B1F12);
  static const bgBottom = Color(0xFF12301A);

  // Surfaces
  static const card = Color(0xD9142A18);
  static const cardSolid = Color(0xFF142A18);
  static const cardHighlight = Color(0xCC1B3A22);
  static const stroke = Color(0x33FFFFFF);
  static const strokeStrong = Color(0x55C5E05A);

  // Type
  static const textPrimary = Color(0xFFF7FBF4);
  static const textSecondary = Color(0xFFB7CDB8);
  static const textMuted = Color(0xFF7F9A82);

  // Accent (primary actions only)
  static const accent = Color(0xFFC5E05A);
  static const accentDeep = Color(0xFF8FB03A);
  static const accentInk = Color(0xFF1A2A0C);

  // Status — never used without an icon + word
  static const good = Color(0xFF6FCF63);
  static const watch = Color(0xFFE6B84A);
  static const act = Color(0xFFE25B4A);

  // Compat aliases used by older screens
  static const primaryGreen = accentDeep;
  static const sproutGreen = accent;
  static const fieldGreen = Color(0xFF2F6A28);
  static const oliveGreen = Color(0xFF5C7A3A);
  static const deepOlive = Color(0xFF3A5420);
  static const deepHarvest = bgBottom;
  static const forestGreen = cardSolid;
  static const slateSage = textMuted;
  static const earthClay = watch;
  static const mistGrey = textSecondary;
  static const darkBg = bgTop;
  static const panel = cardSolid;
  static const panelAlt = cardHighlight;
  static const success = good;
  static const accentGreen = accent;
  static const warning = watch;
  static const danger = act;
  static const lightBg = Color(0xFFEFF6E8);
  static const paleGreen = Color(0xFFDCECC8);

  static const bodySize = 18.0;
  static const headingSize = 28.0;
  static const buttonHeight = 56.0;
  static const tapTarget = 48.0;
  static const radius = 22.0;

  static TextTheme _textTheme(Brightness brightness) {
    final baseColor =
        brightness == Brightness.dark ? textPrimary : const Color(0xFF122016);
    return GoogleFonts.notoSansKannadaTextTheme(
      TextTheme(
        displayLarge: TextStyle(
          fontSize: 36,
          fontWeight: FontWeight.w800,
          height: 1.15,
          color: baseColor,
        ),
        headlineMedium: TextStyle(
          fontSize: headingSize,
          fontWeight: FontWeight.w800,
          height: 1.2,
          color: baseColor,
        ),
        headlineSmall: TextStyle(
          fontSize: 22,
          fontWeight: FontWeight.w700,
          height: 1.25,
          color: baseColor,
        ),
        bodyLarge: TextStyle(
          fontSize: bodySize,
          fontWeight: FontWeight.w500,
          height: 1.4,
          color: baseColor,
        ),
        bodyMedium: TextStyle(
          fontSize: bodySize,
          fontWeight: FontWeight.w500,
          height: 1.4,
          color: brightness == Brightness.dark ? textSecondary : const Color(0xFF3D5342),
        ),
        labelLarge: const TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.w800,
          letterSpacing: 0.2,
        ),
      ),
    );
  }

  static ThemeData get dark {
    final scheme = const ColorScheme.dark(
      primary: accent,
      onPrimary: accentInk,
      secondary: good,
      surface: cardSolid,
      onSurface: textPrimary,
      error: act,
    );
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: scheme,
      scaffoldBackgroundColor: bgTop,
      textTheme: _textTheme(Brightness.dark),
      fontFamily: GoogleFonts.notoSansKannada().fontFamily,
      appBarTheme: AppBarTheme(
        backgroundColor: bgTop,
        foregroundColor: textPrimary,
        elevation: 0,
        titleTextStyle: GoogleFonts.notoSansKannada(
          fontSize: 22,
          fontWeight: FontWeight.w800,
          color: textPrimary,
        ),
      ),
      cardTheme: CardThemeData(
        color: card,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(radius),
          side: const BorderSide(color: stroke, width: 1.4),
        ),
      ),
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: bgMid,
        indicatorColor: accent.withValues(alpha: 0.22),
        labelTextStyle: WidgetStatePropertyAll(
          GoogleFonts.notoSansKannada(fontSize: 12, fontWeight: FontWeight.w700),
        ),
      ),
    );
  }

  static ThemeData get light {
    final scheme = ColorScheme.fromSeed(
      seedColor: accentDeep,
      brightness: Brightness.light,
    );
    return ThemeData(
      useMaterial3: true,
      colorScheme: scheme,
      scaffoldBackgroundColor: lightBg,
      textTheme: _textTheme(Brightness.light),
      fontFamily: GoogleFonts.notoSansKannada().fontFamily,
      cardTheme: CardThemeData(
        color: Colors.white,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(radius),
          side: const BorderSide(color: Color(0xFFD7E4CF), width: 1.4),
        ),
      ),
    );
  }

  static BoxDecoration forestBackdrop() {
    return const BoxDecoration(
      gradient: LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [bgTop, bgMid, bgBottom],
      ),
    );
  }
}
