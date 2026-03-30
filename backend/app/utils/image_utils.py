from PIL import Image
import io
import base64

def decode_base64_image(base64_string: str) -> Image.Image:
    image_data = base64.b64decode(base64_string)
    return Image.open(io.BytesIO(image_data))

def encode_image_to_base64(image: Image.Image, format: str = "JPEG") -> str:
    buffer = io.BytesIO()
    image.save(buffer, format=format)
    return base64.b64encode(buffer.getvalue()).decode("utf-8")

def resize_image(image: Image.Image, max_size: int = 1024) -> Image.Image:
    ratio = max_size / max(image.size)
    if ratio < 1:
        new_size = (int(image.size[0] * ratio), int(image.size[1] * ratio))
        return image.resize(new_size, Image.Resampling.LANCZOS)
    return image