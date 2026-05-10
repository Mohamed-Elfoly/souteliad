class SupportTicketModel {
  final String id;
  final String reason;
  final String message;
  final String status;
  final String? adminReply;
  final DateTime? repliedAt;
  final DateTime createdAt;

  const SupportTicketModel({
    required this.id,
    required this.reason,
    required this.message,
    required this.status,
    this.adminReply,
    this.repliedAt,
    required this.createdAt,
  });

  bool get isResolved => status == 'resolved';
  bool get hasReply => adminReply != null && adminReply!.isNotEmpty;

  factory SupportTicketModel.fromJson(Map<String, dynamic> json) {
    return SupportTicketModel(
      id: json['_id'] ?? json['id'] ?? '',
      reason: json['reason'] ?? '',
      message: json['message'] ?? '',
      status: json['status'] ?? 'new',
      adminReply: json['adminReply'],
      repliedAt: json['repliedAt'] != null
          ? DateTime.tryParse(json['repliedAt'])
          : null,
      createdAt: DateTime.tryParse(json['createdAt'] ?? '') ?? DateTime.now(),
    );
  }
}
