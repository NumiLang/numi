from .emitter import Emitter

class Compiler:
    def __init__(self, file, ast):
        self.emitter = Emitter(file)
        self.ast = ast

    def compile(self):
        self.emitter.emit_header("#include <stdio.h>")
        self.emitter.emit_line("int main(int argc, char** argv) {")
        self.emitter.emit_line("    return 0;")
        self.emitter.emit_line("}")

        self.emitter.write_file()

__all__ = [
    "Compiler"
]

if __name__ == "__main__":
    import os
    raise Exception(f"`{os.path.basename(__file__)} can\'t be ran as `{__name__}`")