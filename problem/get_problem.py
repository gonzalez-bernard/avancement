"""
Récupération problème
"""
import json
import sys
from Problem import Problem


_pb = Problem()

if len(sys.argv)>1:
    data = json.loads(sys.argv[1])
    html = _pb.getProblem(data)
else:
    html = _pb.getProblem()

print(json.dumps(html))
