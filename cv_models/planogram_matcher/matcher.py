import cv2
import numpy as np
from typing import Dict, List, Tuple

class PlanogramMatcher:
    def __init__(self):
        self.orb = cv2.ORB_create()
    
    def extract_features(self, image):
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        keypoints, descriptors = self.orb.detectAndCompute(gray, None)
        return keypoints, descriptors
    
    def match_planograms(self, captured_image, reference_image):
        kp1, des1 = self.extract_features(captured_image)
        kp2, des2 = self.extract_features(reference_image)
        
        bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
        matches = bf.match(des1, des2)
        
        matches = sorted(matches, key=lambda x: x.distance)
        
        similarity_score = len(matches) / max(len(kp1), len(kp2)) * 100
        
        return {
            "similarity_score": round(similarity_score, 2),
            "matches_found": len(matches),
            "is_compliant": similarity_score > 70
        }