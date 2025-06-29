#!/usr/bin/env python3
import sys
import json
from shazamio import Shazam
import asyncio
import os

async def main():
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Audio fayl yo'li kerak"}))
        sys.exit(1)
    
    audio_path = sys.argv[1]
    
    if not os.path.exists(audio_path):
        print(json.dumps({"error": "Audio fayl topilmadi"}))
        sys.exit(1)
    
    try:
        shazam = Shazam()
        result = await shazam.recognize_song(audio_path)
        
        if 'track' in result and result['track']:
            track = result['track']
            output = {
                "title": track.get('title', 'Noma\'lum'),
                "artist": track.get('subtitle', 'Noma\'lum ijrochi')
            }
            print(json.dumps(output, ensure_ascii=False))
        else:
            print(json.dumps({"error": "Qo'shiq tanilmadi"}))
    
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    asyncio.run(main())