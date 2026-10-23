import '../../core/farm/farmer_state.dart';
import '../../providers/farm_provider.dart';

/// Kannada-first copy. English is the toggle language.
/// TODO: verify with a native speaker — every Kannada string below.
class Localization {
  static const Map<String, Map<AppLanguage, String>> _keys = {
    'app_name': {
      AppLanguage.en: 'SasyaMitra',
      AppLanguage.ml: 'സസ്യമിത്ര',
      AppLanguage.kn: 'ಸಸ್ಯಮಿತ್ರ', // TODO: verify with a native speaker
    },
    'nav_home': {
      AppLanguage.en: 'Home',
      AppLanguage.ml: 'ഹോം',
      AppLanguage.kn: 'ಮನೆ', // TODO: verify with a native speaker
    },
    'nav_crops': {
      AppLanguage.en: 'My crops',
      AppLanguage.ml: 'വിളകൾ',
      AppLanguage.kn: 'ನನ್ನ ಬೆಳೆ', // TODO: verify with a native speaker
    },
    'nav_alerts': {
      AppLanguage.en: 'Alerts',
      AppLanguage.ml: 'മുന്നറിയിപ്പ്',
      AppLanguage.kn: 'ಎಚ್ಚರಿಕೆ', // TODO: verify with a native speaker
    },
    'nav_workers': {
      AppLanguage.en: 'Workers',
      AppLanguage.ml: 'തൊഴിലാളികൾ',
      AppLanguage.kn: 'ಕೆಲಸಗಾರರು', // TODO: verify with a native speaker
    },
    'lang_en': {
      AppLanguage.en: 'English',
      AppLanguage.ml: 'English',
      AppLanguage.kn: 'English',
    },
    'lang_kn': {
      AppLanguage.en: 'ಕನ್ನಡ',
      AppLanguage.ml: 'ಕನ್ನಡ',
      AppLanguage.kn: 'ಕನ್ನಡ',
    },
    'paddy': {
      AppLanguage.en: 'Paddy',
      AppLanguage.ml: 'നെല്ല്',
      AppLanguage.kn: 'ಭತ್ತ', // TODO: verify with a native speaker
    },
    'arecanut': {
      AppLanguage.en: 'Arecanut',
      AppLanguage.ml: 'അടയ്ക്ക',
      AppLanguage.kn: 'ಅಡಿಕೆ', // TODO: verify with a native speaker
    },
    'demo_data': {
      AppLanguage.en: 'Demo data',
      AppLanguage.ml: 'ഡെമോ ഡാറ്റ',
      AppLanguage.kn: 'ಡೆಮೊ ದತ್ತಾಂಶ', // TODO: verify with a native speaker
    },
    'verdict_storm': {
      AppLanguage.en: "Don't water. Cover or harvest now.",
      AppLanguage.ml: 'നനയ്ക്കരുത്. മൂടുക അല്ലെങ്കിൽ വിളവെടുക്കുക.',
      AppLanguage.kn: 'ನೀರು ಹಾಕಬೇಡಿ. ಮುಚ್ಚಿ ಅಥವಾ ಕೊಯ್ಲು ಮಾಡಿ.', // TODO: verify with a native speaker
    },
    'verdict_fungal': {
      AppLanguage.en: 'Delay watering. Check crop.',
      AppLanguage.ml: 'നനയ്ക്കൽ നിർത്തുക. വിള പരിശോധിക്കുക.',
      AppLanguage.kn: 'ನೀರು ತಡೆ. ಬೆಳೆ ನೋಡಿ.', // TODO: verify with a native speaker
    },
    'verdict_dry': {
      AppLanguage.en: 'Water now.',
      AppLanguage.ml: 'ഇപ്പോൾ നനയ്ക്കുക.',
      AppLanguage.kn: 'ಈಗ ನೀರು ಹಾಕಿ.', // TODO: verify with a native speaker
    },
    'verdict_good': {
      AppLanguage.en: 'Looking good.',
      AppLanguage.ml: 'നല്ല നിലയിലാണ്.',
      AppLanguage.kn: 'ಚೆನ್ನಾಗಿದೆ.', // TODO: verify with a native speaker
    },
    'action_storm': {
      AppLanguage.en: 'See storm steps',
      AppLanguage.ml: 'നടപടികൾ കാണുക',
      AppLanguage.kn: 'ಮುಂದಿನ ಹಂತ ನೋಡಿ', // TODO: verify with a native speaker
    },
    'action_fungal': {
      AppLanguage.en: 'Check crop',
      AppLanguage.ml: 'വിള പരിശോധിക്കുക',
      AppLanguage.kn: 'ಬೆಳೆ ಪರಿಶೀಲಿಸಿ', // TODO: verify with a native speaker
    },
    'action_water': {
      AppLanguage.en: 'Start watering',
      AppLanguage.ml: 'നനയ്ക്കുക',
      AppLanguage.kn: 'ನೀರು ಹಾಕಿ', // TODO: verify with a native speaker
    },
    'action_good': {
      AppLanguage.en: 'See my crops',
      AppLanguage.ml: 'വിളകൾ കാണുക',
      AppLanguage.kn: 'ಬೆಳೆ ನೋಡಿ', // TODO: verify with a native speaker
    },
    'thirsty': {
      AppLanguage.en: 'Thirsty',
      AppLanguage.ml: 'വരണ്ടത്',
      AppLanguage.kn: 'ಬಾಯಾರಿದೆ', // TODO: verify with a native speaker
    },
    'happy': {
      AppLanguage.en: 'Happy',
      AppLanguage.ml: 'നല്ലത്',
      AppLanguage.kn: 'ಸಂತೋಷ', // TODO: verify with a native speaker
    },
    'too_wet': {
      AppLanguage.en: 'Too wet',
      AppLanguage.ml: 'അധികം നനഞ്ഞത്',
      AppLanguage.kn: 'ಹೆಚ್ಚು ಒದ್ದೆ', // TODO: verify with a native speaker
    },
    'fungal_indicator': {
      AppLanguage.en: 'Fungal risk indicator',
      AppLanguage.ml: 'കുമിൾ സൂചകം',
      AppLanguage.kn: 'ಶಿಲೀಂಧ್ರ ಅಪಾಯ ಸೂಚಕ', // TODO: verify with a native speaker
    },
    'storm_risk': {
      AppLanguage.en: 'Storm risk',
      AppLanguage.ml: 'കൊടുങ്കാറ്റ് സാധ്യത',
      AppLanguage.kn: 'ಚಂಡಮಾರುತ ಅಪಾಯ', // TODO: verify with a native speaker
    },
    'risk_low': {
      AppLanguage.en: 'Low',
      AppLanguage.ml: 'കുറവ്',
      AppLanguage.kn: 'ಕಡಿಮೆ', // TODO: verify with a native speaker
    },
    'risk_watch': {
      AppLanguage.en: 'Watch',
      AppLanguage.ml: 'ശ്രദ്ധിക്കുക',
      AppLanguage.kn: 'ಗಮನಿಸಿ', // TODO: verify with a native speaker
    },
    'risk_high': {
      AppLanguage.en: 'Act now',
      AppLanguage.ml: 'ഉടൻ നടപടി',
      AppLanguage.kn: 'ಈಗ ಕ್ರಮ', // TODO: verify with a native speaker
    },
    'open_crop': {
      AppLanguage.en: 'Open crop',
      AppLanguage.ml: 'വിള തുറക്കുക',
      AppLanguage.kn: 'ಬೆಳೆ ತೆರೆಯಿರಿ', // TODO: verify with a native speaker
    },
    'tile_water': {
      AppLanguage.en: 'Water',
      AppLanguage.ml: 'വെള്ളം',
      AppLanguage.kn: 'ನೀರು', // TODO: verify with a native speaker
    },
    'tile_rain': {
      AppLanguage.en: 'Rain',
      AppLanguage.ml: 'മഴ',
      AppLanguage.kn: 'ಮಳೆ', // TODO: verify with a native speaker
    },
    'tile_pump': {
      AppLanguage.en: 'Pump',
      AppLanguage.ml: 'പമ്പ്',
      AppLanguage.kn: 'ಪಂಪ್', // TODO: verify with a native speaker
    },
    'pump_on': {
      AppLanguage.en: 'On',
      AppLanguage.ml: 'ഓൺ',
      AppLanguage.kn: 'ಚಾಲನೆ', // TODO: verify with a native speaker
    },
    'pump_off': {
      AppLanguage.en: 'Off',
      AppLanguage.ml: 'ഓഫ്',
      AppLanguage.kn: 'ನಿಲ್ಲಿಸಿದೆ', // TODO: verify with a native speaker
    },
    'approve_pump': {
      AppLanguage.en: 'Approve pump',
      AppLanguage.ml: 'പമ്പ് അനുവദിക്കുക',
      AppLanguage.kn: 'ಪಂಪ್ ಒಪ್ಪಿಸಿ', // TODO: verify with a native speaker
    },
    'dismiss_alert': {
      AppLanguage.en: 'Not now',
      AppLanguage.ml: 'ഇപ്പോൾ വേണ്ട',
      AppLanguage.kn: 'ಈಗ ಬೇಡ', // TODO: verify with a native speaker
    },
    'no_alerts': {
      AppLanguage.en: 'No alerts right now.',
      AppLanguage.ml: 'ഇപ്പോൾ മുന്നറിയിപ്പില്ല.',
      AppLanguage.kn: 'ಈಗ ಎಚ್ಚರಿಕೆ ಇಲ್ಲ.', // TODO: verify with a native speaker
    },
    'my_workers': {
      AppLanguage.en: 'My workers',
      AppLanguage.ml: 'തൊഴിലാളികൾ',
      AppLanguage.kn: 'ನನ್ನ ಕೆಲಸಗಾರರು', // TODO: verify with a native speaker
    },
    'request_workers': {
      AppLanguage.en: 'Request workers',
      AppLanguage.ml: 'തൊഴിലാളികളെ വിളിക്കുക',
      AppLanguage.kn: 'ಕೆಲಸಗಾರರನ್ನು ಕೇಳಿ', // TODO: verify with a native speaker
    },
    'add_worker': {
      AppLanguage.en: 'Add worker',
      AppLanguage.ml: 'ചേർക്കുക',
      AppLanguage.kn: 'ಸೇರಿಸಿ', // TODO: verify with a native speaker
    },
    'worker_name': {
      AppLanguage.en: 'Name',
      AppLanguage.ml: 'പേര്',
      AppLanguage.kn: 'ಹೆಸರು', // TODO: verify with a native speaker
    },
    'worker_phone': {
      AppLanguage.en: 'Phone',
      AppLanguage.ml: 'ഫോൺ',
      AppLanguage.kn: 'ಫೋನ್', // TODO: verify with a native speaker
    },
    'demo_panel': {
      AppLanguage.en: 'Demo scenes',
      AppLanguage.ml: 'ഡെമോ',
      AppLanguage.kn: 'ಡೆಮೊ ದೃಶ್ಯ', // TODO: verify with a native speaker
    },
    'scene_dry': {
      AppLanguage.en: 'Dry',
      AppLanguage.ml: 'വരണ്ടത്',
      AppLanguage.kn: 'ಒಣ', // TODO: verify with a native speaker
    },
    'scene_happy': {
      AppLanguage.en: 'Happy',
      AppLanguage.ml: 'നല്ലത്',
      AppLanguage.kn: 'ಸಂತೋಷ', // TODO: verify with a native speaker
    },
    'scene_rain': {
      AppLanguage.en: 'Rain coming',
      AppLanguage.ml: 'മഴ വരുന്നു',
      AppLanguage.kn: 'ಮಳೆ ಬರುತ್ತಿದೆ', // TODO: verify with a native speaker
    },
    'scene_storm': {
      AppLanguage.en: 'Storm',
      AppLanguage.ml: 'കൊടുങ്കാറ്റ്',
      AppLanguage.kn: 'ಚಂಡಮಾರುತ', // TODO: verify with a native speaker
    },
    'scene_fungal': {
      AppLanguage.en: 'Fungal risk high',
      AppLanguage.ml: 'കുമിൾ അപകടം',
      AppLanguage.kn: 'ಶಿಲೀಂಧ್ರ ಅಪಾಯ ಹೆಚ್ಚು', // TODO: verify with a native speaker
    },
    'clear_demo': {
      AppLanguage.en: 'Use live data',
      AppLanguage.ml: 'ലൈവ് ഡാറ്റ',
      AppLanguage.kn: 'ಲೈವ್ ದತ್ತಾಂಶ', // TODO: verify with a native speaker
    },
    'offline': {
      AppLanguage.en: 'Device offline',
      AppLanguage.ml: 'ഓഫ്‌ലൈൻ',
      AppLanguage.kn: 'ಸಾಧನ ಆಫ್‌ಲೈನ್', // TODO: verify with a native speaker
    },
    'live': {
      AppLanguage.en: 'Live',
      AppLanguage.ml: 'ലൈവ്',
      AppLanguage.kn: 'ಲೈವ್', // TODO: verify with a native speaker
    },
    // Kept for older screens still in the tree
    'overview': {
      AppLanguage.en: 'Home',
      AppLanguage.ml: 'ഹോം',
      AppLanguage.kn: 'ಮನೆ',
    },
    'details': {
      AppLanguage.en: 'Details',
      AppLanguage.ml: 'വിശദാംശങ്ങൾ',
      AppLanguage.kn: 'ವಿವರಗಳು',
    },
    'settings': {
      AppLanguage.en: 'Settings',
      AppLanguage.ml: 'ക്രമീകരണങ്ങൾ',
      AppLanguage.kn: 'ಸಂಯೋಜನೆಗಳು',
    },
    'my_crops': {
      AppLanguage.en: 'My crops',
      AppLanguage.ml: 'വിളകൾ',
      AppLanguage.kn: 'ನನ್ನ ಬೆಳೆ',
    },
  };

