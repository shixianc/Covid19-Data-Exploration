import csv
import psycopg2


def main():

    # Establish DB connection
    conn = psycopg2.connect(
        host="127.0.0.1",
        database="covid-project",
        user="postgres",
        password="mYsic8669")

    cur = conn.cursor()

    # Mobility Table creation sql template
    research_table_creation_command = """CREATE TABLE research (
        id SERIAL PRIMARY KEY, 
        pmcid VARCHAR(max),
        title VARCHAR(max),
        publish_time VARCHAR,
        authors VARCHAR(max),
        url VARCHAR(max)
    )"""

    # cur.execute(research_table_creation_command)

    # Mobility table insertion sql template
    research_table_insertion_command = """
    INSERT INTO research(pmcid,title,publish_time,authors,url) VALUES(%s, %s, %s, %s, %s)
    """
    # Open research csv data file
    with open('./metadata.csv', 'r') as cors_csv:
        csv_reader = csv.reader(cors_csv, delimiter=',')
        for row in csv_reader:
            if (row[0] != "cord_uid"):
                cur.execute(research_table_insertion_command,
                            (row[5], row[3], row[9], row[10], row[17]))

    # Close the cursor and commit the transaction
    cur.close()
    conn.commit()

    # Close the connection
    conn.close()


def countyNameFormater(input):
    return input + " County"


def numFormater(string):
    return None if len(string) == 0 else string


if __name__ == '__main__':
    main()
