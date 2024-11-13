import csv
import os

from collections import namedtuple

Register = namedtuple('Register', [
    'items',
    'shelf',
    'shelf_color',
    'shelf_level',
    'title',
    'author',
    'code',
    'publisher',
    'num_pages',
    'condition'
])


class Location:
    def __init__(self, shelf, shelf_color, shelf_level):
        self.shelf = shelf
        self.shelf_color = shelf_color
        self.shelf_level = shelf_level

    def __eq__(self, other):
        if isinstance(other, Location):
            return (self.shelf == other.shelf and
                    self.shelf_color == other.shelf_color and
                    self.shelf_level == other.shelf_level)
        return False

    def __hash__(self):
        return hash((self.shelf, self.shelf_color, self.shelf_level))


class Author:
    def __init__(self, name):
        self.name = name

    def __eq__(self, other):
        return isinstance(other, Author) and self.name == other.name

    def __hash__(self):
        return hash(self.name)


class Publisher:
    def __init__(self, name):
        self.name = name

    def __eq__(self, other):
        return isinstance(other, Publisher) and self.name == other.name

    def __hash__(self):
        return hash(self.name)


class Book:
    def __init__(self, title, pages):
        self.title = title
        self.pages = pages

    def __eq__(self, other):
        return (isinstance(other, Book) and
                self.title == other.title and
                self.pages == other.pages)

    def __hash__(self):
        return hash((self.title, self.pages))


class Copy:
    def __init__(self, code, condition):
        self.code: str = code
        self.condition = condition

    def __eq__(self, other):
        return (isinstance(other, Copy) and
                self.code == other.code and
                self.condition == other.condition)

    def __hash__(self):
        return hash((self.code, self.condition))


def read_file():
    path = os.path.join(os.getcwd(), '..', 'recurses', 'data-db-books.csv')

    file = open(path, 'r', encoding='utf-8')
    csv_reader = csv.reader(file)

    registers: list[Register] = []
    locations: list[Location] = []
    authors: list[Author] = []
    publishers: list[Publisher] = []
    books: list[Book] = []
    copies: list[Copy] = []

    for row in csv_reader:
        reg = Register(*row)
        registers.append(reg)

        new_location = Location(reg.shelf, reg.shelf_color, reg.shelf_level)
        if new_location not in locations:
            locations.append(new_location)

        new_author = Author(reg.author)
        if new_author not in authors:
            authors.append(new_author)

        new_publisher = Publisher(reg.publisher)
        if new_publisher not in publishers:
            publishers.append(new_publisher)

        new_book = Book(reg.title, reg.num_pages if reg.num_pages else 'NULL')
        if new_book not in books:
            books.append(new_book)

        new_copy = Copy(reg.code,
                        reg.condition if reg.condition in (
                            'NEW', 'GOOD', 'FAIR', 'DAMAGED', 'BAD') else 'GOOD')
        if new_copy not in copies:
            copies.append(new_copy)

    file.close()

    return {
        'registers': registers,
        'locations': locations,
        'authors': authors,
        'publishers': publishers,
        'books': books,
        'copies': copies,
    }


def write_file(filename, content):
    with open(filename, 'w', encoding='utf-8') as file:
        file.write(content)


def generate_sql_location(locations: list[Location]):
    sql = "INSERT INTO Location (shelf, shelfColor, shelfLevel) VALUES \n"

    for location in locations:
        sql += f"('{location.shelf}', '{location.shelf_color}', '{location.shelf_level}')"
        if location != locations[-1]:
            sql += ',\n'
    sql += ';'

    return sql


def generate_sql_author(authors: list[Author]):
    sql = "INSERT INTO Author (name) VALUES \n"

    for author in authors:
        sql += f"('{author.name}')"
        if author != authors[-1]:
            sql += ',\n'
    sql += ';'

    return sql


def generate_sql_publisher(publishers: list[Publisher]):
    sql = "INSERT INTO Publisher (name) VALUES \n"

    for publisher in publishers:
        sql += f"('{publisher.name}')"
        if publisher != publishers[-1]:
            sql += ',\n'
    sql += ';'

    return sql


def generate_sql_book(file):
    sql = "INSERT INTO Book (title, pages) VALUES \n"

    registers: list[Register] = file['registers']
    books: list[Book] = file['books']
    authors: list[Author] = file['authors']

    for book in books:
        sql += f"('{book.title}', {book.pages})"
        if book != books[-1]:
            sql += ',\n'
    sql += ';\n\n'
    sql += "INSERT INTO _authortobook (A, B) VALUES \n"

    indexs = []

    for i, book in enumerate(books):
        for j, author in enumerate(authors):
            for register in registers:
                if register.author == author.name and \
                        register.title == book.title and \
                        (j+1, i+1) not in indexs:
                    indexs.append((j+1, i+1))
                    sql += f"({j + 1}, {i + 1}),\n"
    sql = sql[:-2] + ';'

    return sql


def generate_sql_copy(copies: list[Copy]):
    sql = "INSERT INTO Copy (code, `condition`) VALUES \n"

    codes = []

    for copy in copies:
        if copy.code.strip() in codes:
            continue
        sql += f"('{copy.code.strip()}', '{copy.condition}')"
        codes.append(copy.code)
        if copy != copies[-1]:
            sql += ',\n'
    sql += ';'

    return sql


def main():
    file = read_file()
    content = ""

    content += generate_sql_location(file['locations']) + "\n\n"
    content += generate_sql_author(file['authors']) + "\n\n"
    content += generate_sql_publisher(file['publishers']) + "\n\n"
    content += generate_sql_book(file) + "\n\n"
    content += generate_sql_copy(file['copies']) + "\n"

    write_file('script.sql', content)


# for book in file['books']:
#     print(book.title, book.pages)

# for copy in file['copies']:
#     print(copy.code, copy.condition)
if __name__ == "__main__":
    main()
