from Problem import Problem
import json
import sys

s = Problem()

if len(sys.argv)>1:
  e = json.loads(sys.argv[1])
  html = s.getProblem(e)
else:
  html = s.getProblem()

print(json.dumps(html))