  static String translate(String key, AppLanguage lang) {
    final row = _keys[key];
    if (row == null) return key;
    return row[lang] ?? row[AppLanguage.kn] ?? key;
  }

  static String t(String key, AppLanguage lang) => translate(key, lang);

  static String cropName(CropSlice slice, AppLanguage lang) {
    return slice.crop.name == 'arecanut' ? t('arecanut', lang) : t('paddy', lang);
  }

  static String verdictLine(VerdictKind kind, AppLanguage lang) {
    return switch (kind) {
      VerdictKind.storm => t('verdict_storm', lang),
      VerdictKind.fungal => t('verdict_fungal', lang),
      VerdictKind.dry => t('verdict_dry', lang),
      VerdictKind.good => t('verdict_good', lang),
    };
  }

  static String verdictAction(VerdictKind kind, AppLanguage lang) {
    return switch (kind) {
      VerdictKind.storm => t('action_storm', lang),
      VerdictKind.fungal => t('action_fungal', lang),
      VerdictKind.dry => t('action_water', lang),
      VerdictKind.good => t('action_good', lang),
    };
  }

  static String soilWord(SoilMood mood, AppLanguage lang) {
    return switch (mood) {
      SoilMood.thirsty => t('thirsty', lang),
      SoilMood.happy => t('happy', lang),
      SoilMood.tooWet => t('too_wet', lang),
    };
  }

  static String fungalWord(FungalBand band, AppLanguage lang) {
    return switch (band) {
      FungalBand.low => t('risk_low', lang),
      FungalBand.watch => t('risk_watch', lang),
      FungalBand.high => t('risk_high', lang),
    };
  }
}
