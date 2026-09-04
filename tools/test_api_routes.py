import sys, os
sys.path.insert(0, os.getcwd())

try:
    import api.index as api_mod
    print("api.index imported successfully.")
    routes = [r.path for r in api_mod.app.routes]
    print(f"Total routes in api.index: {len(routes)}")
    print("Has /api/valuation/precedents:", "/api/valuation/precedents" in routes)
    print("Has /api/precedents/match-count:", "/api/precedents/match-count" in routes)
    print("Precedent routes in api.index:", [r for r in routes if 'precedent' in r])
except Exception as e:
    import traceback
    traceback.print_exc()
