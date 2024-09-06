from collections import Counter
def partitions(n, max_num=None):
    if max_num is None or max_num > n:
        max_num = n
    if n == 0:
        return [[]]
    result = []
    for i in range(max_num, 0, -1):
        for p in partitions(n - i, i):
            result.append([i] + p)
    return result

def partition_digits(partition):
    for num in partition:
        if num < 10:
            yield num
        else:
            yield num // 10
            yield num % 10

def is_superset(partition1, partition2):
    digits1 = sorted(list(partition_digits(partition1)))
    digits2 = sorted(list(partition_digits(partition2)))

    if tuple(digits1) == tuple(digits2):
        return tuple(partition1) > tuple(partition2)

    count1 = Counter(digits1)
    count2 = Counter(digits2)

    for num in count2:
        if count1[num] < count2[num]:
            return False
    return True

def filter_supersets(partitions):
    filtered = []
    for i, partition in enumerate(partitions):
        filter_it = False
        for j, other_partition in enumerate(partitions):
            if i != j and is_superset(partition, other_partition):
                filter_it = True
                break
        if not filter_it:
            filtered.append(partition)
    return filtered

n = 13
all_partitions = partitions(n)
filtered_partitions = filter_supersets(all_partitions)

# Output the filtered partitions
for partition in filtered_partitions:
    print("'" + '+'.join([str(x) for x in partition]) + "',")
