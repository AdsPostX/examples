import 'package:flutter/material.dart';

/// A service for managing navigation throughout the app.
///
/// This service abstracts away direct Navigator calls, making navigation
/// logic testable and reusable. It can be injected into ViewModels or used
/// directly in widgets, improving separation of concerns.
///
/// Example usage:
/// ```dart
/// final navigationService = NavigationService();
/// navigationService.pop();
/// navigationService.push(MyPage());
/// ```
class NavigationService {
  /// A global key for accessing the navigator state from anywhere in the app.
  final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

  /// Returns the current navigator state.
  /// Throws an error if the navigator is not yet initialized.
  NavigatorState get _navigator {
    final state = navigatorKey.currentState;
    if (state == null) {
      throw Exception('Navigator is not initialized. Make sure navigatorKey is set in MaterialApp.');
    }
    return state;
  }

  /// Pops the current route off the navigator.
  ///
  /// Returns true if the navigation was successful, false otherwise.
  /// Optionally accepts a [result] to return to the previous screen.
  bool pop<T>([T? result]) {
    if (_navigator.canPop()) {
      _navigator.pop(result);
      return true;
    }
    return false;
  }

  /// Pushes a new route onto the navigator.
  ///
  /// Returns a Future that completes with the result value when the pushed
  /// route is popped off the navigator.
  Future<T?> push<T>(Route<T> route) {
    return _navigator.push(route);
  }

  /// Pushes a new route and removes all previous routes until the predicate returns true.
  ///
  /// If [predicate] is null, all previous routes are removed.
  Future<T?> pushAndRemoveUntil<T>(Route<T> route, bool Function(Route<dynamic>) predicate) {
    return _navigator.pushAndRemoveUntil(route, predicate);
  }

  /// Replaces the current route with a new route.
  Future<T?> pushReplacement<T, TO>(Route<T> route, {TO? result}) {
    return _navigator.pushReplacement(route, result: result);
  }

  /// Pops routes until the predicate returns true.
  void popUntil(bool Function(Route<dynamic>) predicate) {
    _navigator.popUntil(predicate);
  }

  /// Returns true if the navigator can pop the current route.
  bool canPop() {
    return _navigator.canPop();
  }

  /// Returns the current BuildContext from the navigator.
  BuildContext? get currentContext => navigatorKey.currentContext;
}

