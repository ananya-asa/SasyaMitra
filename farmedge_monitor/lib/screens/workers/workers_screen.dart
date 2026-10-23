import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/localization/localization.dart';
import '../../core/theme/app_theme.dart';
import '../../providers/farm_provider.dart';

class WorkersScreen extends ConsumerWidget {
  const WorkersScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final lang = ref.watch(settingsProvider).language;
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Text(
          Localization.t('nav_workers', lang),
          style: const TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.w800,
            color: AppTheme.textPrimary,
          ),
        ),
      ),
    );
  }
}
