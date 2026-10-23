import 'package:flutter/material.dart';

import '../core/theme/app_theme.dart';

class BigButton extends StatefulWidget {
  const BigButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon,
    this.tone = BigButtonTone.accent,
  });

  final String label;
  final VoidCallback? onPressed;
  final IconData? icon;
  final BigButtonTone tone;

  @override
  State<BigButton> createState() => _BigButtonState();
}

enum BigButtonTone { accent, good, watch, act, ghost }

class _BigButtonState extends State<BigButton> {
  bool _down = false;

  Color get _fill => switch (widget.tone) {
        BigButtonTone.accent => AppTheme.accent,
        BigButtonTone.good => AppTheme.good,
        BigButtonTone.watch => AppTheme.watch,
        BigButtonTone.act => AppTheme.act,
        BigButtonTone.ghost => AppTheme.cardHighlight,
      };

  Color get _edge => switch (widget.tone) {
        BigButtonTone.accent => AppTheme.accentDeep,
        BigButtonTone.good => const Color(0xFF3E8F38),
        BigButtonTone.watch => const Color(0xFFB88620),
        BigButtonTone.act => const Color(0xFFB13A2E),
        BigButtonTone.ghost => const Color(0xFF0A1A10),
      };

  Color get _ink => widget.tone == BigButtonTone.ghost
      ? AppTheme.textPrimary
      : AppTheme.accentInk;

  @override
  Widget build(BuildContext context) {
    final enabled = widget.onPressed != null;
    return GestureDetector(
      onTapDown: enabled ? (_) => setState(() => _down = true) : null,
      onTapUp: enabled
          ? (_) {
              setState(() => _down = false);
              widget.onPressed?.call();
            }
          : null,
      onTapCancel: enabled ? () => setState(() => _down = false) : null,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 80),
        transform: Matrix4.translationValues(0, _down ? 4 : 0, 0),
        constraints: const BoxConstraints(minHeight: AppTheme.buttonHeight),
        decoration: BoxDecoration(
          color: enabled ? _fill : _fill.withValues(alpha: 0.45),
          borderRadius: BorderRadius.circular(22),
          boxShadow: _down
              ? const []
              : [
                  BoxShadow(
                    color: _edge,
                    offset: const Offset(0, 5),
                  ),
                ],
        ),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (widget.icon != null) ...[
              Icon(widget.icon, color: _ink, size: 26),
              const SizedBox(width: 10),
            ],
            Flexible(
              child: Text(
                widget.label,
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: _ink,
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
