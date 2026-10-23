import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/farm/crop_id.dart';
import '../../core/farm/farmer_state.dart';
import '../../core/localization/localization.dart';
import '../../core/theme/app_theme.dart';
import '../../providers/farm_provider.dart';
import '../../widgets/big_button.dart';
import '../../widgets/status_tile.dart';
import '../../widgets/verdict_card.dart';

class CropDetailScreen extends ConsumerWidget {
  const CropDetailScreen({super.key, required this.crop});

  final CropId crop;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final lang = ref.watch(settingsProvider).language;
    final slice = ref.watch(farmerViewProvider).slice(crop);
    final farmer = ref.watch(farmerViewProvider);
    final rainWord = switch (slice.stormRisk) {
      StormRisk.stormLikely => Localization.t('scene_storm', lang),
      StormRisk.rainComing => Localization.t('scene_rain', lang),
      StormRisk.none => Localization.t('risk_low', lang),
    };
    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Row(
            children: [
              IconButton(
                onPressed: () => context.go('/crops'),
                icon: const Icon(Icons.arrow_back, color: AppTheme.textPrimary),
              ),
              Expanded(
                child: Text(
                  Localization.cropName(slice, lang),
                  style: const TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.w800,
                    color: AppTheme.textPrimary,
                  ),
                ),
              ),
              if (farmer.isDemo) DemoBadge(language: lang),
            ],
          ),
          const SizedBox(height: 12),
          StatusTile(
            icon: Icons.water_drop_rounded,
            title: Localization.t('tile_water', lang),
            word: Localization.soilWord(slice.soilMood, lang),
            tone: slice.soilMood == SoilMood.thirsty
                ? StatusTone.act
                : slice.soilMood == SoilMood.tooWet
                    ? StatusTone.watch
                    : StatusTone.good,
            detail: '${slice.soilMoisture.round()}%',
          ),
          const SizedBox(height: 10),
          StatusTile(
            icon: Icons.blur_on_rounded,
            title: Localization.t('fungal_indicator', lang),
            word: Localization.fungalWord(slice.fungalBand, lang),
            tone: slice.fungalBand == FungalBand.high
                ? StatusTone.act
                : slice.fungalBand == FungalBand.watch
                    ? StatusTone.watch
                    : StatusTone.good,
          ),
          const SizedBox(height: 10),
          StatusTile(
            icon: Icons.cloud_rounded,
            title: Localization.t('storm_risk', lang),
            word: rainWord,
            tone: slice.stormRisk == StormRisk.stormLikely
                ? StatusTone.act
                : slice.stormRisk == StormRisk.rainComing
                    ? StatusTone.watch
                    : StatusTone.good,
          ),
          const SizedBox(height: 10),
          StatusTile(
            icon: Icons.opacity_rounded,
            title: Localization.t('tile_pump', lang),
            word: slice.pumpOn
                ? Localization.t('pump_on', lang)
                : Localization.t('pump_off', lang),
            tone: slice.pumpOn ? StatusTone.watch : StatusTone.good,
          ),
          const SizedBox(height: 18),
          if (slice.needsPumpApproval || slice.soilMood == SoilMood.thirsty)
            BigButton(
              label: Localization.t('approve_pump', lang),
              icon: Icons.play_arrow_rounded,
              onPressed: () => ref
                  .read(farmProvider.notifier)
                  .approveIrrigation(zone: crop.zoneId),
            )
          else if (slice.pumpOn)
            BigButton(
              label: Localization.t('pump_off', lang),
              tone: BigButtonTone.ghost,
              onPressed: () =>
                  ref.read(farmProvider.notifier).stopPump(zone: crop.zoneId),
            ),
        ],
      ),
    );
  }
}
