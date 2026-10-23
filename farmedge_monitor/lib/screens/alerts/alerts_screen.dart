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

class AlertsScreen extends ConsumerWidget {
  const AlertsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final lang = ref.watch(settingsProvider).language;
    final farmer = ref.watch(farmerViewProvider);
    final items = <_Alert>[];
    for (final slice in [farmer.arecanut, farmer.paddy]) {
      if (slice.verdict == VerdictKind.storm) {
        items.add(_Alert(
          slice: slice,
          title: Localization.t('storm_risk', lang),
          word: Localization.t('verdict_storm', lang),
          tone: StatusTone.act,
          icon: Icons.thunderstorm_rounded,
          action: Localization.t('action_storm', lang),
          onAction: () => context.go('/crops/${slice.crop.name}'),
        ));
      } else if (slice.verdict == VerdictKind.fungal) {
        items.add(_Alert(
          slice: slice,
          title: Localization.t('fungal_indicator', lang),
          word: Localization.t('verdict_fungal', lang),
          tone: StatusTone.watch,
          icon: Icons.blur_on_rounded,
          action: Localization.t('action_fungal', lang),
          onAction: () => context.go('/crops/${slice.crop.name}'),
        ));
      } else if (slice.verdict == VerdictKind.dry || slice.needsPumpApproval) {
        items.add(_Alert(
          slice: slice,
          title: Localization.cropName(slice, lang),
          word: Localization.t('verdict_dry', lang),
          tone: StatusTone.act,
          icon: Icons.water_drop_rounded,
          action: Localization.t('approve_pump', lang),
          onAction: () => ref
              .read(farmProvider.notifier)
              .approveIrrigation(zone: slice.crop.zoneId),
        ));
      }
    }

    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            Localization.t('nav_alerts', lang),
            style: const TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.w800,
              color: AppTheme.textPrimary,
            ),
          ),
          const SizedBox(height: 16),
          if (items.isEmpty)
            Text(
              Localization.t('no_alerts', lang),
              style: const TextStyle(color: AppTheme.textSecondary, fontSize: 18),
            )
          else
            for (final alert in items) ...[
              StatusTile(
                icon: alert.icon,
                title: '${Localization.cropName(alert.slice, lang)} · ${alert.title}',
                word: alert.word,
                tone: alert.tone,
              ),
              const SizedBox(height: 8),
              BigButton(
                label: alert.action,
                tone: alert.tone == StatusTone.act
                    ? BigButtonTone.act
                    : BigButtonTone.watch,
                onPressed: alert.onAction,
              ),
              const SizedBox(height: 16),
            ],
        ],
      ),
    );
  }
}

class _Alert {
  const _Alert({
    required this.slice,
    required this.title,
    required this.word,
    required this.tone,
    required this.icon,
    required this.action,
    required this.onAction,
  });
  final CropSlice slice;
  final String title;
  final String word;
  final StatusTone tone;
  final IconData icon;
  final String action;
  final VoidCallback onAction;
}
