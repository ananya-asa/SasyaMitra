import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/farm/crop_id.dart';
import '../../core/farm/farmer_state.dart';
import '../../core/localization/localization.dart';
import '../../core/theme/app_theme.dart';
import '../../providers/farm_provider.dart';
import '../../widgets/status_tile.dart';

class CropDetailScreen extends ConsumerWidget {
  const CropDetailScreen({super.key, required this.crop});

  final CropId crop;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final lang = ref.watch(settingsProvider).language;
    final slice = ref.watch(farmProvider).farmer.slice(crop);
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
            ],
          ),
          const SizedBox(height: 12),
          StatusTile(
            icon: Icons.water_drop_rounded,
            title: Localization.t('tile_water', lang),
            word: Localization.soilWord(slice.soilMood, lang),
            tone: slice.soilMood == SoilMood.thirsty ? StatusTone.act : StatusTone.good,
          ),
        ],
      ),
    );
  }
}
