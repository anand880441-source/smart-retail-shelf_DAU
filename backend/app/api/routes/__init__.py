from .auth import router as auth_router
from .alerts import router as alerts_router
from .analytics import router as analytics_router
from .planogram import router as planogram_router
from .dashboard import router as dashboard_router
from .detection import router as detection_router
from .products import router as products_router
from .forecasting import router as forecasting_router
from .inventory import router as inventory_router
from .cameras import router as cameras_router
from .stores import router as stores_router
from .reports import router as reports_router

__all__ = [
    "auth_router", "alerts_router", "analytics_router", "planogram_router",
    "dashboard_router", "detection_router", "products_router",
    "forecasting_router", "inventory_router", "cameras_router",
    "stores_router", "reports_router"
]