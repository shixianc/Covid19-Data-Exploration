/**
 * Table template used for antd Table components. 
 * Suppports all current query results schema.
 */
const range_day_columns = [
  {
    title: 'State',
    dataIndex: 'state',
  },
  {
    title: 'County',
    dataIndex: 'county',
  },
  {
    title: 'Total Cases',
    dataIndex: 'confirmed_case',
    onFilter: (value, record) => record.confirmed_case >= 0,
    sorter: (a, b) => a.confirmed_case - b.confirmed_case,
    sortDirections: ['descend', 'ascend'],
  }
];

const search_columns = [
  {
    title: 'PMCID',
    dataIndex: 'pmcid',
  },
  {
    title: 'Article Title',
    dataIndex: 'title',
  },
  {
    title: 'Publish Date',
    dataIndex: 'publish_time',
    onFilter: (value, record) => record.publish_time.length >10,
    sorter: (a, b) => a.publish_time.localeCompare(b.publish_time),
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Authors',
    dataIndex: 'authors',
  },
  {
    title: 'URL',
    dataIndex: 'url',
  }
];

const single_day_columns = [
    {
      title: 'FIPS ID',
      dataIndex: 'fips',
    },
    {
      title: 'State',
      dataIndex: 'state',
    },
    {
      title: 'County',
      dataIndex: 'county',
    },
    {
      title: 'Confirmed Cases',
      dataIndex: 'confirmed_case',
    },
    {
      title: 'Confirmed Deaths',
      dataIndex: 'confirmed_death',
    },
    {
      title: 'Percentage Increase',
      dataIndex: 'perc_inc',
    },
    {
      title: 'Death Percentage',
      dataIndex: 'death_perc',
    },
    {
      title: 'Retail and Recreation',
      dataIndex: 'retail_recreation_index',
    },
    {
      title: 'Grocery and Pharmacy',
      dataIndex: 'grocery_and_pharmacy_index',
    },
    {
      title: 'Parks',
      dataIndex: 'parks_index',
    },
    {
      title: 'Transit Station',
      dataIndex: 'transit_station_index',
    },
    {
      title: 'Workplace',
      dataIndex: 'workplace_index',
    },
    {
      title: 'Residental',
      dataIndex: 'residential_index',
    }
  ];

const single_county_columns = [
{
    title: 'Date',
    dataIndex: 'date',
    onFilter: (value, record) => record.date !== undefined,
    sorter: (a, b) => a.date !== undefined ? a.date.localeCompare(b.date) : 0,
    sortDirections: ['descend', 'ascend'],
},
{
    title: 'Confirmed Cases',
    dataIndex: 'confirmed_case',
},
{
    title: 'Confirmed Deaths',
    dataIndex: 'confirmed_death',
},
{
  title: 'Percentage Increase',
  dataIndex: 'perc_inc',
},
{
  title: 'Death Percentage',
  dataIndex: 'death_perc',
},
{
    title: 'Retail and Recreation',
    dataIndex: 'retail_recreation_index',
},
{
    title: 'Grocery and Pharmacy',
    dataIndex: 'grocery_and_pharmacy_index',
},
{
    title: 'Parks',
    dataIndex: 'parks_index',
},
{
    title: 'Transit Station',
    dataIndex: 'transit_station_index',
},
{
    title: 'Workplace',
    dataIndex: 'workplace_index',
},
{
    title: 'Residental',
    dataIndex: 'residential_index',
}
]

export {single_day_columns, single_county_columns, range_day_columns, search_columns}