/// Thrown when seed JSON cannot be loaded or parsed.
class SeedDataException implements Exception {
  SeedDataException(this.message, {this.cause});

  final String message;
  final Object? cause;

  @override
  String toString() =>
      'SeedDataException: $message${cause != null ? ' ($cause)' : ''}';
}

/// Thrown when workout generation fails validation or produces no exercises.
class WorkoutGenerationException implements Exception {
  WorkoutGenerationException(this.message);

  final String message;

  @override
  String toString() => 'WorkoutGenerationException: $message';
}
