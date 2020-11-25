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
    mobility_table_creation_command = """CREATE TABLE mobility (
        id SERIAL PRIMARY KEY, 
        fips NUMERIC,
        date DATE NOT NULL,
        state VARCHAR(50) NOT NULL,
        county VARCHAR(50) NOT NULL,
        retail_recreation_index NUMERIC,
        grocery_and_pharmacy_index NUMERIC,
        parks_index NUMERIC,
        transit_station_index NUMERIC,
        workplace_index NUMERIC,
        residential_index NUMERIC
    )"""

    # Mobility table insertion sql template
    mobility_table_insertion_command = """
    INSERT INTO mobility(date,fips, state,county,retail_recreation_index,grocery_and_pharmacy_index,parks_index,transit_station_index,workplace_index,residential_index) VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    # Open mobility csv data file
    with open('./Global_Mobility_Report.csv', 'r') as mobility_csv:
        csv_reader = csv.reader(mobility_csv, delimiter=',')
        for row in csv_reader:
            # Filtering records only for united states
            # Filtering records that have counties
            if (row[1] == 'United States' and len(row[3]) > 0):
                cur.execute(mobility_table_insertion_command, (
                    row[7], row[6], row[2], row[3], numFormater(row[8]), numFormater(row[9]), numFormater(row[10]), numFormater(row[11]), numFormater(row[12]), numFormater(row[13]),))

    # Close the cursor and commit the transaction
    cur.close()
    conn.commit()

    # Close the connection
    conn.close()


def numFormater(string):
    return None if len(string) == 0 else string


if __name__ == '__main__':
    main()
