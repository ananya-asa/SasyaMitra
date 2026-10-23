import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../core/localization/localization.dart';
import '../core/theme/app_theme.dart';
import '../providers/farm_provider.dart';

class AppShell extends ConsumerWidget {
  const AppShell({
    super.key,
    required this.child,
    required this.index,
  });

  final Widget child;
  final int index;

  static const _routes = ['/home', '/crops', '/alerts', '/workers'];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final lang = ref.watch(settingsProvider).language;
    final width = MediaQuery.sizeOf(context).width;
    final desktop = width >= 1024;

    void goTab(int i) => context.go(_routes[i]);

    final destinations = [
      _NavItem(Icons.home_rounded, Localization.t('nav_home', lang)),
      _NavItem(Icons.eco_rounded, Localization.t('nav_crops', lang)),
      _NavItem(Icons.notifications_rounded, Localization.t('nav_alerts', lang)),
      _NavItem(Icons.groups_rounded, Localization.t('nav_workers', lang)),
    ];

    return DecoratedBox(
      decoration: AppTheme.forestBackdrop(),
      child: Scaffold(
        backgroundColor: Colors.transparent,
        body: Row(
          children: [
            if (desktop)
              _SideBar(
                index: index,
                items: destinations,
                language: lang,
                onSelect: goTab,
                onToggleLang: () {
                  final next = lang == AppLanguage.kn ? AppLanguage.en : AppLanguage.kn;
                  ref.read(settingsProvider.notifier).update(
                        ref.read(settingsProvider).copyWith(language: next),
                      );
                },
              ),
            Expanded(child: child),
          ],
        ),
        bottomNavigationBar: desktop
            ? null
            : NavigationBar(
                selectedIndex: index,
                onDestinationSelected: goTab,
                destinations: [
                  for (final item in destinations)
                    NavigationDestination(
                      icon: Icon(item.icon),
                      selectedIcon: Icon(item.icon, color: AppTheme.accent),
                      label: item.label,
                    ),
                ],
              ),
      ),
    );
  }
}

class _NavItem {
  const _NavItem(this.icon, this.label);
  final IconData icon;
  final String label;
}

class _SideBar extends StatelessWidget {
  const _SideBar({
    required this.index,
    required this.items,
    required this.language,
    required this.onSelect,
    required this.onToggleLang,
  });

  final int index;
  final List<_NavItem> items;
  final AppLanguage language;
  final ValueChanged<int> onSelect;
  final VoidCallback onToggleLang;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 240,
      padding: const EdgeInsets.fromLTRB(16, 28, 16, 20),
      decoration: const BoxDecoration(
        color: Color(0xCC0A1A10),
        border: Border(right: BorderSide(color: AppTheme.stroke)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            Localization.t('app_name', language),
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w900,
              color: AppTheme.accent,
            ),
          ),
          const SizedBox(height: 28),
          for (var i = 0; i < items.length; i++) ...[
            _SideTile(
              item: items[i],
              selected: i == index,
              onTap: () => onSelect(i),
            ),
            const SizedBox(height: 8),
          ],
          const Spacer(),
          BigLangToggle(language: language, onTap: onToggleLang),
        ],
      ),
    );
  }
}

class _SideTile extends StatelessWidget {
  const _SideTile({
    required this.item,
    required this.selected,
    required this.onTap,
  });

  final _NavItem item;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        constraints: const BoxConstraints(minHeight: AppTheme.tapTarget),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        decoration: BoxDecoration(
          color: selected ? AppTheme.accent.withValues(alpha: 0.18) : Colors.transparent,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Row(
          children: [
            Icon(item.icon, color: selected ? AppTheme.accent : AppTheme.textSecondary),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                item.label,
                style: TextStyle(
                  color: selected ? AppTheme.textPrimary : AppTheme.textSecondary,
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class BigLangToggle extends StatelessWidget {
  const BigLangToggle({
    super.key,
    required this.language,
    required this.onTap,
  });

  final AppLanguage language;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final kn = language == AppLanguage.kn;
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        constraints: const BoxConstraints(minHeight: AppTheme.tapTarget),
        padding: const EdgeInsets.all(4),
        decoration: BoxDecoration(
          color: AppTheme.cardHighlight,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppTheme.stroke),
        ),
        child: Row(
          children: [
            _chip('ಕನ್ನಡ', kn),
            _chip('EN', !kn),
          ],
        ),
      ),
    );
  }

  Widget _chip(String label, bool on) {
    return Expanded(
      child: Container(
        alignment: Alignment.center,
        padding: const EdgeInsets.symmetric(vertical: 8),
        decoration: BoxDecoration(
          color: on ? AppTheme.accent : Colors.transparent,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: on ? AppTheme.accentInk : AppTheme.textSecondary,
            fontWeight: FontWeight.w800,
            fontSize: 14,
          ),
        ),
      ),
    );
  }
}
