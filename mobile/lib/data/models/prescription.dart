class Prescription {
  const Prescription({
    required this.exerciseId,
    required this.sets,
    required this.repRangeMin,
    required this.repRangeMax,
    required this.targetRPE,
    required this.restSeconds,
    required this.intensityPercent1RM,
    this.notes,
  });

  final String exerciseId;
  final int sets;
  final int repRangeMin;
  final int repRangeMax;
  final double targetRPE;
  final int restSeconds;
  final double intensityPercent1RM;
  final String? notes;

  Map<String, dynamic> toJson() => {
        'exerciseId': exerciseId,
        'sets': sets,
        'repRangeMin': repRangeMin,
        'repRangeMax': repRangeMax,
        'targetRPE': targetRPE,
        'restSeconds': restSeconds,
        'intensityPercent1RM': intensityPercent1RM,
        if (notes != null) 'notes': notes,
      };
}
