import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/localization/localization.dart';
import '../../core/theme/app_theme.dart';
import '../../providers/farm_provider.dart';
import '../home/home_screen.dart';

class CropsListScreen extends ConsumerWidget {
  const CropsListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final farm = ref.watch(farmProvider);
    final lang = ref.watch(settingsProvider).language;
    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            Localization.t('nav_crops', lang),
            style: const TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.w800,
              color: AppTheme.textPrimary,
            ),
          ),
          const SizedBox(height: 16),
          CropSummaryCard(slice: farm.farmer.arecanut, language: lang),
          const SizedBox(height: 12),
          CropSummaryCard(slice: farm.farmer.paddy, language: lang),
        ],
      ),
    );
  }
}
