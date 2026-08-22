import sys
from PIL import Image

in_path = sys.argv[1]
out_path = sys.argv[2]
try:
    img = Image.open(in_path)
    img = img.rotate(180, expand=True) 
    img.save(out_path)
    print("Rotated successfully")
except Exception as e:
    print(f"Error: {e}")
