#!/bin/bash
# Generate minimal valid PNG icons (16x16, 48x48, 128x128)
# Using Python to create simple solid-color PNGs

python3 -c "
import struct, zlib

def create_png(size, filename):
    # Create a simple green square icon
    width = height = size
    
    # Raw image data (RGBA) - Fiverr green (#1dbf73)
    raw_data = b''
    for y in range(height):
        raw_data += b'\x00'  # filter byte
        for x in range(width):
            # Simple circle approximation
            cx, cy = width//2, height//2
            r = width//2 - 2
            dist = ((x - cx)**2 + (y - cy)**2) ** 0.5
            if dist <= r:
                # Green fill with slight gradient
                shade = max(0, int(255 * (1 - dist/(r+1))))
                raw_data += bytes([0x1d, 0xbf, 0x73, 255])
            else:
                raw_data += bytes([0, 0, 0, 0])
    
    def chunk(chunk_type, data):
        c = chunk_type + data
        crc = struct.pack('>I', zlib.crc32(c) & 0xffffffff)
        return struct.pack('>I', len(data)) + c + crc
    
    signature = b'\x89PNG\r\n\x1a\n'
    ihdr = chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0))
    
    compressed = zlib.compress(raw_data)
    idat = chunk(b'IDAT', compressed)
    iend = chunk(b'IEND', b'')
    
    with open(filename, 'wb') as f:
        f.write(signature + ihdr + idat + iend)

create_png(16, 'icons/icon16.png')
create_png(48, 'icons/icon48.png')
create_png(128, 'icons/icon128.png')
print('Icons created successfully!')
"
