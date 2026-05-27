import '../../core/errors.dart';
import '../../data/models/user_profile.dart';

class ProfileValidator {
  void validate(UserProfile profile) {
    if (profile.availableEquipment.isEmpty) {
      throw WorkoutGenerationException(
        'Select at least one equipment type.',
      );
    }
    if (profile.daysPerWeek < 2 || profile.daysPerWeek > 6) {
      throw WorkoutGenerationException(
        'Training days must be between 2 and 6.',
      );
    }
  }
}
