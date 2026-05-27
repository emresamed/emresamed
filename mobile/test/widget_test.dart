import 'package:flutter_test/flutter_test.dart';
import 'package:fitforge/app.dart';

void main() {
  testWidgets('FitForgeApp mounts MaterialApp', (tester) async {
    await tester.pumpWidget(const FitForgeApp());
    await tester.pump();
    expect(find.byType(FitForgeApp), findsOneWidget);
  });
}
