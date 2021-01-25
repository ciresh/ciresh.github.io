import os
import codecs


def scan():
    for root, dirs, files in os.walk("Recipes", topdown=True):
        for d in list(dirs):
            if d.startswith("."):
                dirs.remove(d)
        for filename in files:
            # print filename

            with open(os.path.join(root, filename), "r") as f:
                contents = f.read()

            # if chr(0xbd) in contents: print "Found it!"

            try:
                contents.decode("utf-8")
            except UnicodeDecodeError as e:
                print "Error in:" + filename

                fixed = contents.decode("cp1252").encode("utf-8")

                #with codecs.open(os.path.join(root, "..", "fixed", filename), "w", "utf-8") as f:
                #    f.write(fixed)

                with open(os.path.join(root, "..", "fixed",filename), "w") as f:
                    f.write(fixed)

                path = os.path.join(root, "..", "org", filename)
                print path
                with open(path, "w") as f:
                    f.write(contents)


def testfile():
    filename = "D:\dev\ciresh.github.io\Recipes\Perfect Oatmeal.txt"
    contents = ""
    with open(filename, "r") as f:
        contents = f.read()

    print contents

    if chr(0xbd) in contents: print "Found it!"
    contents.decode("utf-8")


scan()
