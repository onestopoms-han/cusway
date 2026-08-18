import os
import re
import json

def load_korean_hs_rules():
    # Locate the root folder
    parent_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    rules_dir = os.path.join(parent_dir, "src", "data", "rules")
    
    rules = []
    if not os.path.exists(rules_dir):
        print(f"[RULES-LOADER] Directory not found: {rules_dir}")
        return rules
        
    for filename in sorted(os.listdir(rules_dir)):
        if filename.startswith("chapter_") and filename.endswith(".ts"):
            filepath = os.path.join(rules_dir, filename)
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()
                
                # Locate the array boundary after '='
                eq_idx = content.find("=")
                if eq_idx != -1:
                    start_idx = content.find("[", eq_idx)
                else:
                    start_idx = content.find("[")
                
                end_idx = content.rfind("]")
                if start_idx != -1 and end_idx != -1:
                    array_str = content[start_idx:end_idx+1]
                    
                    # Clean trailing commas for JSON parsing
                    array_str = re.sub(r',\s*([\]}])', r'\1', array_str)
                    
                    parsed_rules = json.loads(array_str)
                    rules.extend(parsed_rules)
            except Exception as e:
                print(f"[RULES-LOADER] Error parsing {filename}: {e}")
                
    return rules

KOREAN_HS_RULES = load_korean_hs_rules()
