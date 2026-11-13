import requests
import cv2
import numpy as np
from PIL import Image
import io

def test_face_expression_endpoint():
    """Test the face expression endpoint"""
    
    # Create a simple test image (black image with some content)
    test_image = np.zeros((480, 640, 3), dtype=np.uint8)
    test_image[200:280, 270:370] = [255, 255, 255]  # White rectangle
    
    # Convert to JPEG
    success, buffer = cv2.imencode('.jpg', test_image)
    if not success:
        print("Failed to encode test image")
        return
    
    # Create file-like object
    image_file = io.BytesIO(buffer.tobytes())
    
    # Test the endpoint
    url = "http://127.0.0.1:8000/api/ai/expression/"
    files = {'frame': ('test.jpg', image_file, 'image/jpeg')}
    
    try:
        print("Testing face expression endpoint...")
        response = requests.post(url, files=files)
        print(f"Response status: {response.status_code}")
        print(f"Response content: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            print("Success! Response data:", data)
        else:
            print("Error response:", response.text)
            
    except requests.exceptions.ConnectionError:
        print("Connection error: Make sure the Django server is running on http://127.0.0.1:8000")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_face_expression_endpoint() 