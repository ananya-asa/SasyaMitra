import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/farm/demo_scene.dart';
import '../core/localization/localization.dart';
import '../core/theme/app_theme.dart';
import '../providers/farm_provider.dart';
import 'big_button.dart';

class DemoPanel extends ConsumerWidget {
  const DemoPanel({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final lang = ref.watch(settingsProvider).language;
    final scene = ref.watch(demoSceneProvider);
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.cardSolid,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: SafeArea(
        top: false,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              Localization.t('demo_panel', lang),
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w800,
                color: AppTheme.textPrimary,
              ),
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                for (final item in DemoScene.values)
                  ChoiceChip(
                    selected: scene == item,
                    label: Text(_label(item, lang)),
                    selectedColor: AppTheme.accent,
                    labelStyle: TextStyle(
                      color: scene == item ? AppTheme.accentInk : AppTheme.textPrimary,
                      fontWeight: FontWeight.w700,
                    ),
                    onSelected: (_) =>
                        ref.read(demoSceneProvider.notifier).setScene(item),
                  ),
              ],
            ),
            const SizedBox(height: 16),
            BigButton(
              label: Localization.t('clear_demo', lang),
              onPressed: () =>
                  ref.read(demoSceneProvider.notifier).setScene(DemoScene.live),
            ),
          ],
        ),
      ),
    );
  }

  String _label(DemoScene scene, AppLanguage lang) {
    return switch (scene) {
      DemoScene.live => Localization.t('clear_demo', lang),
      DemoScene.dry => Localization.t('scene_dry', lang),
      DemoScene.happy => Localization.t('scene_happy', lang),
      DemoScene.rain => Localization.t('scene_rain', lang),
      DemoScene.storm => Localization.t('scene_storm', lang),
      DemoScene.fungal => Localization.t('scene_fungal', lang),
    };
  }
}

void showDemoPanel(BuildContext context) {
  showModalBottomSheet<void>(
    context: context,
    backgroundColor: Colors.transparent,
    builder: (_) => const DemoPanel(),
  );
}
