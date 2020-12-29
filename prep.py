"""
Fixes encodings, fractional measurements
"""

import sys


replacements = (
    ("¼", "1/4"),
    ("½", "1/2"),
    ("¾", "3/4"),
)
                    
def prep(src, dst):
    with open(src,  encoding="utf-8") as f:
        contents = f.read()
        
    for search,replace in replacements:
        contents = contents.replace(search,replace)
        
    print("Writing: " + dst)
    with open(dst, "w",  encoding="utf-8") as f:
            f.write(contents)

            
if __name__ == '__main__':
    prep(sys.argv[1], sys.argv[1] + "preped.txt" )