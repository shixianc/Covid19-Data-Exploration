"""
This module is to write data into PostgresSQL db
"""
from pyspark.sql.window import Window
from pyspark.sql import SparkSession
from pyspark.sql.functions import lag

# Connection details
PSQL_SERVERNAME = "localhost"
PSQL_PORTNUMBER = 5432
PSQL_DBNAME = "covid-project"
PSQL_USERNAME = "postgres"
PSQL_PASSWORD = "mYsic8669"

# Table details
TABLE_CASES = "covidcase"
TABLE_MOBILITY = "mobility"
TABLE_PERCENT = "percent"

URL = f"jdbc:postgresql://{PSQL_SERVERNAME}/{PSQL_DBNAME}"

if __name__ == "__main__":
    spark = SparkSession.builder\
        .appName("covid-spark")\
        .getOrCreate()

    # df_mobility = spark.read\
    #     .format("jdbc")\
    #     .option("url", URL)\
    #     .option("dbtable", TABLE_MOBILITY)\
    #     .option("user", PSQL_USERNAME)\
    #     .option("password", PSQL_PASSWORD)\
    #     .load()

    # df_mobility.select('retail_recreation_index', 'grocery_and_pharmacy_index', 'parks_index',
    #                    'transit_station_index', 'workplace_index', 'residential_index').show()

    df_cases = spark.read\
        .format("jdbc")\
        .option("url", URL)\
        .option("dbtable", TABLE_CASES)\
        .option("user", PSQL_USERNAME)\
        .option("password", PSQL_PASSWORD)\
        .load()

    win = Window.partitionBy('fips').orderBy('date')

    # Use 'lag' function to grad the previous value.
    df_percent = df_cases.select('id', 'fips', 'date', 'confirmed_case').withColumn('perc_change', (df_cases.confirmed_case -
                                                                                                    lag(df_cases['confirmed_case']).over(win))/100)

    df_percent.write\
        .format("jdbc")\
        .option("url", URL)\
        .option("dbtable", TABLE_PERCENT)\
        .option("user", PSQL_USERNAME)\
        .option("password", PSQL_PASSWORD)\
        .mode("overwrite")\
        .save()
