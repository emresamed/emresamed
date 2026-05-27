import '../../core/enums.dart';
import '../../data/models/user_profile.dart';

class SplitSelector {
  SplitType resolve(UserProfile profile) {
    if (profile.splitOverride != null) return profile.splitOverride!;
    return switch (profile.daysPerWeek) {
      <= 3 => SplitType.fullBody,
      4 => SplitType.upperLower,
      _ => SplitType.pushPullLegs,
    };
  }
}
