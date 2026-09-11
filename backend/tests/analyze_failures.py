import re

log_path = r'C:/Users/PJH/.gemini/antigravity-ide/brain/5f436d42-7638-4d5b-aa8f-70c6d93440ef/.system_generated/tasks/task-2760.log'
with open(log_path, 'r', encoding='utf-8') as f:
    text = f.read()

failures = re.findall(r'\[FAIL\] (.*?) +-> Got: (.*?) +\(Exp: (.*?)\)', text)
print(f'Total regex failures found: {len(failures)}')

unique_patterns = {}
for name, got, exp in failures:
    base_name = re.sub(r'(모델|규격|등급|사양|품종|패키지|파츠)\s*\d+-\d+', '', name).strip()
    if base_name not in unique_patterns:
        unique_patterns[base_name] = {'count': 0, 'got': set(), 'exp': set(), 'examples': []}
    unique_patterns[base_name]['count'] += 1
    unique_patterns[base_name]['got'].add(got)
    unique_patterns[base_name]['exp'].add(exp)
    if len(unique_patterns[base_name]['examples']) < 2:
        unique_patterns[base_name]['examples'].append(name)

lines = []
lines.append(f"Total regex failures: {len(failures)}")
lines.append(f"Total unique root failure patterns: {len(unique_patterns)}\n")

for k, v in sorted(unique_patterns.items(), key=lambda x: x[1]['count'], reverse=True):
    lines.append(f"Count: {v['count']} | Pattern: '{k}'")
    lines.append(f"  Got: {list(v['got'])}")
    lines.append(f"  Exp: {list(v['exp'])}")
    lines.append(f"  Examples: {v['examples']}")
    lines.append("")

out_file = r'C:/Users/PJH/onestop-ai-custom-service/backend/tests/failure_summary.txt'
with open(out_file, 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print(f"Written summary to {out_file}")
