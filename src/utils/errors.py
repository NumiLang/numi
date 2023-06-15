class Error:
    def __init__(self, path, line, col, error_name, message, details = False):
        self.path = path
        self.line = line
        self.col = col
        self.error_name = error_name
        self.message = message
        self.details = details # False if there are no details
        self.exitcode = 1

        print(f"{self.path}:{self.line}:{self.col}: Error <{self.error_name}>:\n{self.message} {'' if not details else details}")
        exit(self.exitcode)


__all__ = [
    "Error"
]

if __name__ == "__main__":
    import os
    raise Exception(f"`{os.path.basename(__file__)} can\'t be ran as `{__name__}`")