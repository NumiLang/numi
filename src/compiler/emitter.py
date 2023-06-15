class Emitter:
    def __init__(self, file):
        self.file = file
        self.header = ""
        self.code = ""

    def emit(self, content):
        self.code += content

    def emit_line(self, content):
        self.code += f"{content}\n"

    def emit_header(self, content):
        self.header += f"{content}\n" 

    def write_file(self):
        try:
            # creates file if it doesn't exist and opens it in (over)write mode
            f = open(f"{self.file}.c", "w+")
            f.write(f"{self.header}\n{self.code}")
        except:
            print("ERROR: something went wrong during compilation.")

__all__ = [
    "Emitter"
]

if __name__ == "__main__":
    import os
    raise Exception(f"`{os.path.basename(__file__)} can\'t be ran as `{__name__}`")