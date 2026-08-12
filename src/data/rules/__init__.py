import os
import re
import json

KOREAN_HS_RULES = []

current_dir = os.path.dirname(os.path.abspath(__file__))

for filename in sorted(os.listdir(current_dir)):
    if filename.startswith("chapter_") and filename.endswith(".ts"):
        filepath = os.path.join(current_dir, filename)
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            
            eq_idx = content.find("=")
            if eq_idx != -1:
                start_idx = content.find("[", eq_idx)
                end_idx = content.rfind("]")
                if start_idx != -1 and end_idx != -1:
                    json_str = content[start_idx:end_idx + 1]
                    json_str = re.sub(r'//.*$', '', json_str, flags=re.MULTILINE)
                    json_str = re.sub(r'/\*.*?\*/', '', json_str, flags=re.DOTALL)
                    json_str = re.sub(r',\s*(?=[\]}])', '', json_str)
                    
                    rules = json.loads(json_str)
                    if isinstance(rules, list):
                        KOREAN_HS_RULES.extend(rules)
        except Exception as e:
            print(f"Error parsing {filename}: {e}")
