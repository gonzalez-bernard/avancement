from problem.Problem import Problem
import json


s = Problem()
s.html = s.getProblem()

print(json.dumps(s.html))


'''
for q in s.tree.xpath("/problems/problem/question"):
  print(q.text)

print("arbre ")
print(s.tree)

print("liste ")
print(s.lst_problems)

Q1 = s.lst_problems[1]

# on accède au texte
print(Q1)
print(Q1.find('calcul').text)
print(Q1.find('calcul').tag)

for e in Q1:
  print(e.text)

s.get_elements(1)

print(s.context)
'''