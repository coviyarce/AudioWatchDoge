# subject_packs.py
# Centralized dictionary of domain-specific trigger phrases.
# Curated by Gemma 4 for GodeMode.

PACKS = {
    'UX_UI': [
        'figma', 'prototype', 'prototypes', 'design systems', 'tokens', 'heuristics', 
        'user experience', 'ux', 'ui', 'a11y', 'accessibility', 'iteration', 
        'mockup', 'mockups', 'wireframe', 'wireframes', 'the sign', 'the sign thinking', 
        'design thinking', 'user flow', 'information architecture', 'micro-interaction'
    ],
    'ARCHITECT': [
        'factorization', 'clean architecture', 'technical debt', 'ci/cd', 
        'infrastructure as code', 'iac', 'scalability', 'modularization', 
        'gode mode', 'factory side', 'refactoring', 'modular', 'high-war'
    ],
    'GENERAL': [
        'alert', 'critical', 'error', 'covi', 'kovi', 'kobe', 'coffee', 'code',
        'cobe', 'kove', 'covilla', 'hey covi', 'check this cobe', 'call be', 
        'cow be', 'ko be', 'coby', 'covia'
    ]
}

def get_pack_list():
    return list(PACKS.keys())

def get_pack_subjects(pack_id):
    return PACKS.get(pack_id, PACKS['GENERAL'])
