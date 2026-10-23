import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/theme/app_theme.dart';
import '../../core/localization/localization.dart';
import '../../models/farm_status.dart';
import '../../providers/farm_provider.dart';
import '../../widgets/connection_status.dart';
import '../../widgets/line_chart.dart';
import '../../widgets/pump_indicator.dart';
import '../../widgets/sensor_card.dart';
import '../../widgets/weather_card.dart';
import '../../widgets/voice_assistant_dialog.dart';

class DashboardScreen extends ConsumerStatefulWidget {
  const DashboardScreen({super.key});

  @override
  ConsumerState<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends ConsumerState<DashboardScreen> {
  late Timer _clockTimer;
  DateTime _now = DateTime.now();

  @override
  void initState() {
    super.initState();
    _clockTimer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (mounted) setState(() => _now = DateTime.now());
    });
  }

  @override
  void dispose() {
    _clockTimer.cancel();
    super.dispose();
  }

  void _showTomorrowPrediction(BuildContext context) {
    final status = ref.read(farmProvider).status;
    final forecast = status?.weatherForecast ?? 'STABLE';
    
    showDialog<void>(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Row(
            children: [
              Icon(Icons.psychology, color: AppTheme.success),
              SizedBox(width: 10),
              Text('Edge ML Weather Predictor', style: TextStyle(fontWeight: FontWeight.bold)),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'TinyML Model running on-chip predicts:',
                style: TextStyle(fontSize: 12, color: Colors.grey),
              ),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: forecast == 'STORM_ALERT'
                      ? AppTheme.danger.withOpacity(0.12)
                      : (forecast == 'RAIN_COMING' ? AppTheme.warning.withOpacity(0.12) : AppTheme.success.withOpacity(0.12)),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    Icon(
                      forecast == 'STORM_ALERT'
                          ? Icons.warning_amber_rounded
                          : (forecast == 'RAIN_COMING' ? Icons.cloud_queue : Icons.wb_sunny_outlined),
                      color: forecast == 'STORM_ALERT'
                          ? AppTheme.danger
                          : (forecast == 'RAIN_COMING' ? AppTheme.warning : AppTheme.success),
                    ),
                    const SizedBox(width: 10),
                    Text(
                      forecast == 'STORM_ALERT'
                          ? 'STORM ALERT'
                          : (forecast == 'RAIN_COMING' ? 'RAIN EXPECTED' : 'STABLE WEATHER'),
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: forecast == 'STORM_ALERT'
                            ? AppTheme.danger
                            : (forecast == 'RAIN_COMING' ? AppTheme.warning : AppTheme.success),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              Text(
                forecast == 'STORM_ALERT'
                    ? 'Local barometric pressure is falling rapidly. Secure field assets and prepare drainage.'
                    : (forecast == 'RAIN_COMING'
                        ? 'High humidity and temperature drop indicate precipitation. Consider delaying scheduled irrigation.'
                        : 'No storm or rain threats detected at the edge. Safe to continue normal operations.'),
                style: const TextStyle(fontSize: 13),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Close'),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final farm = ref.watch(farmProvider);
    final settings = ref.watch(settingsProvider);
    final status = farm.status;
    final apiTemperature = status?.temperature ?? 0.0;
    final csvTemperature = status?.temperature ?? 0.0;
    
    final tempVal = settings.temperatureUnit == TemperatureUnit.celsius 
        ? apiTemperature 
        : (apiTemperature * 9 / 5) + 32;
    final csvTempVal = settings.temperatureUnit == TemperatureUnit.celsius 
        ? csvTemperature 
        : (csvTemperature * 9 / 5) + 32;

    final tempUnit = settings.temperatureUnit == TemperatureUnit.celsius ? '°C' : '°F';
    final lang = settings.language;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final isMobile = MediaQuery.of(context).size.width < 768;

    return Scaffold(
      backgroundColor: isDark ? AppTheme.darkBg : AppTheme.lightBg,
      bottomNavigationBar: isMobile
          ? NavigationBar(
              selectedIndex: 0,
              backgroundColor: isDark ? AppTheme.panel : Colors.white,
              indicatorColor: AppTheme.sproutGreen.withOpacity(0.25),
              onDestinationSelected: (idx) {
                if (idx == 1) context.go('/details');
                if (idx == 2) context.go('/insights');
                if (idx == 3) context.go('/settings');
              },
              destinations: [
                NavigationDestination(
                  icon: const Icon(Icons.home_outlined),
                  selectedIcon: const Icon(Icons.home_rounded, color: AppTheme.sproutGreen),
                  label: Localization.translate('overview', lang),
                ),
                NavigationDestination(
                  icon: const Icon(Icons.eco_outlined),
                  selectedIcon: const Icon(Icons.eco_rounded, color: AppTheme.sproutGreen),
                  label: Localization.translate('my_crops', lang),
                ),
                NavigationDestination(
                  icon: const Icon(Icons.analytics_outlined),
                  selectedIcon: const Icon(Icons.analytics_rounded, color: AppTheme.sproutGreen),
                  label: Localization.translate('details', lang),
                ),
                NavigationDestination(
                  icon: const Icon(Icons.settings_outlined),
                  selectedIcon: const Icon(Icons.settings_rounded, color: AppTheme.sproutGreen),
                  label: Localization.translate('settings', lang),
                ),
              ],
            )
          : null,
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppTheme.primaryGreen,
        elevation: 4,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(30),
          side: const BorderSide(color: AppTheme.sproutGreen, width: 1.5),
        ),
        icon: const Icon(Icons.mic_rounded, color: Colors.white, size: 22),
        label: Text(
          lang == AppLanguage.ml ? 'ചോദിക്കൂ' : (lang == AppLanguage.kn ? 'ಕೇಳಿ' : 'Ask Copilot'),
          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 14),
        ),
        onPressed: () {
          showDialog(
            context: context,
            builder: (_) => const VoiceAssistantDialog(),
          );
        },
      ),
      body: Row(
        children: [
          if (!isMobile)
            _SideNav(
              selectedIndex: 0,
              language: lang,
              onDashboard: () {},
              onDetails: () => context.go('/details'),
              onInsights: () => context.go('/insights'),
              onSettings: () => context.go('/settings'),
            ),
          Expanded(
            child: SafeArea(
              child: RefreshIndicator(
                onRefresh: () => ref.read(farmProvider.notifier).refresh(),
                child: CustomScrollView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  slivers: [
                    SliverPadding(
                      padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
                      sliver: SliverList(
                        delegate: SliverChildListDelegate([
                          _TopBar(
                            isOnline: farm.isOnline,
                            language: lang,
                            onLanguageChanged: (newLang) {
                              if (newLang != null) {
                                ref.read(settingsProvider.notifier).update(
                                      settings.copyWith(language: newLang),
                                    );
                              }
                            },
                          ),
                          if (status?.weatherForecast == 'STORM_ALERT') ...[
                            const SizedBox(height: 16),
                            _StormAlertBanner(),
                          ],
                          if (status?.alert == 'NEEDS_WATER') ...[
                            const SizedBox(height: 16),
                            _IrrigationConfirmBanner(moisture: status?.soilMoisture ?? 0.0),
                          ],
                          const SizedBox(height: 18),
                          _HeroOverview(
                            status: status,
                            now: _now,
                            isOnline: farm.isOnline,
                            temperature: tempVal,
                            tempUnit: tempUnit,
                            language: lang,
                          ),
                          const SizedBox(height: 18),
                          LayoutBuilder(
                            builder: (context, constraints) {
                              final wide = constraints.maxWidth >= 960;
                              final crops = _FarmerCropsSection(status: status, language: lang);
                              final attention = _AttentionNeededCard(status: status, language: lang);

                              if (wide) {
                                return Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Expanded(flex: 3, child: crops),
                                    const SizedBox(width: 16),
                                    Expanded(flex: 2, child: attention),
                                  ],
                                );
                              } else {
                                return Column(
                                  children: [
                                    crops,
                                    const SizedBox(height: 16),
                                    attention,
                                  ],
                                );
                              }
                            },
                          ),
                          const SizedBox(height: 20),
                          LayoutBuilder(
                            builder: (context, constraints) {
                              final wide = constraints.maxWidth >= 920;
                              final telemetry = _TelemetryGrid(
                                status: status,
                                temperature: csvTempVal,
                                tempUnit: tempUnit,
                                onViewAll: () => context.go('/details'),
                                language: lang,
                                onWeatherTap: () => _showTomorrowPrediction(context),
                              );
                              final sectorView = SizedBox(
                                height: wide ? 210 : 320,
                                child: _LiveSectorView(status: status),
                              );
                              
                              if (wide) {
                                return Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Expanded(flex: 7, child: telemetry),
                                    const SizedBox(width: 16),
                                    Expanded(flex: 3, child: sectorView),
                                  ],
                                );
                              } else {
                                return Column(
                                  children: [
                                    telemetry,
                                    const SizedBox(height: 16),
                                    sectorView,
                                  ],
                                );
                              }
                            },
                          ),
                          const SizedBox(height: 20),
                          LayoutBuilder(
                            builder: (context, constraints) {
                              final wide = constraints.maxWidth >= 980;
                              final stressPanel = _CropStressPanel(status: status, language: lang);
                              final trendsPanel = _TrendsPanel(history: farm.history, language: lang);
                              final sideColumn = Column(
                                children: [
                                  _TwinSyncPanel(isOnline: farm.isOnline),
                                  const SizedBox(height: 16),
                                  _IrrigationPipeline(isPumpActive: status?.pump ?? false),
                                ],
                              );
                              
                              if (wide) {
                                return Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Expanded(flex: 3, child: stressPanel),
                                    const SizedBox(width: 16),
                                    Expanded(flex: 4, child: trendsPanel),
                                    const SizedBox(width: 16),
                                    Expanded(flex: 3, child: sideColumn),
                                  ],
                                );
                              } else {
                                return Column(
                                  children: [
                                    stressPanel,
                                    const SizedBox(height: 16),
                                    trendsPanel,
                                    const SizedBox(height: 16),
                                    sideColumn,
                                  ],
                                );
                              }
                            },
                          ),
                          const SizedBox(height: 24),
                        ]),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _SideNav extends StatelessWidget {
  const _SideNav({
    required this.selectedIndex,
    required this.language,
    required this.onDashboard,
    required this.onDetails,
    required this.onInsights,
    required this.onSettings,
  });

  final int selectedIndex;
  final AppLanguage language;
  final VoidCallback onDashboard;
  final VoidCallback onDetails;
  final VoidCallback onInsights;
  final VoidCallback onSettings;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      width: 240,
      decoration: BoxDecoration(
        color: isDark ? AppTheme.darkBg : const Color(0xFFF7F9F6),
        border: Border(
          right: BorderSide(
            color: isDark ? const Color(0xFF334E3C) : const Color(0xFFE2E9DF),
            width: 1.5,
          ),
        ),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Brand Header: SASYAMITRA with a leaf icon directly under it
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(7),
                    decoration: BoxDecoration(
                      color: AppTheme.primaryGreen,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.eco_rounded, color: Colors.white, size: 20),
                  ),
                  const SizedBox(width: 10),
                  Text(
                    'SASYAMITRA',
                    style: TextStyle(
                      fontSize: 19,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 1.2,
                      color: isDark ? AppTheme.sproutGreen : AppTheme.fieldGreen,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Padding(
                padding: const EdgeInsets.only(left: 37),
                child: Text(
                  'COASTAL FARM EDGE',
                  style: TextStyle(
                    fontSize: 9,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 1.5,
                    color: isDark ? AppTheme.mistGrey : AppTheme.slateSage,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 32),

          // Menu Items
          _buildNavItem(
            context,
            icon: Icons.dashboard_rounded,
            label: Localization.translate('overview', language),
            isActive: selectedIndex == 0,
            onTap: onDashboard,
          ),
          _buildNavItem(
            context,
            icon: Icons.analytics_rounded,
            label: Localization.translate('details', language),
            isActive: selectedIndex == 1,
            onTap: onDetails,
          ),
          _buildNavItem(
            context,
            icon: Icons.warning_amber_rounded,
            label: 'Alert Center',
            isActive: selectedIndex == 2,
            onTap: onInsights,
          ),
          _buildNavItem(
            context,
            icon: Icons.settings_rounded,
            label: Localization.translate('settings', language),
            isActive: selectedIndex == 3,
            onTap: onSettings,
          ),

          const Spacer(),

          // New Crop Cycle Button
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () {},
              icon: const Icon(Icons.add, color: Colors.white, size: 18),
              label: const Text('New Crop Cycle', style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold)),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF1E3A2B),
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(24),
                ),
                elevation: 0,
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Help Support Link
          InkWell(
            onTap: () {},
            borderRadius: BorderRadius.circular(8),
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
              child: Row(
                children: [
                  Icon(Icons.help_outline_rounded, size: 20, color: isDark ? Colors.white60 : const Color(0xFF5A6B5D)),
                  const SizedBox(width: 12),
                  Text(
                    'Help Support',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: isDark ? Colors.white60 : const Color(0xFF5A6B5D),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNavItem(
    BuildContext context, {
    required IconData icon,
    required String label,
    required bool isActive,
    required VoidCallback onTap,
  }) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 13),
          decoration: BoxDecoration(
            color: isActive
                ? AppTheme.primaryGreen
                : Colors.transparent,
            borderRadius: BorderRadius.circular(16),
            border: isActive
                ? Border.all(color: AppTheme.sproutGreen.withOpacity(0.4), width: 1.5)
                : null,
          ),
          child: Row(
            children: [
              Icon(
                icon,
                color: isActive
                    ? Colors.white
                    : (isDark ? AppTheme.mistGrey : AppTheme.slateSage),
                size: 22,
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Text(
                  label,
                  style: TextStyle(
                    fontWeight: isActive ? FontWeight.w900 : FontWeight.w600,
                    fontSize: 14,
                    color: isActive
                        ? Colors.white
                        : (isDark ? Colors.white70 : const Color(0xFF2C3E2D)),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _TopBar extends StatelessWidget {
  const _TopBar({
    required this.isOnline,
    required this.language,
    required this.onLanguageChanged,
  });

  final bool isOnline;
  final AppLanguage language;
  final ValueChanged<AppLanguage?> onLanguageChanged;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Row(
      children: [
        // Search bar
        Expanded(
          child: Container(
            height: 42,
            constraints: const BoxConstraints(maxWidth: 400),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF13281E) : Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(
                color: isDark ? Colors.white.withOpacity(0.08) : Colors.black.withOpacity(0.06),
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.03),
                  blurRadius: 4,
                ),
              ],
            ),
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: [
                Icon(Icons.search, size: 20, color: isDark ? Colors.white38 : Colors.grey),
                const SizedBox(width: 8),
                Expanded(
                  child: TextField(
                    decoration: InputDecoration(
                      hintText: Localization.translate('search_farm_data', language),
                      hintStyle: TextStyle(fontSize: 13, color: isDark ? Colors.white38 : Colors.grey[400]),
                      border: InputBorder.none,
                      isDense: true,
                    ),
                    style: const TextStyle(fontSize: 13),
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(width: 16),

        // Live connection indicator
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
          decoration: BoxDecoration(
            color: isOnline 
                ? AppTheme.success.withOpacity(0.1) 
                : AppTheme.danger.withOpacity(0.1),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.wifi_tethering, size: 16, color: isOnline ? AppTheme.success : AppTheme.danger),
              const SizedBox(width: 6),
              Text(
                isOnline ? 'LIVE' : 'OFFLINE',
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  color: isOnline ? AppTheme.success : AppTheme.danger,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(width: 12),

        // Notification Bell
        Stack(
          children: [
            IconButton(
              icon: Icon(Icons.notifications_none_rounded, color: isDark ? Colors.white70 : Colors.black54),
              onPressed: () {},
            ),
            Positioned(
              right: 12,
              top: 12,
              child: Container(
                width: 7,
                height: 7,
                decoration: const BoxDecoration(
                  color: AppTheme.danger,
                  shape: BoxShape.circle,
                ),
              ),
            ),
          ],
        ),

        // Language switcher
        DropdownButtonHideUnderline(
          child: DropdownButton<AppLanguage>(
            value: language,
            icon: Icon(Icons.language_rounded, color: isDark ? Colors.white70 : Colors.black54),
            onChanged: onLanguageChanged,
            items: const [
              DropdownMenuItem(value: AppLanguage.en, child: Text('EN', style: TextStyle(fontSize: 12))),
              DropdownMenuItem(value: AppLanguage.ml, child: Text('ML', style: TextStyle(fontSize: 12))),
              DropdownMenuItem(value: AppLanguage.kn, child: Text('KN', style: TextStyle(fontSize: 12))),
            ],
          ),
        ),
        const SizedBox(width: 8),

        // Profile Avatar
        CircleAvatar(
          radius: 18,
          backgroundColor: isDark ? const Color(0xFF1E3A2B) : const Color(0xFFE4E9E6),
          child: Text(
            'AD',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: isDark ? Colors.white : const Color(0xFF1E3A2B),
            ),
          ),
        ),
      ],
    );
  }
}

class _HeroOverview extends StatelessWidget {
  const _HeroOverview({
    required this.status,
    required this.now,
    required this.isOnline,
    required this.temperature,
    required this.tempUnit,
    required this.language,
  });

  final FarmStatus? status;
  final DateTime now;
  final bool isOnline;
  final double temperature;
  final String tempUnit;
  final AppLanguage language;

  @override
  Widget build(BuildContext context) {
    final isMoistureCrit = (status?.soilMoisture ?? 50.0) < 35.0;
    final isMoistureWarn = (status?.soilMoisture ?? 50.0) < 45.0;

    final greeting = language == AppLanguage.ml
        ? 'നമസ്കാരം കർഷകരേ! 👋'
        : (language == AppLanguage.kn ? 'ನಮಸ್ಕಾರ ರೈತರೇ! 👋' : 'Hey Farmer! 👋');

    final statusMessage = isMoistureCrit
        ? (language == AppLanguage.ml ? 'ഉടൻ നനയ്ക്കണം! ജലസേചനം ആവശ്യമാണ്' : (language == AppLanguage.kn ? 'ತಕ್ಷಣ ನೀರುಣಿಸುವುದು ಅಗತ್ಯ!' : 'Zone B requires water right now.'))
        : (isMoistureWarn
            ? (language == AppLanguage.ml ? 'മണ്ണിലെ ഈർപ്പം കുറയുന്നു' : (language == AppLanguage.kn ? 'ಮಣ್ಣಿನ ತೇವಾಂಶ ಕಡಿಮೆಯಾಗಿದೆ' : 'Soil moisture is decreasing.'))
            : (language == AppLanguage.ml ? 'നിങ്ങളുടെ വിളകൾ ആരോഗ്യത്തോടെ വളരുന്നു' : (language == AppLanguage.kn ? 'ನಿಮ್ಮ ಬೆಳೆಗಳು ಉತ್ತಮವಾಗಿವೆ' : 'Your crops are looking healthy today.')));

    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(26),
        border: Border.all(
          color: const Color(0xFF84AF57).withOpacity(0.4),
          width: 2,
        ),
        gradient: const LinearGradient(
          colors: [Color(0xFF203015), Color(0xFF2D5007), Color(0xFF447111)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF2D5007).withOpacity(0.35),
            blurRadius: 20,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Top pill row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                decoration: BoxDecoration(
                  color: const Color(0xFF598923).withOpacity(0.3),
                  borderRadius: BorderRadius.circular(30),
                  border: Border.all(color: const Color(0xFF84AF57).withOpacity(0.5), width: 1.5),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.spa_rounded, size: 16, color: Color(0xFF84AF57)),
                    const SizedBox(width: 6),
                    Text(
                      Localization.translate('your_farm_today', language).toUpperCase(),
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 11,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 0.8,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: isOnline ? const Color(0xFF598923).withOpacity(0.3) : Colors.white10,
                  borderRadius: BorderRadius.circular(30),
                  border: Border.all(
                    color: isOnline ? const Color(0xFF84AF57) : Colors.white24,
                    width: 1.5,
                  ),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 8,
                      height: 8,
                      decoration: BoxDecoration(
                        color: isOnline ? const Color(0xFF84AF57) : Colors.grey,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      isOnline ? 'ESP32 LIVE' : 'OFFLINE',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 11,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),
          // Big Friendly Greeting
          Text(
            greeting,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 30,
              fontWeight: FontWeight.w900,
              letterSpacing: -0.5,
              height: 1.15,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            statusMessage,
            style: TextStyle(
              color: Colors.white.withOpacity(0.92),
              fontSize: 15,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 20),
          // 3 Big Chunky Quick-Stat Pills
          Row(
            children: [
              _buildOverlayBox(
                icon: Icons.grass_rounded,
                iconColor: const Color(0xFF84AF57),
                label: Localization.translate('paddy', language),
                value: '${(status?.soilMoisture ?? 65.0).toStringAsFixed(0)}%',
                tag: 'Optimal',
              ),
              const SizedBox(width: 12),
              _buildOverlayBox(
                icon: Icons.forest_rounded,
                iconColor: const Color(0xFFAE7B6A),
                label: Localization.translate('arecanut', language),
                value: '${((status?.soilMoisture ?? 45.0) * 0.75).toStringAsFixed(0)}%',
                tag: ((status?.soilMoisture ?? 45.0) * 0.75) < 40 ? 'Needs Water' : 'Optimal',
              ),
              const SizedBox(width: 12),
              _buildOverlayBox(
                icon: Icons.wb_sunny_rounded,
                iconColor: const Color(0xFF84AF57),
                label: 'WEATHER',
                value: '${temperature.round()}$tempUnit',
                tag: status?.rain == true ? 'Rain' : 'Sunny',
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildOverlayBox({
    required IconData icon,
    required Color iconColor,
    required String label,
    required String value,
    required String tag,
  }) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: BoxDecoration(
          color: Colors.black.withOpacity(0.28),
          borderRadius: BorderRadius.circular(18),
          border: Border.all(
            color: Colors.white.withOpacity(0.18),
            width: 1.5,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, size: 16, color: iconColor),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    label,
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.75),
                      fontSize: 10,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 0.5,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 6),
            Text(
              value,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 24,
                fontWeight: FontWeight.w900,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              tag,
              style: TextStyle(
                color: iconColor,
                fontSize: 10,
                fontWeight: FontWeight.w900,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _FarmerCropsSection extends StatelessWidget {
  const _FarmerCropsSection({
    required this.status,
    required this.language,
  });

  final FarmStatus? status;
  final AppLanguage language;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final paddyMoist = status?.soilMoisture ?? 65.0;
    final arecaMoist = (paddyMoist * 0.72).clamp(15.0, 95.0);

    final isPaddyOk = paddyMoist >= 50.0;
    final isArecaOk = arecaMoist >= 40.0;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              Localization.translate('my_crops', language),
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: isDark ? Colors.white : const Color(0xFF0F172A),
              ),
            ),
            Text(
              'Coastal Zone A & B',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: isDark ? Colors.white54 : const Color(0xFF64748B),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        LayoutBuilder(
          builder: (context, constraints) {
            final isWide = constraints.maxWidth >= 600;
            final paddyCard = _buildCropCard(
              context,
              cropName: Localization.translate('paddy', language),
              zoneDesc: 'Zone A • Wetland Lowlands',
              icon: Icons.grass_rounded,
              iconColor: const Color(0xFF598923),
              moisture: paddyMoist,
              isOptimal: isPaddyOk,
              isDark: isDark,
              onTap: () => context.go('/details'),
            );
            final arecaCard = _buildCropCard(
              context,
              cropName: Localization.translate('arecanut', language),
              zoneDesc: 'Zone B • Coastal Plantation',
              icon: Icons.forest_rounded,
              iconColor: const Color(0xFFAE7B6A),
              moisture: arecaMoist,
              isOptimal: isArecaOk,
              isDark: isDark,
              onTap: () => context.go('/details'),
            );

            if (isWide) {
              return Row(
                children: [
                  Expanded(child: paddyCard),
                  const SizedBox(width: 14),
                  Expanded(child: arecaCard),
                ],
              );
            } else {
              return Column(
                children: [
                  paddyCard,
                  const SizedBox(height: 12),
                  arecaCard,
                ],
              );
            }
          },
        ),
      ],
    );
  }

  Widget _buildCropCard(
    BuildContext context, {
    required String cropName,
    required String zoneDesc,
    required IconData icon,
    required Color iconColor,
    required double moisture,
    required bool isOptimal,
    required bool isDark,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(22),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: isDark ? AppTheme.panel : Colors.white,
          borderRadius: BorderRadius.circular(22),
          border: Border.all(
            color: isDark ? const Color(0xFF334E3C) : const Color(0xFFE2E9DF),
            width: 2,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(isDark ? 0.2 : 0.04),
              blurRadius: 10,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: iconColor.withOpacity(0.18),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Icon(icon, color: iconColor, size: 26),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: isOptimal
                        ? const Color(0xFF598923).withOpacity(0.15)
                        : const Color(0xFFAE7B6A).withOpacity(0.15),
                    borderRadius: BorderRadius.circular(30),
                    border: Border.all(
                      color: isOptimal
                          ? const Color(0xFF598923).withOpacity(0.4)
                          : const Color(0xFFAE7B6A).withOpacity(0.4),
                      width: 1.5,
                    ),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        isOptimal ? Icons.check_circle_rounded : Icons.water_drop_rounded,
                        size: 14,
                        color: isOptimal ? const Color(0xFF598923) : const Color(0xFFAE7B6A),
                      ),
                      const SizedBox(width: 5),
                      Text(
                        isOptimal
                            ? Localization.translate('optimal', language)
                            : Localization.translate('needs_water', language),
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w900,
                          color: isOptimal ? const Color(0xFF598923) : const Color(0xFFAE7B6A),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Text(
              cropName,
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w900,
                color: isDark ? Colors.white : const Color(0xFF131B11),
              ),
            ),
            Text(
              zoneDesc,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: isDark ? AppTheme.mistGrey : AppTheme.slateSage,
              ),
            ),
            const SizedBox(height: 14),
            Row(
              crossAxisAlignment: CrossAxisAlignment.baseline,
              textBaseline: TextBaseline.alphabetic,
              children: [
                Text(
                  '${moisture.toStringAsFixed(0)}%',
                  style: TextStyle(
                    fontSize: 34,
                    fontWeight: FontWeight.w900,
                    letterSpacing: -1,
                    color: isDark ? Colors.white : const Color(0xFF131B11),
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  Localization.translate('soil_moisture', language),
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: isDark ? AppTheme.mistGrey : AppTheme.slateSage,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              decoration: BoxDecoration(
                color: (isOptimal ? const Color(0xFF598923) : const Color(0xFFAE7B6A)).withOpacity(0.12),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    Localization.translate('open_farm', language),
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w900,
                      color: isOptimal ? const Color(0xFF598923) : const Color(0xFFAE7B6A),
                    ),
                  ),
                  const SizedBox(width: 4),
                  Icon(
                    Icons.arrow_forward_rounded,
                    size: 14,
                    color: isOptimal ? const Color(0xFF598923) : const Color(0xFFAE7B6A),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _AttentionNeededCard extends StatelessWidget {
  const _AttentionNeededCard({
    required this.status,
    required this.language,
  });

  final FarmStatus? status;
  final AppLanguage language;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final moisture = (status?.soilMoisture ?? 42.0) * 0.75;
    final isLow = moisture < 42.0;

    return Container(
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: isDark ? AppTheme.panel : Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(
          color: isLow ? const Color(0xFFAE7B6A) : const Color(0xFF598923),
          width: 2,
        ),
        boxShadow: [
          BoxShadow(
            color: (isLow ? const Color(0xFFAE7B6A) : const Color(0xFF598923)).withOpacity(isDark ? 0.2 : 0.08),
            blurRadius: 14,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: (isLow ? const Color(0xFFAE7B6A) : const Color(0xFF598923)).withOpacity(0.18),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Icon(
                  Icons.water_drop_rounded,
                  color: isLow ? const Color(0xFFAE7B6A) : const Color(0xFF598923),
                  size: 26,
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      Localization.translate('attention_needed', language),
                      style: TextStyle(
                        fontSize: 19,
                        fontWeight: FontWeight.w900,
                        color: isDark ? Colors.white : const Color(0xFF131B11),
                      ),
                    ),
                    Text(
                      '${Localization.translate('arecanut', language)} (Zone B) • Needs Hydration',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: isDark ? AppTheme.mistGrey : AppTheme.slateSage,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            crossAxisAlignment: CrossAxisAlignment.baseline,
            textBaseline: TextBaseline.alphabetic,
            children: [
              Text(
                '${moisture.toStringAsFixed(0)}%',
                style: TextStyle(
                  fontSize: 34,
                  fontWeight: FontWeight.w900,
                  letterSpacing: -1,
                  color: isDark ? Colors.white : const Color(0xFF131B11),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  isLow ? 'Action: Moisture is below 40% target' : 'Status: Optimal range (40% - 60%)',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w800,
                    color: isLow ? const Color(0xFFAE7B6A) : const Color(0xFF598923),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: LinearProgressIndicator(
              value: (moisture / 100.0).clamp(0.0, 1.0),
              minHeight: 10,
              backgroundColor: isDark ? const Color(0xFF334E3C) : const Color(0xFFE2E9DF),
              valueColor: AlwaysStoppedAnimation<Color>(
                isLow ? const Color(0xFFAE7B6A) : const Color(0xFF598923),
              ),
            ),
          ),
          const SizedBox(height: 18),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (_) => const VoiceAssistantDialog(),
                );
              },
              icon: const Icon(Icons.water_drop_rounded, size: 20, color: Colors.white),
              label: Text(
                Localization.translate('water_advice', language),
                style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14, color: Colors.white),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF598923),
                padding: const EdgeInsets.symmetric(vertical: 15),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                elevation: 3,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _TelemetryGrid extends StatelessWidget {
  const _TelemetryGrid({
    required this.status,
    required this.temperature,
    required this.tempUnit,
    required this.onViewAll,
    required this.language,
    this.onWeatherTap,
  });

  final FarmStatus? status;
  final double temperature;
  final String tempUnit;
  final VoidCallback onViewAll;
  final AppLanguage language;
  final VoidCallback? onWeatherTap;

  @override
  Widget build(BuildContext context) {
    final cards = [
      _TelemetryItem(
        title: Localization.translate('soil_moisture', language),
        value: '${status?.soilMoisture.round() ?? 0}%',
        icon: Icons.water_drop_rounded,
        color: const Color(0xFF598923),
        tabColor: const Color(0xFF598923),
        badgeText: (status?.soilMoisture ?? 0) < 40 ? 'LOW' : null,
      ),
      _TelemetryItem(
        title: Localization.translate('temperature', language),
        value: '${temperature.round()}$tempUnit',
        icon: Icons.thermostat_rounded,
        color: const Color(0xFFAE7B6A),
        tabColor: const Color(0xFFAE7B6A),
      ),
      _TelemetryItem(
        title: Localization.translate('humidity', language),
        value: '${status?.humidity.round() ?? 0}%',
        icon: Icons.air_rounded,
        color: const Color(0xFF4B6861),
        tabColor: const Color(0xFF4B6861),
      ),
      _TelemetryItem(
        title: Localization.translate('battery', language),
        value: '${status?.battery.round() ?? 0}%',
        icon: Icons.battery_charging_full_rounded,
        color: const Color(0xFF84AF57),
        tabColor: const Color(0xFF84AF57),
        subtext: '${status?.batteryHoursRemaining.toStringAsFixed(1)}h',
      ),
    ];

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(22),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  Localization.translate('telemetry_data', language),
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w900,
                    letterSpacing: -0.3,
                  ),
                ),
                TextButton(
                  onPressed: onViewAll,
                  child: Text(
                    Localization.translate('view_all_sensors', language),
                    style: const TextStyle(fontWeight: FontWeight.w900, color: Color(0xFF598923)),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            LayoutBuilder(
              builder: (context, constraints) {
                final wide = constraints.maxWidth >= 600;
                if (wide) {
                  return Row(
                    children: cards.map((c) => Expanded(child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 6),
                      child: c,
                    ))).toList(),
                  );
                } else {
                  return Column(
                    children: cards.map((c) => Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: c,
                    )).toList(),
                  );
                }
              },
            ),
          ],
        ),
      ),
    );
  }
}

class _TelemetryItem extends StatelessWidget {
  const _TelemetryItem({
    required this.title,
    required this.value,
    required this.icon,
    required this.color,
    required this.tabColor,
    this.badgeText,
    this.subtext,
  });

  final String title;
  final String value;
  final IconData icon;
  final Color color;
  final Color tabColor;
  final String? badgeText;
  final String? subtext;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      height: 140,
      decoration: BoxDecoration(
        color: isDark ? AppTheme.panel : Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isDark ? const Color(0xFF334E3C) : const Color(0xFFE2E9DF),
          width: 2,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(isDark ? 0.2 : 0.03),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: Stack(
          children: [
            Positioned(
              left: 0,
              top: 0,
              bottom: 0,
              child: Container(
                width: 6,
                color: tabColor,
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: color.withOpacity(0.18),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Icon(icon, color: color, size: 22),
                      ),
                      if (badgeText != null)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: const Color(0xFFAE7B6A).withOpacity(0.18),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            badgeText!,
                            style: const TextStyle(
                              color: Color(0xFFAE7B6A),
                              fontSize: 9,
                              fontWeight: FontWeight.w900,
                            ),
                          ),
                        )
                      else if (subtext != null)
                        Text(
                          subtext!,
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            color: isDark ? AppTheme.mistGrey : AppTheme.slateSage,
                          ),
                        ),
                    ],
                  ),
                  const Spacer(),
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: isDark ? AppTheme.mistGrey : AppTheme.slateSage,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    value,
                    style: TextStyle(
                      fontSize: 26,
                      fontWeight: FontWeight.w900,
                      letterSpacing: -0.5,
                      color: isDark ? Colors.white : const Color(0xFF131B11),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _LiveSectorView extends StatelessWidget {
  const _LiveSectorView({required this.status});

  final FarmStatus? status;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final isPumpActive = status?.pump == true;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Live Sector View',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w900,
                  ),
                ),
                Container(
                  width: 8,
                  height: 8,
                  decoration: const BoxDecoration(
                    color: Colors.green,
                    shape: BoxShape.circle,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Expanded(
              child: ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    Image.network(
                      'https://images.unsplash.com/photo-1593113630400-ea4288922497?w=600&auto=format&fit=crop',
                      fit: BoxFit.cover,
                      errorBuilder: (context, _, __) => Image.asset('assets/images/farm_hero.png', fit: BoxFit.cover),
                    ),
                    Positioned(
                      left: 12,
                      right: 12,
                      bottom: 12,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        decoration: BoxDecoration(
                          color: isDark ? Colors.black.withOpacity(0.85) : Colors.white.withOpacity(0.9),
                          borderRadius: BorderRadius.circular(8),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.1),
                              blurRadius: 4,
                            ),
                          ],
                        ),
                        child: Row(
                          children: [
                            Icon(
                              Icons.water,
                              color: isPumpActive ? AppTheme.success : Colors.grey,
                              size: 20,
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Text(
                                    isPumpActive ? 'Pump Active' : 'Pump Standby',
                                    style: TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.bold,
                                      color: isDark ? Colors.white : const Color(0xFF1E3A2B),
                                    ),
                                  ),
                                  const Text(
                                    'Irrigation Zone A',
                                    style: TextStyle(
                                      fontSize: 9,
                                      color: Colors.grey,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            Text(
                              isPumpActive ? 'FLOWING' : 'IDLE',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                color: isPumpActive ? AppTheme.success : Colors.grey,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _CropStressPanel extends StatelessWidget {
  const _CropStressPanel({required this.status, required this.language});

  final FarmStatus? status;
  final AppLanguage language;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final score = status?.stressScore ?? 0;
    final color = score >= 70
        ? AppTheme.danger
        : score >= 40
            ? AppTheme.warning
            : AppTheme.success;
            
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              Localization.translate('crop_stress_index', language),
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.w900,
              ),
            ),
            const Text(
              'AI Edge Analysis',
              style: TextStyle(fontSize: 11, color: Colors.grey),
            ),
            const SizedBox(height: 24),
            Center(
              child: SizedBox(
                width: 140,
                height: 140,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    Positioned.fill(
                      child: CircularProgressIndicator(
                        value: 1.0,
                        strokeWidth: 10,
                        color: isDark ? Colors.white.withOpacity(0.08) : Colors.black.withOpacity(0.04),
                      ),
                    ),
                    Positioned.fill(
                      child: CircularProgressIndicator(
                        value: score / 100,
                        strokeWidth: 10,
                        color: color,
                        backgroundColor: Colors.transparent,
                        strokeCap: StrokeCap.round,
                      ),
                    ),
                    Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          '$score',
                          style: TextStyle(
                            fontSize: 32,
                            fontWeight: FontWeight.w900,
                            color: isDark ? Colors.white : const Color(0xFF1E3A2B),
                          ),
                        ),
                        Text(
                          'STRESS INDEX',
                          style: TextStyle(
                            fontSize: 8,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 0.5,
                            color: isDark ? Colors.white60 : const Color(0xFF5A6B5D),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            Center(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  score >= 70 
                      ? Localization.translate('high', language) 
                      : (score >= 40 ? Localization.translate('medium', language) : Localization.translate('stable', language)),
                  style: TextStyle(
                    color: color,
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 18),
            const _Finding(
                icon: Icons.close,
                color: AppTheme.danger,
                text: 'Moisture below 40%'),
            const _Finding(
                icon: Icons.warning_amber,
                color: AppTheme.warning,
                text: 'Sustained High Temp'),
            const _Finding(
                icon: Icons.check_circle_outline,
                color: AppTheme.success,
                text: 'Humidity Stable'),
          ],
        ),
      ),
    );
  }
}

class _Finding extends StatelessWidget {
  const _Finding({required this.icon, required this.color, required this.text});

  final IconData icon;
  final Color color;
  final String text;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 9),
      child: Row(
        children: [
          Icon(icon, size: 16, color: color),
          const SizedBox(width: 8),
          Expanded(child: Text(text, style: Theme.of(context).textTheme.bodySmall)),
        ],
      ),
    );
  }
}

class _TrendsPanel extends StatelessWidget {
  const _TrendsPanel({required this.history, required this.language});

  final List<FarmSample> history;
  final AppLanguage language;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              Localization.translate('environmental_trends', language),
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.w900,
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              height: 200,
              child: FarmLineChart(
                values: history.map((sample) => sample.moisture).toList(),
                color: AppTheme.success,
                minY: 0,
                maxY: 100,
              ),
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 14,
              children: [
                _Legend(color: AppTheme.success, label: Localization.translate('soil_moisture', language)),
                _Legend(color: AppTheme.warning, label: Localization.translate('temperature', language)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _Legend extends StatelessWidget {
  const _Legend({required this.color, required this.label});

  final Color color;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(Icons.circle, color: color, size: 9),
        const SizedBox(width: 5),
        Text(label, style: Theme.of(context).textTheme.labelSmall),
      ],
    );
  }
}

class _TwinSyncPanel extends StatelessWidget {
  const _TwinSyncPanel({required this.isOnline});

  final bool isOnline;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Twin Synchronization',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.w900,
              ),
            ),
            const SizedBox(height: 16),
            _buildSyncRow(
              context,
              title: 'ESP32 Controller',
              status: isOnline ? 'Connected' : 'Disconnected',
              isActive: isOnline,
            ),
            const SizedBox(height: 12),
            _buildSyncRow(
              context,
              title: 'ML Simulation',
              status: isOnline ? 'Running' : 'Offline',
              isActive: isOnline,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSyncRow(
    BuildContext context, {
    required String title,
    required String status,
    required bool isActive,
  }) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          children: [
            Icon(
              isActive ? Icons.sensors : Icons.sensors_off,
              size: 18,
              color: isActive ? AppTheme.success : Colors.grey,
            ),
            const SizedBox(width: 8),
            Text(
              title,
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: isDark ? Colors.white70 : const Color(0xFF334E3F),
              ),
            ),
          ],
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          decoration: BoxDecoration(
            color: isActive 
                ? AppTheme.success.withOpacity(0.1) 
                : Colors.grey.withOpacity(0.1),
            borderRadius: BorderRadius.circular(4),
          ),
          child: Text(
            status,
            style: TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.bold,
              color: isActive ? AppTheme.success : Colors.grey,
            ),
          ),
        ),
      ],
    );
  }
}

class _IrrigationPipeline extends StatelessWidget {
  const _IrrigationPipeline({required this.isPumpActive});

  final bool isPumpActive;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Irrigation Pipeline',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.w900,
              ),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _buildPipelineNode(
                  icon: Icons.toggle_on_outlined,
                  label: 'Relay',
                  isActive: isPumpActive,
                ),
                _buildArrow(),
                _buildPipelineNode(
                  icon: Icons.power,
                  label: isPumpActive ? 'Pump ON' : 'Pump OFF',
                  isActive: isPumpActive,
                  highlight: true,
                ),
                _buildArrow(),
                _buildPipelineNode(
                  icon: Icons.grass,
                  label: 'Field',
                  isActive: isPumpActive,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPipelineNode({
    required IconData icon,
    required String label,
    required bool isActive,
    bool highlight = false,
  }) {
    return Column(
      children: [
        Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: highlight 
                ? (isActive ? const Color(0xFF1E3A2B) : Colors.grey.withOpacity(0.2))
                : (isActive ? AppTheme.success.withOpacity(0.1) : Colors.grey.withOpacity(0.1)),
            shape: BoxShape.circle,
            border: Border.all(
              color: isActive ? AppTheme.success : Colors.grey,
              width: highlight ? 2 : 1,
            ),
          ),
          child: Icon(
            icon,
            color: highlight 
                ? (isActive ? Colors.white : Colors.grey)
                : (isActive ? AppTheme.success : Colors.grey),
            size: 20,
          ),
        ),
        const SizedBox(height: 6),
        Text(
          label,
          style: const TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }

  Widget _buildArrow() {
    return const Icon(
      Icons.arrow_forward_rounded,
      color: Colors.grey,
      size: 16,
    );
  }
}

class _StormAlertBanner extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: AppTheme.danger.withOpacity(.15),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: AppTheme.danger, width: 1.5),
      ),
      child: Row(
        children: [
          Icon(Icons.warning_amber_rounded, color: AppTheme.danger, size: 28),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'CYCLONE / STORM WARNING AT THE EDGE',
                  style: TextStyle(
                      color: AppTheme.danger,
                      fontWeight: FontWeight.bold,
                      fontSize: 14),
                ),
                const Text(
                  'Local Barometric pressure is dropping rapidly. Secure field assets and check drainage.',
                  style: TextStyle(color: Colors.white70, fontSize: 12),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _IrrigationConfirmBanner extends ConsumerWidget {
  const _IrrigationConfirmBanner({required this.moisture});
  final double moisture;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final settings = ref.watch(settingsProvider);
    final lang = settings.language;

    // Localized strings
    final title = lang == AppLanguage.ml
        ? 'നനയ്ക്കൽ ആവശ്യമുണ്ട്'
        : (lang == AppLanguage.kn ? 'ನೀರಾವರಿ ವಿನಂತಿ' : 'IRRIGATION REQUEST');

    final text = lang == AppLanguage.ml
        ? 'മണ്ണിന്റെ ഈർപ്പം ${moisture.toStringAsFixed(1)}% ആയി കുറഞ്ഞു. പമ്പ് ഓണാക്കണോ?'
        : (lang == AppLanguage.kn
            ? 'ಮಣ್ಣಿನ ತೇವಾಂಶವು ${moisture.toStringAsFixed(1)}% ಕ್ಕೆ ಇಳಿದಿದೆ. ಪಂಪ್ ಆನ್ ಮಾಡಬೇಕೆ?'
            : 'Soil moisture is dry at ${moisture.toStringAsFixed(1)}%. Turn on the sprinkler pump?');

    final approveText = lang == AppLanguage.ml
        ? 'അംഗീകരിക്കുക'
        : (lang == AppLanguage.kn ? 'ಅನುಮೋದಿಸಿ' : 'Approve');

    final dismissText = lang == AppLanguage.ml
        ? 'വേണ്ട'
        : (lang == AppLanguage.kn ? 'തിരസ്‌കരിക്കുക' : 'Dismiss');

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: AppTheme.warning.withOpacity(.15),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.warning, width: 1.5),
      ),
      child: Row(
        children: [
          const Icon(Icons.water_drop, color: AppTheme.warning, size: 28),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                      color: AppTheme.warning,
                      fontWeight: FontWeight.bold,
                      fontSize: 14),
                ),
                Text(
                  text,
                  style: const TextStyle(color: Colors.white70, fontSize: 12),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          TextButton(
            style: TextButton.styleFrom(
              foregroundColor: Colors.white70,
              backgroundColor: Colors.white10,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            onPressed: () => ref.read(farmProvider.notifier).dismissIrrigationAlert(),
            child: Text(dismissText, style: const TextStyle(fontSize: 12)),
          ),
          const SizedBox(width: 8),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.success,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            onPressed: () => ref.read(farmProvider.notifier).approveIrrigation(),
            child: Text(approveText, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }
}
