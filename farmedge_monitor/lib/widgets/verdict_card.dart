import 'package:flutter/material.dart';

import '../core/farm/farmer_state.dart';
import '../core/localization/localization.dart';
import '../core/theme/app_theme.dart';
import '../providers/farm_provider.dart';
import 'big_button.dart';

class VerdictCard extends StatelessWidget {
  const VerdictCard({
    super.key,
    required this.kind,
    required this.language,
    required this.isDemo,
    required this.onAction,
  });

  final VerdictKind kind;
  final AppLanguage language;
  final bool isDemo;
  final VoidCallback onAction;

  IconData get _icon => switch (kind) {
        VerdictKind.storm => Icons.thunderstorm_rounded,
        VerdictKind.fungal => Icons.coronavirus_outlined,
        VerdictKind.dry => Icons.water_drop_rounded,
        VerdictKind.good => Icons.check_circle_rounded,
      };

  Color get _color => switch (kind) {
        VerdictKind.storm => AppTheme.act,
        VerdictKind.fungal => AppTheme.watch,
        VerdictKind.dry => AppTheme.act,
        VerdictKind.good => AppTheme.good,
      };

  BigButtonTone get _tone => switch (kind) {
        VerdictKind.storm => BigButtonTone.act,
        VerdictKind.fungal => BigButtonTone.watch,
        VerdictKind.dry => BigButtonTone.accent,
        VerdictKind.good => BigButtonTone.accent,
      };

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(AppTheme.radius),
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF16351C), Color(0xFF0C2414)],
        ),
        border: Border.all(color: AppTheme.strokeStrong, width: 1.4),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(_icon, color: _color, size: 36),
              const Spacer(),
              if (isDemo) DemoBadge(language: language),
            ],
          ),
          const SizedBox(height: 14),
          Text(
            Localization.verdictLine(kind, language),
            style: const TextStyle(
              color: AppTheme.textPrimary,
              fontSize: 28,
              fontWeight: FontWeight.w800,
              height: 1.2,
            ),
          ),
          const SizedBox(height: 18),
          BigButton(
            label: Localization.verdictAction(kind, language),
            icon: Icons.arrow_forward_rounded,
            tone: _tone,
            onPressed: onAction,
          ),
        ],
      ),
    );
  }
}

class DemoBadge extends StatelessWidget {
  const DemoBadge({super.key, required this.language});

  final AppLanguage language;

  @override
  Widget build(BuildContext context) {
    final lang = language;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: AppTheme.watch.withValues(alpha: 0.18),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppTheme.watch),
      ),
      child: Text(
        Localization.t('demo_data', lang),
        style: const TextStyle(
          color: AppTheme.watch,
          fontSize: 13,
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}
