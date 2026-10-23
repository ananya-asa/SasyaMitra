import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import 'core/farm/crop_id.dart';
import 'core/theme/app_theme.dart';
import 'providers/farm_provider.dart';
import 'screens/alerts/alerts_screen.dart';
import 'screens/crops/crop_detail_screen.dart';
import 'screens/crops/crops_list_screen.dart';
import 'screens/home/home_screen.dart';
import 'screens/settings/settings_screen.dart';
import 'screens/splash/splash_screen.dart';
import 'screens/workers/workers_screen.dart';
import 'widgets/app_shell.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const ProviderScope(child: FarmEdgeApp()));
}

final _router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(path: '/', builder: (_, __) => const SplashScreen()),
    GoRoute(path: '/dashboard', redirect: (_, __) => '/home'),
    GoRoute(path: '/details', redirect: (_, __) => '/crops'),
    GoRoute(path: '/insights', redirect: (_, __) => '/alerts'),
    GoRoute(path: '/settings', builder: (_, __) => const SettingsScreen()),
    ShellRoute(
      builder: (context, state, child) {
        final loc = state.uri.path;
        final index = loc.startsWith('/crops')
            ? 1
            : loc.startsWith('/alerts')
                ? 2
                : loc.startsWith('/workers')
                    ? 3
                    : 0;
        return AppShell(index: index, child: child);
      },
      routes: [
        GoRoute(path: '/home', builder: (_, __) => const HomeScreen()),
        GoRoute(path: '/crops', builder: (_, __) => const CropsListScreen()),
        GoRoute(
          path: '/crops/:id',
          builder: (_, state) {
            final id = state.pathParameters['id'] == 'arecanut'
                ? CropId.arecanut
                : CropId.paddy;
            return CropDetailScreen(crop: id);
          },
        ),
        GoRoute(path: '/alerts', builder: (_, __) => const AlertsScreen()),
        GoRoute(path: '/workers', builder: (_, __) => const WorkersScreen()),
      ],
    ),
  ],
);

class FarmEdgeApp extends ConsumerWidget {
  const FarmEdgeApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    ref.watch(settingsProvider);
    return MaterialApp.router(
      title: 'SasyaMitra',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      themeMode: ThemeMode.dark,
      routerConfig: _router,
    );
  }
}
