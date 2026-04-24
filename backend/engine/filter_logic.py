import time
from collections import deque
import difflib

class RangeFilter:
    def __init__(self, subjects=None):
        # Trigger Phrases (Gemma 4 Optimized + User Transcript Error Correction)
        self.subjects = subjects or [
            # Handle & Phonetics
            "covi", "kovi", "cobe", "kove", "covilla", "hey covi", "check this cobe", 
            "call be", "cow be", "ko be", "coffee", "code", "coby", "covia",
            # Design Lingo (Standard)
            "design", "ux", "ui", "figma", "prototype", "wireframe", "heuristics", 
            "affordance", "accessibility", "design system", "tokens", "user flow", 
            "information architecture", "micro-interaction", "iterate", "mockup",
            # Whisper Resilience (Based on user's actual transcript errors)
            "the sign", "the sign thinking", "douche burning", "douche", "factory side",
            "high-war", "high war", "angel boudong", "angel button", "prart", "yavascript",
            "the sprouting", "the sprouting and hooks", "happy rodin", "happy roading"
        ]
        self.history = deque(maxlen=50) 

    def update_subjects(self, new_subjects):
        self.subjects = [s.lower() for s in new_subjects]

    def process_segment(self, text):
        now = time.time()
        self.history.append((now, text))
        
        # Sliding 10s Window
        context_segments = [seg[1] for seg in self.history if now - seg[0] <= 10]
        context_text = " ".join(context_segments).lower()
        
        for subject in self.subjects:
            s_low = subject.lower()
            
            # 1. Exact Substring Match (Now more aggressive)
            if s_low in context_text:
                return context_text, subject
            
            # 2. Fuzzy Matching with length-dependent sensitivity
            words = context_text.split()
            for word in words:
                clean_word = word.strip(".,!?")
                ratio = difflib.SequenceMatcher(None, s_low, clean_word).ratio()
                
                # High sensitivity for short terms (UX/UI), strict for long terms
                threshold = 0.7 if len(s_low) <= 3 else 0.85
                
                if ratio > threshold:
                    return context_text, f"{subject} (Detected as: {clean_word})"
                    
        return None, None
