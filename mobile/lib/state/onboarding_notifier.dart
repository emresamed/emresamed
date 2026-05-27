import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:uuid/uuid.dart';

import '../core/enums.dart';
import '../data/models/user_profile.dart';

class OnboardingNotifier extends ChangeNotifier {
  OnboardingNotifier();

  static const _profileKey = 'fitforge_user_profile';

  BodyType? _bodyType;
  FitnessGoal? _fitnessGoal;
  final Set<Equipment> _equipment = {
    Equipment.barbell,
    Equipment.dumbbell,
    Equipment.bodyweight,
  };
  int _daysPerWeek = 4;
  ExperienceLevel _experienceLevel = ExperienceLevel.beginner;
  SplitType? _splitOverride;
  UserProfile? _savedProfile;
  bool _isLoading = true;

  BodyType? get bodyType => _bodyType;
  FitnessGoal? get fitnessGoal => _fitnessGoal;
  Set<Equipment> get equipment => Set.unmodifiable(_equipment);
  int get daysPerWeek => _daysPerWeek;
  ExperienceLevel get experienceLevel => _experienceLevel;
  SplitType? get splitOverride => _splitOverride;
  UserProfile? get savedProfile => _savedProfile;
  bool get isLoading => _isLoading;
  bool get isComplete => _savedProfile != null;

  bool get canFinish =>
      _bodyType != null && _fitnessGoal != null && _equipment.isNotEmpty;

  Future<void> load() async {
    _isLoading = true;
    notifyListeners();
    try {
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getString(_profileKey);
      if (raw != null) {
        _savedProfile =
            UserProfile.fromJson(jsonDecode(raw) as Map<String, dynamic>);
        _applyProfile(_savedProfile!);
      }
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void setBodyType(BodyType value) {
    _bodyType = value;
    notifyListeners();
  }

  void setFitnessGoal(FitnessGoal value) {
    _fitnessGoal = value;
    notifyListeners();
  }

  void toggleEquipment(Equipment value) {
    if (_equipment.contains(value)) {
      _equipment.remove(value);
    } else {
      _equipment.add(value);
    }
    notifyListeners();
  }

  void setDaysPerWeek(int value) {
    _daysPerWeek = value.clamp(2, 6);
    notifyListeners();
  }

  void setExperienceLevel(ExperienceLevel value) {
    _experienceLevel = value;
    notifyListeners();
  }

  void setSplitOverride(SplitType? value) {
    _splitOverride = value;
    notifyListeners();
  }

  Future<UserProfile> saveProfile() async {
    if (!canFinish) {
      throw StateError('Onboarding incomplete');
    }
    final profile = UserProfile(
      id: _savedProfile?.id ?? const Uuid().v4(),
      bodyType: _bodyType!,
      fitnessGoal: _fitnessGoal!,
      availableEquipment: Set.from(_equipment),
      daysPerWeek: _daysPerWeek,
      experienceLevel: _experienceLevel,
      splitOverride: _splitOverride,
    );
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_profileKey, jsonEncode(profile.toJson()));
    _savedProfile = profile;
    notifyListeners();
    return profile;
  }

  Future<void> clearProfile() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_profileKey);
    _savedProfile = null;
    _bodyType = null;
    _fitnessGoal = null;
    notifyListeners();
  }

  void _applyProfile(UserProfile profile) {
    _bodyType = profile.bodyType;
    _fitnessGoal = profile.fitnessGoal;
    _equipment
      ..clear()
      ..addAll(profile.availableEquipment);
    _daysPerWeek = profile.daysPerWeek;
    _experienceLevel = profile.experienceLevel;
    _splitOverride = profile.splitOverride;
  }
}
