from os.path import exists

class Content:
    def __init__(self, path):
        self.path = path
        if not isinstance(self.path, str):
            print("ERROR: invalid path type.")
            exit(1)
        if not exists(self.path):
            print("ERROR: no such directory or file.")
            exit(1)
    
    def get_path(self):
        return self.path
    
    def get_content(self):
        try:
            content = open(self.path, "r").read()
        except:
            print("ERROR: something went wrong during file content reading.")
            exit(1)
        return content
    
__all__ = [
    "Content"
]

if __name__ == "__main__":
    import os
    raise Exception(f"`{os.path.basename(__file__)} can\'t be ran as `{__name__}`")
