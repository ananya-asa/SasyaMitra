import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/localization/localization.dart';
import '../../core/theme/app_theme.dart';
import '../../providers/farm_provider.dart';

class AlertsScreen extends ConsumerWidget {
  const AlertsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final lang = ref.watch(settingsProvider).language;
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              Localization.t('nav_alerts', lang),
              style: const TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.w800,
                color: AppTheme.textPrimary,
              ),
            ),
            const SizedBox(height: 24),
            Text(
              Localization.t('no_alerts', lang),
              style: const TextStyle(color: AppTheme.textSecondary, fontSize: 18),
            ),
          ],
        ),
      ),
    );
  }
}
