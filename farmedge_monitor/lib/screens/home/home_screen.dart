import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/farm/crop_id.dart';
import '../../core/farm/farmer_state.dart';
import '../../core/localization/localization.dart';
import '../../core/theme/app_theme.dart';
import '../../providers/farm_provider.dart';
import '../../widgets/app_shell.dart';
import '../../widgets/demo_panel.dart';
import '../../widgets/status_tile.dart';
import '../../widgets/verdict_card.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final farm = ref.watch(farmProvider);
    final settings = ref.watch(settingsProvider);
    final lang = settings.language;
    final farmer = ref.watch(farmerViewProvider);
    final width = MediaQuery.sizeOf(context).width;
    final desktop = width >= 1024;

    return ColoredBox(
      color: Colors.transparent,
      child: SafeArea(
        child: RefreshIndicator(
          onRefresh: () => ref.read(farmProvider.notifier).refresh(),
          child: ListView(
            padding: EdgeInsets.fromLTRB(desktop ? 28 : 16, 12, desktop ? 28 : 16, 28),
            children: [
              _HomeHeader(
                language: lang,
                isOnline: farm.isOnline,
                isDemo: farmer.isDemo,
                showLangToggle: !desktop,
                onToggleLang: () {
                  final next = lang == AppLanguage.kn ? AppLanguage.en : AppLanguage.kn;
                  ref.read(settingsProvider.notifier).update(settings.copyWith(language: next));
                },
              ),
              const SizedBox(height: 16),
              if (desktop)
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      flex: 5,
                      child: VerdictCard(
                        kind: farmer.farmVerdict,
                        language: lang,
                        isDemo: farmer.isDemo,
                        onAction: () => _onVerdict(context, farmer.farmVerdict),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      flex: 5,
                      child: _CropsColumn(farmer: farmer, language: lang),
                    ),
                  ],
                )
              else ...[
                VerdictCard(
                  kind: farmer.farmVerdict,
                  language: lang,
                  isDemo: farmer.isDemo,
                  onAction: () => _onVerdict(context, farmer.farmVerdict),
                ),
                const SizedBox(height: 18),
                _CropsColumn(farmer: farmer, language: lang),
              ],
            ],
          ),
        ),
      ),
    );
  }

  void _onVerdict(BuildContext context, VerdictKind kind) {
    switch (kind) {
      case VerdictKind.storm:
      case VerdictKind.fungal:
        context.go('/alerts');
      case VerdictKind.dry:
        context.go('/crops/arecanut');
      case VerdictKind.good:
        context.go('/crops');
    }
  }
}

class _HomeHeader extends StatelessWidget {
  const _HomeHeader({
    required this.language,
    required this.isOnline,
    required this.isDemo,
    required this.showLangToggle,
    required this.onToggleLang,
  });

  final AppLanguage language;
  final bool isOnline;
  final bool isDemo;
  final bool showLangToggle;
  final VoidCallback onToggleLang;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Expanded(
              child: GestureDetector(
                onLongPress: () => showDemoPanel(context),
                child: Text(
                  Localization.t('app_name', language),
                  style: const TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.w900,
                    color: AppTheme.textPrimary,
                  ),
                ),
              ),
            ),
            Icon(
              isOnline ? Icons.sensors : Icons.sensors_off,
              color: isOnline ? AppTheme.good : AppTheme.watch,
            ),
            IconButton(
              tooltip: 'Demo',
              onPressed: () => showDemoPanel(context),
              icon: const Icon(Icons.science_rounded, color: AppTheme.accent),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            if (isDemo) DemoBadge(language: language),
            const Spacer(),
            if (showLangToggle)
              SizedBox(
                width: 140,
                child: BigLangToggle(language: language, onTap: onToggleLang),
              ),
          ],
        ),
      ],
    );
  }
}

class _CropsColumn extends StatelessWidget {
  const _CropsColumn({required this.farmer, required this.language});

  final FarmerFarmState farmer;
  final AppLanguage language;

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.sizeOf(context).width;
    final sideBySide = width >= 700;
    final cards = [
      CropSummaryCard(slice: farmer.arecanut, language: language),
      CropSummaryCard(slice: farmer.paddy, language: language),
    ];
    if (sideBySide) {
      return Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(child: cards[0]),
          const SizedBox(width: 12),
          Expanded(child: cards[1]),
        ],
      );
    }
    return Column(
      children: [
        cards[0],
        const SizedBox(height: 12),
        cards[1],
      ],
    );
  }
}

class CropSummaryCard extends StatelessWidget {
  const CropSummaryCard({
    super.key,
    required this.slice,
    required this.language,
  });

  final CropSlice slice;
  final AppLanguage language;

  @override
  Widget build(BuildContext context) {
    final soilTone = switch (slice.soilMood) {
      SoilMood.happy => StatusTone.good,
      SoilMood.thirsty => StatusTone.act,
      SoilMood.tooWet => StatusTone.watch,
    };
    final fungalTone = switch (slice.fungalBand) {
      FungalBand.low => StatusTone.good,
      FungalBand.watch => StatusTone.watch,
      FungalBand.high => StatusTone.act,
    };
    final soilIcon = switch (slice.soilMood) {
      SoilMood.happy => Icons.sentiment_satisfied_alt_rounded,
      SoilMood.thirsty => Icons.water_drop_rounded,
      SoilMood.tooWet => Icons.flood_rounded,
    };

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.card,
        borderRadius: BorderRadius.circular(AppTheme.radius),
        border: Border.all(color: AppTheme.stroke),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                slice.crop == CropId.arecanut ? Icons.park_rounded : Icons.grass_rounded,
                color: AppTheme.accent,
                size: 28,
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  Localization.cropName(slice, language),
                  style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.w800,
                    color: AppTheme.textPrimary,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          StatusTile(
            icon: soilIcon,
            title: Localization.t('tile_water', language),
            word: Localization.soilWord(slice.soilMood, language),
            tone: soilTone,
            detail: '${slice.soilMoisture.round()}%',
          ),
          const SizedBox(height: 10),
          StatusTile(
            icon: Icons.blur_on_rounded,
            title: Localization.t('fungal_indicator', language),
            word: Localization.fungalWord(slice.fungalBand, language),
            tone: fungalTone,
          ),
          const SizedBox(height: 12),
          TextButton(
            onPressed: () => context.go('/crops/${slice.crop.name}'),
            child: Text(
              Localization.t('open_crop', language),
              style: const TextStyle(
                color: AppTheme.accent,
                fontSize: 18,
                fontWeight: FontWeight.w800,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
