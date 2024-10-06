import itertools
import re
import sys
import math
from functools import cmp_to_key
from collections import Counter

def debug(*args, **kwargs):
    print(*args, file=sys.stderr, **kwargs)

def plus_mult_replacements(eq):
  positions = [i for i, char in enumerate(eq) if char == '+']

  replacements = list(itertools.product('+*', repeat=len(positions)))

  for replacement in replacements:
    eq_list = list(eq)
    for pos, new_char in zip(positions, replacement):
      eq_list[pos] = new_char
    yield ''.join(eq_list)

def equals_13(eq):
  try:
    result = eval(eq)
    return result == 13
  except:
    return False

def permutation_count(k, N):
  if N > k:
    return 0
  return math.factorial(k) // math.factorial(k - N)

def get_equations(symbols):
  MIN = 4
  MAX = 9

  done = set()

  COUNT = 0
  for n in range(MIN, MAX + 1):
    COUNT += permutation_count(len(symbols), n)

  progress = 0
  for n in range(MIN, MAX + 1):
    for test in itertools.permutations(symbols, n):
      progress += 1
      if progress % 80000 == 0:
        print('Progress:', f"{progress * 100 / COUNT:.2f}%")

      eq = ''.join(test)

      if eq in done:
        continue
      done.add(eq)

      if eq[0] in '-+' or eq[-1] in '-+' or ('1' in eq and '3' in eq) or re.search('[-+][-+]', eq):
        continue
      for eq2 in plus_mult_replacements(eq):
        if not equals_13(eq2):
          continue
        yield eq2

def can_be_removed(str1, str2):
  count1 = Counter(str1)
  count2 = Counter(str2)

  return all(count1[char] >= count2[char] for char in count2)

def split_and_keep(s):
  parts = re.split(r'([+-])', s)
  result = [parts[0]] + [parts[i] + parts[i+1] for i in range(1, len(parts)-1, 2)]
  return result

def compare_eqs(eq1, eq2):
  if len(eq1) < len(eq2):
    return -1
  if len(eq2) < len(eq1):
    return 1

  parts1 = tuple([eval(x) for x in split_and_keep(eq1)])
  parts2 = tuple([eval(x) for x in split_and_keep(eq2)])

  if len(parts1) < len(parts2):
    return -1
  if len(parts2) < len(parts1):
    return 1

  if parts1 < parts2:
    return -1
  if parts1 > parts2:
    return 1
  return 0

def get_best_equation(eqs):
  return max(eqs, key=cmp_to_key(compare_eqs))

LEVELS = [
  '111133+++',
  '112+112+23+',
  '+2+3+5111',
  '323322232++++++',
  '1234566+++',
  '1234569+++',
  '1234599+++',
  '25334425--+-',
  '++2+1--5111',
]

eqs = set(['13', '9+4', '8+5', '7+6'])

i = 1
for LEVEL in LEVELS:
  print(f'Progress: level {i} from {len(LEVELS)}')
  eqs |= set(get_equations(LEVEL))
  i += 1

debug(f'Found {len(eqs)} equations')

keys_map = {}
for eq in eqs:
  key = ''.join(sorted(eq)).replace('*', '+')
  if key not in keys_map:
    keys_map[key] = []
  keys_map[key].append(eq)

keys = list(keys_map)
filtered_keys = []
for key in keys:
  keep = True
  for key2 in keys:
    if key2 == key: continue
    if can_be_removed(key, key2):
      keep = False
      break
  if keep:
    filtered_keys.append(key)

best_eqs = []
for key in filtered_keys:
  best_eqs.append(get_best_equation(keys_map[key]))

for eq in sorted(best_eqs, key=cmp_to_key(compare_eqs)):
  print(f"'{eq}',")

