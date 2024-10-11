import csv
import os

from collections import namedtuple

Register = namedtuple('Register', [
                      'items',
                      'showcase',
                      'showcase_color',
                      'showcase_level',
                      'title',
                      'author',
                      'code',
                      'publisher',
                      'num_pages',
                      'condition'])


def read_file():
    file_path = os.path.join(
        os.getcwd(), '..', 'recurses', 'data-db-books.csv')

    with open(file_path, mode='r', encoding='utf-8') as file:
        for row in csv.reader(file):
            yield Register(*row)


def get_sql():
    sql = "INSERT INTO Book (title, author, publisher, pages, code, stock, status, locationId, conditionId, categoryId) VALUES\n"
    values = []

    for register in read_file():
        title = f"'{register.title}'" if register.title else "NULL"
        author = f"'{register.author}'" if register.author else "NULL"
        publisher = f"'{register.publisher}'" if register.publisher else "NULL"
        pages = register.num_pages if register.num_pages else "NULL"
        code = f"'{register.code}'" if register.code else "NULL"
        stock = register.items if register.items else "NULL"

        location_id = "NULL"
        condition_id = "NULL"
        category_id = "NULL"

        values.append(
            f"({title}, {author}, {publisher}, {pages}, {code}, {stock}, 'AVAILABLE', {location_id}, {condition_id}, {category_id})")

    sql += ",\n".join(values) + ";"

    return sql


def main():
    sql = get_sql()

    with open('books.sql', 'w', encoding='utf-8') as file:
        file.write(sql)


if __name__ == '__main__':
    main()
