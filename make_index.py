""" Build index from directory listing

make_index.py </path/to/directory> [--header <header text>]
"""

INDEX_TEMPLATE = r"""
<html>
<body>
<h2>${header}</h2>
<p>
% for name in names:
    <li><a href="${name}">${name}</a></li>
% endfor
</p>
</body>
</html>
"""

INDEX_TEMPLATE = r"""
<html>
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.2/css/bootstrap.min.css"
          integrity="sha384-Smlep5jCw/wG7hdkwQ/Z5nLIefveQRIY9nfy6xoR1uRYBtpZgI6339F5dgvm/e9B" crossorigin="anonymous">

    <title>Filters</title>

    <!-- Used to hide html that functions as template on startup -->
    <style>
        [v-cloak] {{
            display: none;
        }}
    </style>

    <!-- Custom styles for this template -->
    <link href="search.css" rel="stylesheet">
</head>
<body>


<main role="main" class="container">
<h2>{0}</h2>
<ul>
{1}
</ul>
</main>
<!-- jQuery first, then Popper.js, then Bootstrap JS -->
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
        integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
        crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"
        integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49"
        crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.2/js/bootstrap.min.js"
        integrity="sha384-o+RDsa0aLu++PJvFqy8fFScvbHFLtbvScb8AjopnFD+iEQ7wo/CG0xlczd+2O/em"
        crossorigin="anonymous"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.0.3/vue.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lodash@4.13.1/lodash.min.js"></script>
</body>
</html>
"""

EXCLUDED = ['index.html']

import os
import argparse
import json

# May need to do "pip install mako"
#from mako.template import Template

def main():
    recipes = []
    for root, dirs, files in os.walk(".", topdown=True):
        for d in list(dirs):
            if d.startswith("."):
                dirs.remove(d)

        if root == ".":
            continue

        if not root == ".\Recipes":
            continue
        #if ".git" in dirs:
        #    dirs.remove(".git")
        #if ".git" in dirs:
        #    dirs.remove(".git")
        li = []
        for name in files:
            path = os.path.join(root[2:], name).replace("\\","/")
            name =  os.path.splitext(name)[0]
            name = convert(name)
            path = convert(path)
            li.append('    <li><a href="{}">{}</a></li>'.format(path, name))
            recipes.append({"name": name,"path":path})
        print (INDEX_TEMPLATE.format("Recipes", "\n".join(li)))

    with open("recipe_data.js", "w",  encoding="utf-8") as f:
        f.write("var recipes = {};".format(json.dumps(recipes, indent=2)))


def convert(str):
    return str;
    # assume correct encoding
    #return str.decode("iso-8859-1").encode("utf-8")


def mainz():
    parser = argparse.ArgumentParser()
    parser.add_argument("directory")
    parser.add_argument("--header")
    args = parser.parse_args()
    fnames = [fname for fname in sorted(os.listdir(args.directory))
              if fname not in EXCLUDED]
    print (fnames)
    header = (args.header if args.header else os.path.basename(args.directory))
    Template(INDEX_TEMPLATE, default_filters=['decode.utf8']).render(names=fnames, header=header)


if __name__ == '__main__':
    main()