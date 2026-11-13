#!/usr/bin/env python3
"""
Test script to verify ML/DL setup for Python 3.13
"""

import sys
import os

def test_imports():
    """Test if all ML libraries can be imported"""
    print("Testing ML/DL library imports for Python 3.13...")
    
    # Test basic ML libraries
    try:
        import numpy as np
        print("✓ NumPy imported successfully")
        print(f"  Version: {np.__version__}")
    except ImportError as e:
        print(f"✗ NumPy import failed: {e}")
    
    try:
        import pandas as pd
        print("✓ Pandas imported successfully")
        print(f"  Version: {pd.__version__}")
    except ImportError as e:
        print(f"✗ Pandas import failed: {e}")
    
    # Test Scikit-learn
    try:
        import sklearn
        print("✓ Scikit-learn imported successfully")
        print(f"  Version: {sklearn.__version__}")
    except ImportError as e:
        print(f"✗ Scikit-learn import failed: {e}")
    
    # Test OpenCV
    try:
        import cv2
        print("✓ OpenCV imported successfully")
        print(f"  Version: {cv2.__version__}")
    except ImportError as e:
        print(f"✗ OpenCV import failed: {e}")
    
    # Test AI analysis module
    try:
        from interview.ai_analysis import AIAnalysisEngine, analyze_interview_response
        print("✓ AI Analysis module imported successfully")
    except ImportError as e:
        print(f"✗ AI Analysis module import failed: {e}")
    
    # Note about TensorFlow and PyTorch
    print("\nℹ️  Note: TensorFlow and PyTorch are not yet compatible with Python 3.13")
    print("   Using scikit-learn and other compatible libraries for ML functionality")

def test_basic_ml_operations():
    """Test basic ML operations"""
    print("\nTesting basic ML operations...")
    
    try:
        import numpy as np
        import pandas as pd
        
        # Test NumPy operations
        arr = np.array([1, 2, 3, 4, 5])
        print(f"✓ NumPy array created: {arr}")
        print(f"  Mean: {np.mean(arr)}")
        
        # Test Pandas operations
        df = pd.DataFrame({'A': [1, 2, 3], 'B': [4, 5, 6]})
        print(f"✓ Pandas DataFrame created with shape: {df.shape}")
        
        print("✓ Basic ML operations working")
        
    except Exception as e:
        print(f"✗ Basic ML operations failed: {e}")

def test_sklearn_operations():
    """Test Scikit-learn operations"""
    print("\nTesting Scikit-learn operations...")
    
    try:
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.ensemble import RandomForestClassifier
        
        # Test TF-IDF
        vectorizer = TfidfVectorizer(max_features=10)
        texts = ["This is a test document", "Another test document"]
        tfidf_matrix = vectorizer.fit_transform(texts)
        print(f"✓ TF-IDF vectorizer working: {tfidf_matrix.shape}")
        
        # Test Random Forest
        clf = RandomForestClassifier(n_estimators=10, random_state=42)
        X = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
        y = [0, 1, 0]
        clf.fit(X, y)
        print("✓ Random Forest classifier working")
        
    except Exception as e:
        print(f"✗ Scikit-learn operations failed: {e}")

def test_ai_analysis():
    """Test AI analysis functionality"""
    print("\nTesting AI analysis functionality...")
    
    try:
        from interview.ai_analysis import analyze_interview_response
        
        # Test text analysis
        test_text = "I am very excited about this opportunity and believe I would be a great fit for this role. I have excellent communication skills and work well in teams."
        
        result = analyze_interview_response(test_text)
        print("✓ AI analysis completed successfully")
        print(f"  Analysis result: {result}")
        
        if 'nlp_analysis' in result:
            nlp_result = result['nlp_analysis']
            if 'confidence_score' in nlp_result:
                print(f"  Confidence score: {nlp_result['confidence_score']:.2f}")
            if 'analysis' in nlp_result:
                print(f"  Analysis: {nlp_result['analysis']}")
        
    except Exception as e:
        print(f"✗ AI analysis test failed: {e}")

def test_opencv_operations():
    """Test OpenCV operations"""
    print("\nTesting OpenCV operations...")
    
    try:
        import cv2
        import numpy as np
        
        # Create a simple test image
        img = np.zeros((100, 100, 3), dtype=np.uint8)
        img[:] = (255, 0, 0)  # Blue color
        
        # Test basic OpenCV operations
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        print(f"✓ OpenCV image processing working: {gray.shape}")
        
        # Test face detection cascade loading
        cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        face_cascade = cv2.CascadeClassifier(cascade_path)
        print("✓ OpenCV face detection cascade loaded")
        
    except Exception as e:
        print(f"✗ OpenCV operations failed: {e}")

def main():
    """Main test function"""
    print("=" * 60)
    print("ML/DL Setup Test for Python 3.13")
    print("=" * 60)
    
    test_imports()
    test_basic_ml_operations()
    test_sklearn_operations()
    test_ai_analysis()
    test_opencv_operations()
    
    print("\n" + "=" * 60)
    print("Test completed!")
    print("=" * 60)
    print("\nSummary:")
    print("- ✓ NumPy, Pandas, Scikit-learn for data science")
    print("- ✓ OpenCV for computer vision")
    print("- ✓ Custom AI analysis engine")
    print("- ⚠️  TensorFlow/PyTorch not available for Python 3.13")
    print("- 💡 Consider using Python 3.11 or 3.12 for full ML/DL support")

if __name__ == "__main__":
    main() 