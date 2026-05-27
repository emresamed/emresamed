import 'package:flutter/foundation.dart';

import '../core/errors.dart';
import '../data/datasources/seed_data_source.dart';

/// Preloads seed assets once at startup with explicit error state.
class BootstrapNotifier extends ChangeNotifier {
  BootstrapNotifier(this._source);

  final SeedDataSource _source;

  bool _ready = false;
  bool _loading = true;
  String? _error;

  bool get ready => _ready;
  bool get loading => _loading;
  String? get error => _error;

  Future<void> init() async {
    if (_ready) return;
    _loading = true;
    _error = null;
    notifyListeners();
    try {
      await _source.preloadAll();
      _ready = true;
    } on SeedDataException catch (e) {
      _error = e.message;
      debugPrint('Bootstrap failed: $e');
    } catch (e, st) {
      _error = 'Failed to load workout data.';
      debugPrint('Bootstrap failed: $e\n$st');
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<void> retry() async {
    _ready = false;
    await init();
  }
}
