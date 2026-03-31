from .auth_service import (
    get_password_hash, verify_password, create_access_token,
    decode_token, get_google_user_info, get_github_user_info
)
from .alert_service import (
    create_alert, get_active_alerts, get_all_alerts,
    update_alert_status, get_alert_stats
)
from .planogram_service import (
    create_planogram, get_planograms, get_planogram, compare_compliance
)
from .detection_service import DetectionService
from .forecasting_service import ForecastingService
from .inventory_service import InventoryService
from .camera_service import (
    get_all_cameras, get_camera, add_camera,
    update_camera, delete_camera, check_camera_health
)
from .websocket_manager import manager

# report_service requires reportlab - optional import
try:
    from .report_service import generate_stockout_pdf
except ImportError:
    generate_stockout_pdf = None

__all__ = [
    "get_password_hash", "verify_password", "create_access_token", "decode_token",
    "get_google_user_info", "get_github_user_info",
    "create_alert", "get_active_alerts", "get_all_alerts",
    "update_alert_status", "get_alert_stats",
    "create_planogram", "get_planograms", "get_planogram", "compare_compliance",
    "DetectionService", "ForecastingService", "InventoryService",
    "get_all_cameras", "get_camera", "add_camera",
    "update_camera", "delete_camera", "check_camera_health",
    "generate_stockout_pdf", "manager"
]