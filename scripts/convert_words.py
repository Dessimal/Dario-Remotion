import json

with open("whisper_output/dariovoiceover.json", "r", encoding="utf-8") as f:
    data = json.load(f)

words = []
i = 1
for segment in data["segments"]:
    for w in segment.get("words", []):
        words.append({
            "id": f"word_{i}",
            "startMs": round(w["start"] * 1000),
            "endMs": round(w["end"] * 1000),
            "text": w["word"].strip()
        })
        i += 1

with open("src/data/transcript_words.json", "w", encoding="utf-8") as f:
    json.dump({"words": words}, f, indent=2)

print(f"Wrote {len(words)} word-level entries to src/data/transcript_words.json")
