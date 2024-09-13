import itertools
import re
from collections import Counter

def normalize_expression(expr):
    # Split the expression into numbers and operators
    tokens = re.findall(r'(\d+|\+|\*)', expr)

    # Identify if the expression is commutative (contains only + or *)
    if '+' in tokens and '*' not in tokens:
        # Sort numbers for commutative addition
        numbers = sorted([int(token) for token in tokens if token.isdigit()])
        normalized_expr = '+'.join(map(str, numbers))
    elif '*' in tokens and '+' not in tokens:
        # Sort numbers for commutative multiplication
        numbers = sorted([int(token) for token in tokens if token.isdigit()])
        normalized_expr = '*'.join(map(str, numbers))
    else:
        # Return original if the expression is non-commutative or mixed
        normalized_expr = expr

    return normalized_expr

def filter_commutative_duplicates(expressions):
    seen = set()
    result = []

    for expr in expressions:
        normalized = normalize_expression(expr)
        if normalized not in seen:
            seen.add(normalized)
            result.append(expr)

    return result

symbols = ['2', '5', '3', '4', '4', '3', '2', '5', '-', '-', '-', '+', '*']

results = set()
for n in range(3, 9):
    for test in itertools.permutations(symbols, n):
      eq = ''.join(test)
      try:
          result = eval(eq)
          cond = (result == 13)
      except:
          continue
      if not cond:
          continue
      eq = ''.join(test)
      orig = eq
      eq = eq.replace('+++', '+')
      eq = eq.replace('++', '+')
      eq = eq.replace('-+', '-')
      eq = eq.replace('+-', '-')
      eq = eq.replace('--', '+')
      eq = eq.replace('*+', '*')
      eq = eq.replace('+++', '+')
      eq = eq.replace('++', '+')
      eq = eq.replace('+-', '-')
      eq = eq.replace('--', '+')
      eq = eq.replace('*+', '*')
      if eq[0] == '+' or eq[0] == '-':
          continue
      if '*-' in eq:
          continue

      eq = normalize_expression(eq)

      do_add = True
      eq_alt = eq.replace('*', '+')
      new_counter = Counter(eq_alt)
      for eq2 in results:
          eq2_alt = eq2.replace('*', '+')
          existing_counter = Counter(eq2_alt)
          if all(new_counter[char] >= existing_counter[char] for char in existing_counter):
              do_add = False
              break

      if do_add:
          results.add(eq)

          print("'%s'," % (eq))
