/**
 * Main App with nav bar and the content.
 */
import './App.css';
import "./styles.css";
import 'antd/dist/antd.css';
import React, { useState } from "react";
import MapChart from "./MapChart";
import ReactTooltip from "react-tooltip";
import {single_day_columns, single_county_columns, range_day_columns, search_columns} from "./table-columns/columns"

import { Layout, Menu, DatePicker, Space, Button, Table, Input, Radio, notification, Statistic, Card, Row, Col} from 'antd';
import { SearchOutlined, SmileOutlined, ArrowUpOutlined } from '@ant-design/icons';

import {
  BarChartOutlined,
  CloudOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const { RangePicker } = DatePicker;
const { Search } = Input;

function App() {
  const [content, setContent] = useState("");// Map tooltip content
  const [date, setDate] = useState("2020-01-21");// single date
  const [startDate, setStartDate] = useState("2020-01-21");// range date
  const [endDate, setEndDate] = useState("2020-01-21");
  const [tableData, setTableData] = useState([]);// table data
  const [tableColumn, setTableColumn] = useState(single_day_columns);// column schema for table
  const [page, setPage] = useState(1);// nav bar status
  const [searchData, setSearchData] = useState("");// search box input
  const [searchOption, setSearchOption] = useState("title");// by author or by title
  const [showCard, setShowCard] = useState(false);// Boolean for if should diaplay Statistical Card.
  const [cardData, setCardData] = useState([0, 0]);// statistical card content. array of two values.

  // Date range for single date picker
  const disabledDate = (current) => {
    return current.format("YYYY-MM-DD") < '2020-02-15' || current.format("YYYY-MM-DD") > '2020-10-09'
  }

  // Search result notification.
  const openNotification = (size) => {
    const args = {
      message: 'Database Search Finished.',
      description:
        `${size} records found!`,
      duration: 4.5,
      icon: <SmileOutlined style={{ color: '#108ee9' }} />,
    };
    notification.open(args);
  };

  // Handle single date change.
  const onSingleDateChange = (moment) => {
    if (moment !== null && moment !== undefined) {
      setDate(moment.format("YYYY-MM-DD"));
    }
  }

  // Handle range date change.
  const onRangeDateChange = (momentArray) => {
    if (momentArray !== null && momentArray !== undefined && momentArray.length === 2) {
      setStartDate(momentArray[0].format("YYYY-MM-DD"));
      setEndDate(momentArray[1].format("YYYY-MM-DD"));
    }
  }

  // Single date submit 
  const handleSingleDateSubmit = async () => {
    setTableColumn(single_day_columns);
    const response = await fetch(`http://localhost:5000/cases/${date}`);
    const jsonData = await response.json();
    setTableData(jsonData);
    setShowCard(true);
    let percInc = 0;
    let percDea = 0;
    let len = jsonData.length;
    for (let i = 0; i < len; i++) {
      percInc += parseFloat(jsonData[i].perc_inc);
      percDea += parseFloat(jsonData[i].death_perc);
    }
    setCardData([percInc/len, percDea/len]);
  }

  // Range date submit
  const handleRangeDateSubmit = async () => {
    setShowCard(false);
    setTableColumn(range_day_columns);
    const response = await fetch(`http://localhost:5000/totalcases/${startDate}&${endDate}`);
    const jsonData = await response.json();
    setTableData(jsonData);
  }

  // Handle map click 
  const handleMapClick = async(fips) => {
    setShowCard(false);
    setTableColumn(single_county_columns);
    const response = await fetch(`http://localhost:5000/county/${fips}`);
    const jsonData = await response.json();
    setTableData(jsonData);
  }

  // Handle search submit
  const handleSearch = async(value, event) => {
    setTableColumn(single_county_columns);
    const option = searchOption === 'title' ? 'research' : 'author';
    const response = await fetch(`http://localhost:5000/${option}/${value}`);
    const jsonData = await response.json();
    setSearchData(jsonData);
    return jsonData.length;
  }

  // handle nav bar click
  const handleNavToMap = () => {
    setShowCard(false);
    setPage(1);
  }

  // Handle search nav bar click
  const handleNavToSearch = () => {
    setShowCard(false);
    setPage(2);
  }

  // Handle map nav bar click
  const handleSearchOptionChange = (e) => {
    setSearchOption(e.target.value);
  }

  // Card object for statiscal display
  let card = showCard ? (<div className="site-statistic-demo-card" style={{maxWidth: '70vh', marginBottom: '5vh', marginLeft: '50vh'}}>
      <Row gutter={16}>
        <Col span={12}>
          <Card>
            <Statistic
              title="Average Cases Increase Percentage"
              value={cardData[0]}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="Average Death Percentage"
              value={cardData[1]}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>
    </div>) : <div></div>

  // MainPage content
  let mainPage = <div></div>

  mainPage = page === 1 ? 
      (<Layout className="site-layout" style={{ marginLeft: 200 }}>
        <Header className="site-layout-background" style={{ padding: 0, textAlign:'center'}} >
          <h1 style={{fontWeight:'bold', fontSize:24}}>Map Visualizer</h1>
        </Header>
        <Space direction="horizontal" style={{ margin: 50}}>
          <text>Search by single date:</text>
          <DatePicker onChange={onSingleDateChange} disabledDate={disabledDate}/>
          <Button type="primary" icon={<SearchOutlined />} onClick={() => handleSingleDateSubmit()}>
            Search
          </Button>
        </Space>
        <Space direction="horizontal" style={{ marginLeft: 50}}>
          <text>Search by range:</text>
          <RangePicker onChange={onRangeDateChange} />
          <Button type="primary" icon={<SearchOutlined />} onClick={() => handleRangeDateSubmit()}>
            Search
          </Button>
        </Space>
        
        <Content style={{ margin: 0, overflow: 'initial' }}>
          <div>
            <MapChart setTooltipContent={setContent} data={tableData} handleMapClick={handleMapClick}/>
            <ReactTooltip>{content}</ReactTooltip>
          </div>
          {card}
          <Table columns={tableColumn} dataSource={tableData} rowKey={record=>record.id} />
        </Content>
        <Footer style={{ textAlign: 'center' }}>Covid-19 US Data Exploration ©2020 Created by Shixian Cui</Footer>
      </Layout>) :
      (<Layout className="site-layout" style={{ marginLeft: 200 }}>
        <Header className="site-layout-background" style={{ padding: 0, textAlign:'center'}} >
          <h1 style={{fontWeight:'bold', fontSize:24}}>Scholar Article Search Engine</h1>
        </Header>
        <Radio.Group value={searchOption} onChange={handleSearchOptionChange} style={{margin: '20vh 20vh 0vh 50vh'}}>
          <Radio.Button value="title">Search by Title</Radio.Button>
          <Radio.Button value="author">Search by Author</Radio.Button>
        </Radio.Group>
        <Search placeholder="input search text to find covid-related articles" 
          enterButton="Search" 
          size="large" 
          loading={false} 
          style={{margin: '1vh 20vh 20vh 50vh', maxWidth:'80vh'}}
          onSearch={(value, event) => handleSearch(value, event).then((jsonData) => openNotification(jsonData))}
        />
        <Table columns={search_columns} dataSource={searchData} rowKey={record=>record.id} />
        <Footer style={{ textAlign: 'center' }}>Covid-19 US Data Exploration ©2020 Created by Shixian Cui</Footer>
      </Layout>);

  return (
    <Layout>
    <Sider
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
      }}
    >
      <div className="logo" />
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['2']}>
        <Menu.Item key="9999" style={{fontWeight: 'bold', fontSize: 16, color: '#21aeff'}}>
          Covid-19 Project
        </Menu.Item>
        <Menu.Item key="1" icon={<UserOutlined />} style={{marginTop: '30vh', fontWeight: 'bold', fontSize: 15}}>
          Home
        </Menu.Item>
        <Menu.Item key="2" icon={<BarChartOutlined />} style={{fontWeight: 'bold', fontSize: 15}} onClick={() => handleNavToMap()}>
          Map Visualizer
        </Menu.Item>
        <Menu.Item key="3" icon={<CloudOutlined />} style={{fontWeight: 'bold', fontSize: 15}} onClick={() => handleNavToSearch()}>
          Search Engine
        </Menu.Item>
      </Menu>
    </Sider>
    {mainPage}
    </Layout>
  );
}

export default App;
