import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../models/user_model.dart';
import '../core/constants/app_constants.dart';

class AuthState {
  final String? token;
  final UserModel? user;
  final bool isLoading;

  const AuthState({
    this.token,
    this.user,
    this.isLoading = false,
  });

  bool get isAuthenticated => token != null && user != null;

  AuthState copyWith({
    String? token,
    UserModel? user,
    bool? isLoading,
    bool clearToken = false,
    bool clearUser = false,
  }) {
    return AuthState(
      token: clearToken ? null : (token ?? this.token),
      user: clearUser ? null : (user ?? this.user),
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  final FlutterSecureStorage _storage;

  AuthNotifier(this._storage) : super(const AuthState(isLoading: true)) {
    _loadFromStorage();
  }

  Future<void> _loadFromStorage() async {
    final token = await _storage.read(key: AppConstants.tokenKey);
    final userJson = await _storage.read(key: AppConstants.userKey);
    if (token != null && userJson != null) {
      final user = UserModel.fromJson(jsonDecode(userJson));
      state = AuthState(token: token, user: user);
    } else {
      state = const AuthState();
    }
  }

  Future<void> login(String token, UserModel user) async {
    await _storage.write(key: AppConstants.tokenKey, value: token);
    await _storage.write(
        key: AppConstants.userKey, value: jsonEncode(user.toJson()));
    state = AuthState(token: token, user: user);
  }

  Future<void> logout() async {
    await _storage.delete(key: AppConstants.tokenKey);
    await _storage.delete(key: AppConstants.userKey);
    state = const AuthState();
  }

  Future<void> updateUser(UserModel user) async {
    await _storage.write(
        key: AppConstants.userKey, value: jsonEncode(user.toJson()));
    state = state.copyWith(user: user);
  }
}

final _storageProvider = Provider<FlutterSecureStorage>(
  (_) => const FlutterSecureStorage(),
);

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>(
  (ref) => AuthNotifier(ref.watch(_storageProvider)),
);
