""" Build index from directory listing

make_index.py </path/to/directory> [--header <header text>]
"""

EXCLUDED = ['index.html']

import os
import argparse
import json


def main():
    recipes = []
    for root, dirs, files in os.walk("Recipes", topdown=True):
        
        print (root, len(files))
        
        for d in list(dirs):
            if d.startswith("."):
                dirs.remove(d)

        if root == ".":
            continue

        if not root == "Recipes\data":
            continue
        #if ".git" in dirs:
        #    dirs.remove(".git")
        #if ".git" in dirs:
        #    dirs.remove(".git")
        
        for name in files:
            path = os.path.join(root[8:], name).replace("\\","/")
            name =  os.path.splitext(name)[0]
            name = convert(name)
            path = convert(path)        
            recipes.append({"name": name,"path":path})        
    with open("Recipes/recipe_data.js", "w",  encoding="utf-8") as f:
        f.write("var recipes = {};".format(json.dumps(recipes, indent=2)))


def convert(str):
    return str
    # assume correct encoding
    #return str.decode("iso-8859-1").encode("utf-8")


if __name__ == '__main__':
    main()