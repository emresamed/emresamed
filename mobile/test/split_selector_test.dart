import 'package:flutter_test/flutter_test.dart';
import 'package:fitforge/core/enums.dart';
import 'package:fitforge/data/models/user_profile.dart';
import 'package:fitforge/domain/services/split_selector.dart';

void main() {
  final selector = SplitSelector();

  UserProfile profile({required int days, SplitType? override}) => UserProfile(
        id: 't',
        bodyType: BodyType.mesomorph,
        fitnessGoal: FitnessGoal.hypertrophy,
        availableEquipment: {Equipment.bodyweight},
        daysPerWeek: days,
        experienceLevel: ExperienceLevel.beginner,
        splitOverride: override,
      );

  test('2-3 days → full body', () {
    expect(selector.resolve(profile(days: 2)), SplitType.fullBody);
    expect(selector.resolve(profile(days: 3)), SplitType.fullBody);
  });

  test('4 days → upper/lower', () {
    expect(selector.resolve(profile(days: 4)), SplitType.upperLower);
  });

  test('5-6 days → PPL', () {
    expect(selector.resolve(profile(days: 5)), SplitType.pushPullLegs);
    expect(selector.resolve(profile(days: 6)), SplitType.pushPullLegs);
  });

  test('override wins', () {
    expect(
      selector.resolve(profile(days: 3, override: SplitType.pushPullLegs)),
      SplitType.pushPullLegs,
    );
  });
}
