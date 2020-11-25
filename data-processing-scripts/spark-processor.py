"""
This module is to write data into PostgresSQL db
"""
from pyspark.sql import SparkSession
import pyspark.sql.functions as func

# Connection details
PSQL_SERVERNAME = "localhost"
PSQL_PORTNUMBER = 5432
PSQL_DBNAME = "covid-project"
PSQL_USERNAME = "postgres"
PSQL_PASSWORD = "mYsic8669"

# Table details
TABLE_CASES = "covidcase"
TABLE_MOBILITY = "mobility"
TABLE_NEW = "percentdeath"

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

    df_percent = df_cases.select('id', 'confirmed_case', 'confirmed_death').withColumn(
        "death_perc", (func.col('confirmed_death') / func.col('confirmed_case'))).orderBy('death_perc', ascending=False)

    df_percent.write\
        .format("jdbc")\
        .option("url", URL)\
        .option("dbtable", TABLE_NEW)\
        .option("user", PSQL_USERNAME)\
        .option("password", PSQL_PASSWORD)\
        .mode("overwrite")\
        .save()
