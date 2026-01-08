import json
import os
import sys

def check_duplicates(file_path):
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found.")
        sys.exit(1)

    with open(file_path, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError as e:
            print(f"Error: Failed to decode JSON: {e}")
            sys.exit(1)

    seen = {}
    duplicates = []

    for record in data:
        key = (record['license_plate'], record['violation_time'])
        if key in seen:
            duplicates.append({
                "key": key,
                "first_occurrence": seen[key],
                "duplicate": record
            })
        else:
            seen[key] = record

    if duplicates:
        print(f"Found {len(duplicates)} duplicate(s):")
        for d in duplicates:
            print(f"  - Plate: {d['key'][0]}, Time: {d['key'][1]}")
            print(f"    1st Record: Index {d['first_occurrence']['index']}, Image {d['first_occurrence']['source_image']}")
            print(f"    Dup Record: Index {d['duplicate']['index']}, Image {d['duplicate']['source_image']}")
        return False
    else:
        print("No duplicates found. All records are unique.")
        return True

if __name__ == "__main__":
    violation_file = "/Users/luongnp/ai_source/traffic-violation/violations.json"
    is_unique = check_duplicates(violation_file)
    if not is_unique:
        sys.exit(1)
    sys.exit(0)
