from datetime import datetime, timedelta
from typing import Dict, List
from io import BytesIO

try:
    from reportlab.lib.pagesizes import letter
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib import colors
    HAS_REPORTLAB = True
except ImportError:
    HAS_REPORTLAB = False

async def generate_stockout_pdf(stockout_data: Dict) -> BytesIO:
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []
    
    # Title
    title_style = ParagraphStyle(name='Title', fontSize=24, alignment=1, spaceAfter=30)
    story.append(Paragraph("Stockout Report", title_style))
    
    # Date
    story.append(Paragraph(f"Generated: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')}", styles['Normal']))
    story.append(Spacer(1, 20))
    
    # Summary
    story.append(Paragraph(f"Total Stockouts: {stockout_data.get('total_stockouts', 0)}", styles['Normal']))
    story.append(Paragraph(f"Revenue Loss: ${stockout_data.get('total_revenue_loss', 0):,.2f}", styles['Normal']))
    
    doc.build(story)
    buffer.seek(0)
    return buffer