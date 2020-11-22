"""
Tests problem
"""
import json
from problem.Problem import Problem


s = Problem()
s.html = s.getProblem()

print(json.dumps(s.html))
