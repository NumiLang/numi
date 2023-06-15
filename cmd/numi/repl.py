def repl():
    while True:

        k = input("> ")
        
        if input == "exit":
            exit(0)

        print(k)

__all__ = [
    "repl"
]

if __name__ == "__main__":
    import os
    raise Exception(f"`{os.path.basename(__file__)} can\'t be ran as `{__name__}`")