import time
from collections import deque
import difflib

class RangeFilter:
    def __init__(self, subjects=None):
        # Trigger Phrases (Gemma 4 Optimized)
        self.subjects = subjects or [
            # Handle Phonetics
            "covi", "kovi", "cobe", "kove", "covilla", "hey covi", "check this cobe", 
            "call be", "cow be", "ko be", "coffee time", "code review", "coby",
            # Design Intent
            "design system", "update the mockup", "pixel perfect", "user experience", 
            "iterating on", "figma components", "design tokens", "user interface", 
            "accessibility check", "wireframe phase", "ux design", "ui design",
            "high fidelity", "low fidelity", "prototyping", "design iteration",
            "visual design", "design principles", "user flow", "ia architecture",
            # Action Oriented
            "start the engine", "new version", "fix the bug", "prototype this",
            "push to main", "deploy now", "run the script", "gode mode"
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
            # 1. Exact Substring Match (Reliable for phrases)
            if s_low in context_text:
                return context_text, subject
            
            # 2. Fuzzy Word-by-Word (Handles Whisper typos)
            words = context_text.split()
            for word in words:
                if len(word) > 3: # Avoid noise on small words
                    ratio = difflib.SequenceMatcher(None, s_low, word).ratio()
                    if ratio > 0.85:
                        return context_text, f"{subject} (Fuzzy: {word})"
                    
        return None, None
