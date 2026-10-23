import 'package:flutter/material.dart';

import '../core/theme/app_theme.dart';

enum StatusTone { good, watch, act }

class StatusTile extends StatelessWidget {
  const StatusTile({
    super.key,
    required this.icon,
    required this.title,
    required this.word,
    required this.tone,
    this.detail,
    this.onTap,
  });

  final IconData icon;
  final String title;
  final String word;
  final StatusTone tone;
  final String? detail;
  final VoidCallback? onTap;

  Color get _color => switch (tone) {
        StatusTone.good => AppTheme.good,
        StatusTone.watch => AppTheme.watch,
        StatusTone.act => AppTheme.act,
      };

  @override
  Widget build(BuildContext context) {
    final child = Container(
      constraints: const BoxConstraints(minHeight: 88),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: _color.withValues(alpha: 0.14),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: _color.withValues(alpha: 0.45), width: 1.5),
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: _color.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(icon, color: _color, size: 28),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    color: AppTheme.textSecondary,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                Text(
                  word,
                  style: TextStyle(
                    color: _color,
                    fontSize: 22,
                    fontWeight: FontWeight.w800,
                    height: 1.2,
                  ),
                ),
                if (detail != null)
                  Text(
                    detail!,
                    style: const TextStyle(
                      color: AppTheme.textMuted,
                      fontSize: 13,
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
    if (onTap == null) return child;
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: child,
    );
  }
}
