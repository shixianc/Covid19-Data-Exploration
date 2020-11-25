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
    case_table_creation_command = """CREATE TABLE covidcase (
        id SERIAL PRIMARY KEY, 
        fips NUMERIC,
        date DATE NOT NULL,
        state VARCHAR(50) NOT NULL,
        county VARCHAR(50) NOT NULL,
        confirmed_case NUMERIC,
        confirmed_death NUMERIC
    )"""

    cur.execute(case_table_creation_command)

    # Mobility table insertion sql template
    case_table_insertion_command = """
    INSERT INTO covidcase(fips, date,state,county,confirmed_case,confirmed_death) VALUES(%s, %s, %s, %s, %s, %s)
    """
    # Open mobility csv data file
    with open('./us-counties.csv', 'r') as case_csv:
        csv_reader = csv.reader(case_csv, delimiter=',')
        for row in csv_reader:
            if (row[0] != "date"):
                cur.execute(case_table_insertion_command,
                            (numFormater(row[3]), row[0], row[2], countyNameFormater(row[1]), row[4], row[5]))

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
