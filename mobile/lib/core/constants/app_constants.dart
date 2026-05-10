class AppConstants {
  AppConstants._();

  // API base URL — change depending on your environment:
  //   Android emulator  → http://10.0.2.2:3000/api/v1
  //   iOS simulator     → http://127.0.0.1:3000/api/v1
  //   Physical device   → http://192.168.x.x:3000/api/v1  (your PC's local IP)
  //   Production        → https://api.yourdomain.com/api/v1
  static const String baseUrl = 'http://192.168.1.6:3002/api/v1';

  // Storage keys
  static const String tokenKey = 'auth_token';
  static const String userKey = 'auth_user';

  // Assets
  static const String imagesPath = 'assets/images/';
  static const String iconsPath = 'assets/icons/';

  // Timeouts
  static const int connectTimeout = 15000;
  static const int receiveTimeout = 15000;
}
