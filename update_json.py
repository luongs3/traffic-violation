import json
import os

def format_license_plate(plate):
    """
    Infers the human-readable format of a license plate.
    8 chars: 15A35989 -> 15A-359.89
    9 chars: 29D268472 -> 29D2-684.72
    """
    if len(plate) == 8:
        return f"{plate[:3]}-{plate[3:6]}.{plate[6:]}"
    elif len(plate) == 9:
        return f"{plate[:4]}-{plate[4:7]}.{plate[7:]}"
    return plate  # Fallback

def update_violations(file_path):
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found.")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    for record in data:
        plate = record.get('license_plate', '')
        record['license_plate_raw'] = format_license_plate(plate)

    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"Successfully updated {len(data)} records in {file_path}")

if __name__ == "__main__":
    violation_file = "/Users/luongnp/ai_source/traffic-violation/violations.json"
    update_violations(violation_file)
