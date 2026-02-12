import random


def generate_random_list(size, lower=0, upper=20000):
    """
    Generates a list of random integers.

    Parameters:
        size (int): Number of elements to generate
        lower (int): Minimum possible value
        upper (int): Maximum possible value

    Returns:
        list: List of random integers
    """
    if size <= 0:
        raise ValueError("Size must be a positive integer.")

    # List comprehension is memory efficient and fast
    return [random.randint(lower, upper) for _ in range(size)]


def find_intersection_efficient(list1, list2):
    """
    Finds the intersection of two lists without nested loops.
    Uses hashing for O(n) average time complexity.

    Returns:
        set: Unique common elements
    """
    try:
        # Convert smaller list to set for better memory efficiency
        if len(list1) < len(list2):
            lookup_set = set(list1)
            other = list2
        else:
            lookup_set = set(list2)
            other = list1

        intersection = set()

        # Single pass — no nested loops
        for num in other:
            if num in lookup_set:
                intersection.add(num)

        return intersection

    except TypeError as e:
        print(f"Type error during intersection: {e}")
        return set()
    except Exception as e:
        print(f"Unexpected error during intersection: {e}")
        return set()


def deliberate_errors(numbers):
    """
    Intentionally triggers errors but handles them
    so the program does not crash.
    """

    # ---- 1️⃣ Access out-of-range index ----
    try:
        print("\nAttempting to access the 10001st element...")
        value = numbers[10000]  # Index 10000 = 10001st element
        print(f"Value: {value}")
    except IndexError:
        print("Handled Error: Index 10001 does not exist (out of range).")
    except Exception as e:
        print(f"Unexpected error: {e}")

    # ---- 2️⃣ Perform math operation on None ----
    try:
        print("\nAttempting mathematical operation on None...")
        null_value = None
        result = null_value + 10  # Will raise TypeError
        print(result)
    except TypeError:
        print("Handled Error: Cannot perform arithmetic on None.")
    except Exception as e:
        print(f"Unexpected error: {e}")


def main():
    try:
        SIZE = 10000

        # Generate two large random lists
        list1 = generate_random_list(SIZE)
        list2 = generate_random_list(SIZE)

        print(f"Generated two lists of size {SIZE}.")

        # Compute intersection efficiently
        intersection = find_intersection_efficient(list1, list2)

        print(f"Intersection contains {len(intersection)} unique elements.")

        # Continue processing safely
        total_sum = 0
        for num in intersection:
            try:
                total_sum += num
            except TypeError:
                # Defensive programming (unlikely here, but safe)
                print(f"Skipping invalid value: {num}")

        print(f"Sum of intersection elements: {total_sum}")

        # Trigger controlled errors
        deliberate_errors(list1)

        print("\nProgram completed successfully without crashing.")

    except ValueError as ve:
        print(f"Input error: {ve}")
    except MemoryError:
        print("Memory allocation failed.")
    except Exception as e:
        print(f"Fatal unexpected error: {e}")


if __name__ == "__main__":
    main()