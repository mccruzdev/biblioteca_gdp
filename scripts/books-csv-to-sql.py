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
    'condition'
])


def read_file():
    file_path = os.path.join(
        os.getcwd(), '..', 'recurses', 'data-db-books.csv')

    with open(file_path, mode='r', encoding='utf-8') as file:
        for row in csv.reader(file):
            yield Register(*row)


def get_sql():
    sql_template = "INSERT INTO BookTemplate (title, author, publisher, pages, code) VALUES\n"
    sql_condition = "INSERT INTO BookConditionRecord (`condition`, isDecommissioned) VALUES\n"

    values_template = []
    values_condition = []

    for register in read_file():
        title = f"'{register.title}'" if register.title else "NULL"
        author = f"'{register.author}'" if register.author else "NULL"
        publisher = f"'{register.publisher}'" if register.publisher else "NULL"
        pages = register.num_pages if register.num_pages else "NULL"
        code = f"'{register.code}'" if register.code else "NULL"

        values_template.append(
            f"({title}, {author}, {publisher}, {pages}, {code})"
        )

        condition = f"'BAD'" if register.condition == 'MALO' else "'GOOD'"
        is_decommissioned = "'NO'"

        values_condition.append(
            f"({condition}, {is_decommissioned})"
        )

    sql_template += ",\n".join(values_template) + ";"
    sql_condition += ",\n".join(values_condition) + ";"

    return sql_template, sql_condition


def main():
    sql_template, sql_condition = get_sql()

    with open('books_template.sql', 'w', encoding='utf-8') as file:
        file.write(sql_template)

    with open('books_condition.sql', 'w', encoding='utf-8') as file:
        file.write(sql_condition)


if __name__ == '__main__':
    main()
