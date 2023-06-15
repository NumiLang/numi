import json
from .utils.file_io import Content
from .parser.lexer import Lexer
from .parser.parser import Parser
from .compiler.compiler import Compiler

class Numi:
    def __init__(self, path):
        self.path: str = path
        
        # Content
        self.content = Content(self.path)
        self.source  = self.content.get_content()

        # Lexer
        self.lexer  = Lexer(self.path, self.source)
        self.tokens = self.lexer.lex()
        
        # Parser
        self.parser = Parser(self.tokens, self.path)
        self.ast    = self.parser.generateAST()
        
        # Compiler
        self.compiler = Compiler(self._file())
    
    def _file(self):
        # handle /
        _ret = ""
        if "/" in self.path:
            _ret = self.path.split("/")[-1]
        elif "\\" in self.path:
        # handle \
            _ret = self.path.split("\\")[-1]

        if "." in _ret:
                _ret = _ret.rsplit(".", 1)[0]

        return _ret

    def get_ast(self):
        return json.dumps(self.ast, indent=4)

    def compile(self):
        self.compiler.compile()
