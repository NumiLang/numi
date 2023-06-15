import sys
from os.path import exists, dirname, join

sys.path.append(join(dirname(__file__), "../../"))
from src.numi import Numi

class Build:
    def __init__(self):
        from configparser import ConfigParser
        
        if not exists("build.ini"):
            print("ERROR: cannot get build info.\n`build.ini` file does not exist.")
            exit(1)
        else:
            config = ConfigParser()
            try:
                config.read("build.ini")
                self.build = config.items("BUILD")
                self.version = self.build[0][1]
                self.state = self.build[1][1]

                self.dev = config.items("DEV")
                self.debug = self.dev[0][1]

                if ((self.build[0][0] != "version") or (self.build[1][0] != "state") or (self.is_valid_version(self.version) != 1) or (self.is_valid_state(self.state) != 1) or (self.debug not in ["yes", "no"])):
                    print("ERROR: invalid build information found in `build.ini` file.")
                    exit(1)
            except:
                print("ERROR: something went wrong while fetching the build version.")
                exit(1)

    # @return Boolean-like values (1 for success, 0 for error)
    def is_valid_version(self, version):
        try:
            float(version)
            return 1
        except ValueError:
            return 0
    
    # @return Boolean-like values (1 for success, 0 for error)
    def is_valid_state(self, state):
        states = ["Stable", "Unstable", "Dev"]
        if state in states:
            return 1
        else:
            return 0
        
    def get_version(self): return self.version
    def get_state(self): return self.state


help = """Usage: numi.py [options] [commands]
Commands:
    new         [name]         Setup the file structure for a new Numi project with the given name.
    c           [file]         Compiles the given file.
    cr          [file]         Compiles and runs the produced executable.
    repl                       Runs the REPL.
    dump-ast    [file]         Prints the Program AST.
Options:
    --h, --help                Displays this usage information.
    --v, --version             Displays the compiler version.

NB: This help message is still a work in progress and some features might be missing!"""

def print_help():
    print(help)

def main():
    args = sys.argv[1:]

    if not args:
        print("ERROR: not enough arguments provided.")
        print_help()
        exit(1)
    # OPTIONS
    elif any(args[0] == help for help in ["--h", "--help"]):
        print_help()
        exit(0)
    elif any(args[0] == help for help in ["--v", "--version"]):
            build = Build()
            version = build.get_version()
            state = build.get_state()
            print(f"Numi {version} {state}")
            exit(0)
    
    # COMMANDS
    elif args[0] == "repl":
        from .repl import repl

        repl()
    elif any(args[0] == k for k in ["new", "cr"]):
        raise NotImplementedError()
    elif args[0] == "c":
        if not args[1]:
            print("ERROR: not enough arguments.")
            exit(1)
        else:
            Numi(args[1]).compile()
            exit(0)
    elif args[0] == "dump-ast":
        if not args[1]:
            print("ERROR: not enough arguments.")
            exit(1)
        else:
            print(Numi(args[1]).get_ast())
            exit(0)
    else:
        print("ERROR: invalid input.")
        print_help()
        exit(1)

if __name__ == "__main__":
    main()