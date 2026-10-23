import 'package:farmedge_monitor/main.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  Future<void> pumpAt(WidgetTester tester, Size size) async {
    tester.view.physicalSize = size;
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
    await tester.pumpWidget(const ProviderScope(child: FarmEdgeApp()));
    await tester.pump(const Duration(seconds: 2));
  }

  testWidgets('phone 390 has no overflow on home', (tester) async {
    await pumpAt(tester, const Size(390, 844));
    expect(tester.takeException(), isNull);
  });

  testWidgets('desktop 1440 has no overflow on home', (tester) async {
    await pumpAt(tester, const Size(1440, 900));
    expect(tester.takeException(), isNull);
  });
}
