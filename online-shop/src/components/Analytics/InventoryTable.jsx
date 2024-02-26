import { useEffect, useState, useContext } from "react";
import { useInView } from 'react-intersection-observer';
import dataManipulation from "./dataManipulation/dataManipulation";
import businessLogic from "./businessLogic/businessLogic";
import AppContext from "../../AppContext";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import StockInsButton from "./StockInsButton";
import RecentOrdersButton from "./RecentOrdersButton";
import Graph from "./Graph";
import useWindowDimensions from "./utils/UseWindowDimensions";
import { SimpleMovingAverage } from "./SimpleMovingAverage";
import { Clicks } from "./Clicks";
import { RateOfChange } from "./RateOfChange";
import Favorites from "./Favorites";

import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export function InventoryTable({name, category, customized, callback}) {
  const [productsData, setProductsData] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [dataUsedForTable, setDataUsedForTable] = useState([]);
  const { firestore,allUserData } = useContext(AppContext);
  const datamanipulation = new dataManipulation();

  const { ref: p1, inView: p1inView } = useInView();
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [moreInfo, setMoreInfo] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [customize, setCustomize] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [productNames, setproductNames] = useState(null);
  const { width } = useWindowDimensions();
  const [favorites, setFavorites] = useState([]);
  const [trendingItems, setTrendingItems] = useState({});
  
  useEffect(() => {
      const favoriteItems = datamanipulation.readUsersFavoriteItems(allUserData);
  
      setFavorites(favoriteItems);
  }, [refreshData]);

  useEffect(()=>{
    const trending = [];
    const itemname = favorites.filter((item, index) => favorites.indexOf(item) === index);
    
    const itemCount = []
    favorites.forEach((item) => {
      if (item.endsWith("-RET")) {
        itemCount.push(item.slice(0, -4))
      }
      else {
        itemCount.push(item)
      }
    })
    
    const count = itemCount.reduce((count, item) => {count[item] = (count[item] || 0) + 1; return count;}, {});

    Object.keys(count).forEach((key,value) => {
      trending.push({
        itemname: key,
        score: value
      })
    })

    setTrendingItems(trending)
  },[favorites])
  
  useEffect(() => {
    firestore.readAllDataFromCollection("Products").then((data) => {
      const filteredData = datamanipulation.appRemovePacksFromProducts(data);
      setProductsData(filteredData);
    });
  }, [refreshData]);

  useEffect(() => {
    const tableData = [];
    productsData.map((product, index) => {
      const productName = product.itemName;
      const totalStocks = product.stocksAvailable
      const stocksOnHold = product.stocksOnHold;
      let stocksOnHoldCount = 0
      stocksOnHold.forEach((stock) => {
        stocksOnHoldCount += stock.quantity
      })
      const type = product.category;
      const custom = product.isCustomized;
      const itemId = product.itemId;

      tableData.push({
        tableData: {
          id: index,
          name: productName,
          category: type,
          totalStocks: totalStocks,
          stocksOnHold: stocksOnHoldCount,
          isCustomized: custom,
          itemId: itemId,
        },
        moreInfoData: product,
      });
    });
    setDataUsedForTable(tableData);
  }, [productsData]);

  useEffect(() => {
    const dataTable = [];
    const moreData = [];
    dataUsedForTable.map((row, index) => {
      const data = row.tableData;
      const more = row.moreInfoData;
      dataTable.push(data);
      moreData.push(more);
    });
    setTableData(dataTable);
    setMoreInfo(moreData);
  }, [dataUsedForTable]);

  useEffect(() => {
    setSelectedOption(category);
    setCustomize(customized);
    setSelectedName(name)
  }, [name, category, customized]);

  callback(productNames)
  
  useEffect(()=>{
    const data = [];
    tableData.map((s, index)=>{
      const n = s.name;


      data.push(n)
    })
      setproductNames(data)
  },[tableData])
  
  const filteredData = datamanipulation.filterData(
    selectedOption,
    customize,
    tableData
  );

  const filteredTableData = 
    customize === "true" && selectedOption
      ? filteredData.filter(
          (data) => data.isCustomized && data.category === selectedOption
        )
      : selectedName ? filteredData.filter(
        (data)=> data.name === selectedName)
      : (filteredData);    

  const filtered =
      name ? tableData.filter((data)=>  data.name.toLowerCase().includes(name.toLowerCase()))
      :(filteredTableData);

  

  function responsiveFont() {
    if (width < 640) {
      return "13px";
    } else if (width < 768) {
      return "13px";
    } else if (width < 1024) {
      return "17px";
    } else if (width < 1536) {
      return "22px";
    }
    else {
      return "30px";
    }
  }

  function responsiveTableWidthItemName() {
    if (width < 640) {
      return 200;
    } else if (width < 768) {
      return 250;
    } else if (width < 1024) {
      return 300;
    } else if (width < 1280) {
      return 350;
    } else if (width < 1536) {
      return 400;
    }
    else {
      return 450;
    }
  }
  
  function responsiveTableWidth() {
    if (width < 640) {
      return 70;
    } else if (width < 768) {
      return 90;
    } else if (width < 1024) {
      return 110;
    } else if (width < 1280) {
      return 130;
    } else if (width < 1536) {
      return 170;
    }
    else {
      return 240;
    }
  }

  function responsiveTableWidthSales() {
    if (width < 640) {
      return 350;
    } else if (width < 768) {
      return 400;
    } else if (width < 1024) {
      return 450;
    } else if (width < 1280) {
      return 500;
    } else if (width < 1536) {
      return 550;
    }
    else {
      return 600;
    }
  }

  const columns = [
    /* Item Name */
    {
      field: "name",
      headerName: (
        <div
          style={{
            fontFamily: "Lucida Sans Unicode, sans-seriff",
            padding: "10px",
            letterSpacing: "2px",
            fontSize: responsiveFont(),
            fontWeight: "semibold",
          }}
        >
          ITEM NAME
        </div>
      ),
      width: responsiveTableWidthItemName(),
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
      editable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (filteredTableData) => (
        <div
          style={{
            color: "#790252",
            width: "100%",
            align: "center",
            textAlign: "center",
            fontSize: responsiveFont(),
            fontWeight: "600",
          }}
        >
          {filteredTableData.value}
        </div>
      ),
    },
    /* Category */
    {
      field: "category",
      headerName: (
        <div
          style={{
            fontFamily: "Lucida Sans Unicode, sans-seriff",
            padding: "10px",
            letterSpacing: "2px",
            fontSize: responsiveFont(),
            fontWeight: "semibold",
          }}
        >
          CATEGORY
        </div>
      ),
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
      editable: false,
      sortable: false,
      width: responsiveTableWidthItemName(),
      disableColumnMenu: true,
      renderCell: (filteredTableData) => (
        <div
          style={{
            color:
              filteredTableData.row.category === "Paper Bag"
                ? "#EA047E"
                : filteredTableData.row.category === "Meal Box"
                ? "#898121 "
                : filteredTableData.row.category === "Food Wrappers"
                ? "#F2921D "
                : filteredTableData.row.category === "Bowls"
                ? "#0E8388 "
                : filteredTableData.row.category === "Plastic Containers"
                ? "#0081B4 "
                : filteredTableData.row.category === "Plates"
                ? "#FF6D28"
                : filteredTableData.row.category === "Roll Bag"
                ? "#BFDB38"
                : filteredTableData.row.category === "Sando Bag"
                ? "#FC7300"
                : filteredTableData.row.category === "Sauce Cups"
                ? "#5D3891"
                : filteredTableData.row.category === "Tissue Paper"
                ? "#66BFBF"
                : filteredTableData.row.category === "Trash Bag"
                ? "#F5C6AA"
                : filteredTableData.row.category === "Utensils"
                ? "#C58940"
                : "red",
            width: "100%",
            align: "center",
            textAlign: "center",
            fontSize: responsiveFont(),
            fontWeight: "500",
          }}
        >
          {filteredTableData.value}
        </div>
      ),
    },
    /* Total Stocks */
    {
      field: "totalStocks",
      headerName: (
        <div
          style={{
            fontFamily: "Lucida Sans Unicode, sans-seriff",
            padding: "10px",
            letterSpacing: "2px",
            fontSize: responsiveFont(),
            fontWeight: "semibold",
          }}
        >
          STOCKS
        </div>
      ),
      width: responsiveTableWidth(),
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
      editable: false,
      disableColumnMenu: true,
      renderCell: (filteredTableData) => (
        <div
          style={{
            color:
              filteredTableData.value < 20
                ? "red"
                : filteredTableData.value < 50
                ? "#E6B325"
                : "#3EC70B",
            width: "100%",
            align: "center",
            textAlign: "center",
            fontSize: responsiveFont(),
            fontWeight: "600",
          }}
        >
          {filteredTableData.value}
        </div>
      ),
    },
    {
      field: "stocksOnHold",
      headerName: (
        <div
          style={{
            fontFamily: "Lucida Sans Unicode, sans-seriff",
            padding: "10px",
            letterSpacing: "2px",
            fontSize: responsiveFont(),
            fontWeight: "semibold",
          }}
        >
          On Hold
        </div>
      ),
      width: responsiveTableWidth(),
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
      editable: false,
      disableColumnMenu: true,
      renderCell: (filteredTableData) => (
        <div
          style={{
            color:
              filteredTableData.value < 20
                ? "red"
                : filteredTableData.value < 50
                ? "#E6B325"
                : "#3EC70B",
            width: "100%",
            align: "center",
            textAlign: "center",
            fontSize: responsiveFont(),
            fontWeight: "600",
          }}
        >
          {filteredTableData.value}
        </div>
      ),
    },
    /* Graph for StocksPerMonth and SalesPerMonth */
    {
      field: "graph",
      headerName: (
        <div
          style={{
            fontFamily: "Lucida Sans Unicode, sans-seriff",
            padding: "10px",
            letterSpacing: "2px",
            fontSize: responsiveFont(),
            fontWeight: "semibold",
          }}
        >
          SALES
        </div>
      ),
      headerClassName: "super-app-theme--header",
      width: responsiveTableWidthSales(),
      headerAlign: "center",
      align: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (filteredTableData) => (
        <Graph
          name={filteredTableData.row.name}
          data={
            dataUsedForTable.find(
              (a) => a.tableData.id === filteredTableData.row.id
            )?.moreInfoData ?? []
          }
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        />
      ),
    },
    /* Item Name */
    {
      field: "name1",
      headerName: (
        <div
          style={{
            fontFamily: "Lucida Sans Unicode, sans-seriff",
            padding: "10px",
            letterSpacing: "2px",
            fontSize: responsiveFont(),
            fontWeight: "semibold",
          }}
        >
          ITEM NAME
        </div>
      ),
      width: responsiveTableWidthItemName(),
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
      editable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (filteredTableData) => (
        <div
          style={{
            color: "#790252",
            width: "100%",
            align: "center",
            textAlign: "center",
            fontSize: responsiveFont(),
            fontWeight: "600",
          }}
        >
          {filteredTableData.row.name}
        </div>
      ),
    },
    /* SalesAverage1 */
    {
      field: "SalesAverage1",
      headerName: (
        <div
          style={{
            fontFamily: "Lucida Sans Unicode, sans-seriff",
            padding: "10px",
            fontSize: responsiveFont(),
            fontWeight: "semibold",
          }}
        >
        (1)SMA 
        </div>
      ),
      width: responsiveTableWidth(),
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (filteredTableData) => (
        <div
          style={{
            color: "#480032",
            width: "100%",
            align: "center",
            textAlign: "center",
            fontSize: responsiveFont(),
            fontWeight: "500",
          }}
        >
          <SimpleMovingAverage
            number={1}
            data={
              dataUsedForTable.find(
                (a) => a.tableData.id === filteredTableData.row.id
              )?.moreInfoData ?? []
            }
          />
        </div>
      ),
    },
    /* SalesAverage3 */
    {
      field: "SalesAverage3",
      headerName: (
        <div
          style={{
            fontFamily: "Lucida Sans Unicode, sans-seriff",
            padding: "10px",
            fontSize: responsiveFont(),
            fontWeight: "semibold",
          }}
        >
          (3)SMA
        </div>
      ),
      width: responsiveTableWidth(),
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (filteredTableData) => (
        <div
          style={{
            color: "#480032",
            width: "100%",
            align: "center",
            textAlign: "center",
            fontSize: responsiveFont(),
            fontWeight: "500",
          }}
        >
          <SimpleMovingAverage
            number={3}
            data={
              dataUsedForTable.find(
                (a) => a.tableData.id === filteredTableData.row.id
              )?.moreInfoData ?? []
            }
          />
        </div>
      ),
    },
    /* SalesAverage6 */
    {
      field: "SalesAverage6",
      headerName: (
        <div
          style={{
            fontFamily: "Lucida Sans Unicode, sans-seriff",
            padding: "10px",
            fontSize: responsiveFont(),
            fontWeight: "semibold",
          }}
        >
          (6)SMA 
        </div>
      ),
      width: responsiveTableWidth(),
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (filteredTableData) => (
        <div
          style={{
            color: "#480032",
            width: "100%",
            align: "center",
            textAlign: "center",
            fontSize: responsiveFont(),
            fontWeight: "500",
          }}
        >
          <SimpleMovingAverage
            number={6}
            data={
              dataUsedForTable.find(
                (a) => a.tableData.id === filteredTableData.row.id
              )?.moreInfoData ?? []
            }
          />
        </div>
      ),
    },
    /* SalesAverage12 */
    {
      field: "SalesAverage12",
      headerName: (
        <div
          style={{
            fontFamily: "Lucida Sans Unicode, sans-seriff",
            padding: "10px",
            fontSize: responsiveFont(),
            fontWeight: "semibold",
          }}
        >
          (12)SMA 
        </div>
      ),
      width: responsiveTableWidth(),
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (filteredTableData) => (
        <div
          style={{
            color: "#480032",
            width: "100%",
            align: "center",
            textAlign: "center",
            fontSize: responsiveFont(),
            fontWeight: "500",
          }}
        >
          <SimpleMovingAverage
            number={12}
            data={
              dataUsedForTable.find(
                (a) => a.tableData.id === filteredTableData.row.id
              )?.moreInfoData ?? []
            }
          />
        </div>
      ),
    },
    /* Item Name */
    {
      field: "name2",
      headerName: (
        <div
          style={{
            fontFamily: "Lucida Sans Unicode, sans-seriff",
            padding: "10px",
            letterSpacing: "2px",
            fontSize: responsiveFont(),
            fontWeight: "semibold",
          }}
        >
          ITEM NAME
        </div>
      ),
      width: responsiveTableWidthItemName(),
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
      editable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (filteredTableData) => (
        <div
          style={{
            color: "#790252",
            width: "100%",
            align: "center",
            textAlign: "center",
            fontSize: responsiveFont(),
            fontWeight: "600",
          }}
        >
          {filteredTableData.row.name}
        </div>
      ),
    },
    /* RateOfChange1 */
    {
      field: "RateOfChange1",
      headerName: (
        <div
          style={{
            fontFamily: "Lucida Sans Unicode, sans-seriff",
            padding: "10px",
            letterSpacing: "2px",
            fontSize: responsiveFont(),
            fontWeight: "semibold",
          }}
        >
         (1)ROC  
        </div>
      ),
      width: responsiveTableWidth(),
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (filteredTableData) => (
        <div
          style={{
            color: "#480032",
            width: "100%",
            align: "center",
            textAlign: "center",
            fontSize: responsiveFont(),
            fontWeight: "500",
          }}
        >
          <RateOfChange
            number={1}
            data={
              dataUsedForTable.find(
                (a) => a.tableData.id === filteredTableData.row.id
              )?.moreInfoData ?? []
            }
          />
        </div>
      ),
    },
    /* RateOfChange3 */
    {
      field: "RateOfChange3",
      headerName: (
        <div
          style={{
            fontFamily: "Lucida Sans Unicode, sans-seriff",
            padding: "10px",
            letterSpacing: "2px",
            fontSize: responsiveFont(),
            fontWeight: "semibold",
          }}
        >
         (3)ROC   
        </div>
      ),
      width: responsiveTableWidth(),
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (filteredTableData) => (
        <div
          style={{
            color: "#480032",
            width: "100%",
            align: "center",
            textAlign: "center",
            fontSize: responsiveFont(),
            fontWeight: "500",
          }}
        >
          <RateOfChange
            number={3}
            data={
              dataUsedForTable.find(
                (a) => a.tableData.id === filteredTableData.row.id
              )?.moreInfoData ?? []
            }
          />
        </div>
      ),
    },
    /* RateOfChange6 */
    {
      field: "RateOfChange6",
      headerName: (
        <div
          style={{
            fontFamily: "Lucida Sans Unicode, sans-seriff",
            padding: "10px",
            letterSpacing: "2px",
            fontSize: responsiveFont(),
            fontWeight: "semibold",
          }}
        >
         (6)ROC   
        </div>
      ),
      width: responsiveTableWidth(),
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (filteredTableData) => (
        <div
          style={{
            color: "#480032",
            width: "100%",
            align: "center",
            textAlign: "center",
            fontSize: responsiveFont(),
            fontWeight: "500",
          }}
        >
          <RateOfChange
            number={6}
            data={
              dataUsedForTable.find(
                (a) => a.tableData.id === filteredTableData.row.id
              )?.moreInfoData ?? []
            }
          />
        </div>
      ),
    },
    /* RateOfChange12 */
    {
      field: "RateOfChange12",
      headerName: (
        <div
          style={{
            fontFamily: "Lucida Sans Unicode, sans-seriff",
            padding: "10px",
            letterSpacing: "2px",
            fontSize: responsiveFont(),
            fontWeight: "semibold",
          }}
        >
         (12)ROC   
        </div>
      ),
      width: responsiveTableWidth(),
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (filteredTableData) => (
        <div
          style={{
            color: "#480032",
            width: "100%",
            align: "center",
            textAlign: "center",
            fontSize: responsiveFont(),
            fontWeight: "500",
          }}
        >
          <RateOfChange
            number={12}
            data={
              dataUsedForTable.find(
                (a) => a.tableData.id === filteredTableData.row.id
              )?.moreInfoData ?? []
            }
          />
        </div>
      ),
    },
    /* Item Name */
    {
      field: "name3",
      headerName: (
        <div
          style={{
            fontFamily: "Lucida Sans Unicode, sans-seriff",
            padding: "10px",
            letterSpacing: "2px",
            fontSize: responsiveFont(),
            fontWeight: "semibold",
          }}
        >
          ITEM NAME
        </div>
      ),
      width: responsiveTableWidthItemName(),
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
      editable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (filteredTableData) => (
        <div
          style={{
            color: "#790252",
            width: "100%",
            align: "center",
            textAlign: "center",
            fontSize: responsiveFont(),
            fontWeight: "600",
          }}
        >
          {filteredTableData.row.name}
        </div>
      ),
    },
    /* Clicks1 */
    {
      field: "Clicks1",
      headerName: (
        <div
          style={{
            fontFamily: "Lucida Sans Unicode, sans-seriff",
            padding: "10px",
            letterSpacing: "2px",
            fontSize: responsiveFont(),
            fontWeight: "semibold",
          }}
        >
         (1)Clicks 
        </div>
      ),
      width: responsiveTableWidth(),
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (filteredTableData) => (
        <div
          style={{
            color: "#480032",
            width: "100%",
            align: "center",
            textAlign: "center",
            fontSize: responsiveFont(),
            fontWeight: "500",
          }}
        >
          <Clicks
            number={1}
            data={
              dataUsedForTable.find(
                (a) => a.tableData.id === filteredTableData.row.id
              )?.moreInfoData ?? []
            }
          />
        </div>
      ),
    },
    /* Clicks3 */
    {
      field: "Clicks3",
      headerName: (
        <div
          style={{
            fontFamily: "Lucida Sans Unicode, sans-seriff",
            padding: "10px",
            letterSpacing: "2px",
            fontSize: responsiveFont(),
            fontWeight: "semibold",
          }}
        >
         (3)Clicks   
        </div>
      ),
      width: responsiveTableWidth(),
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (filteredTableData) => (
        <div
          style={{
            color: "#480032",
            width: "100%",
            align: "center",
            textAlign: "center",
            fontSize: responsiveFont(),
            fontWeight: "500",
          }}
        >
          <Clicks
            number={3}
            data={
              dataUsedForTable.find(
                (a) => a.tableData.id === filteredTableData.row.id
              )?.moreInfoData ?? []
            }
          />
        </div>
      ),
    },
    /* Clicks6 */
    {
      field: "Clicks6",
      headerName: (
        <div
          style={{
            fontFamily: "Lucida Sans Unicode, sans-seriff",
            padding: "10px",
            letterSpacing: "2px",
            fontSize: responsiveFont(),
            fontWeight: "semibold",
          }}
        >
         (6)Clicks   
        </div>
      ),
      width: responsiveTableWidth(),
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (filteredTableData) => (
        <div
          style={{
            color: "#480032",
            width: "100%",
            align: "center",
            textAlign: "center",
            fontSize: responsiveFont(),
            fontWeight: "500",
          }}
        >
          <Clicks
            number={6}
            data={
              dataUsedForTable.find(
                (a) => a.tableData.id === filteredTableData.row.id
              )?.moreInfoData ?? []
            }
          />
        </div>
      ),
    },
    /* Clicks12 */
    {
      field: "Clicks12",
      headerName: (
        <div
          style={{
            fontFamily: "Lucida Sans Unicode, sans-seriff",
            padding: "10px",
            letterSpacing: "2px",
            fontSize: responsiveFont(),
            fontWeight: "semibold",
          }}
        >
         (12)Clicks   
        </div>
      ),
      width: responsiveTableWidth(),
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (filteredTableData) => (
        <div
          style={{
            color: "#480032",
            width: "100%",
            align: "center",
            textAlign: "center",
            fontSize: responsiveFont(),
            fontWeight: "500",
          }}
        >
          <Clicks
            number={12}
            data={
              dataUsedForTable.find(
                (a) => a.tableData.id === filteredTableData.row.id
              )?.moreInfoData ?? []
            }
          />
        </div>
      ),
    },
    /* Favorites */
    {
      field: "Favorite Level",
      headerName: (
        <div
          style={{
            fontFamily: "Lucida Sans Unicode, sans-seriff",
            padding: "10px",
            letterSpacing: "2px",
            fontSize: responsiveFont(),
            fontWeight: "semibold",
          }}
        >
          Favorite Level   
        </div>
      ),
      width: responsiveTableWidth(),
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (filteredTableData) => (
        <div
          style={{
            color: "#480032",
            width: "100%",
            align: "center",
            textAlign: "center",
            fontSize: responsiveFont(),
            fontWeight: "500",
          }}
        >
          <Favorites items={filteredTableData.row.itemId} favorites={trendingItems} />
        </div>
      ),
    },
    /* StockInsButton */
    {
      field: "StockInsButton",
      headerName: (
        <div
          style={{
            fontFamily: "Lucida Sans Unicode, sans-seriff",
            padding: "10px",
            letterSpacing: "2px",
            fontSize: responsiveFont(),
            fontWeight: "semibold",
          }}
        >
          STOCK INS
        </div>
      ),
      width: responsiveTableWidthItemName(),
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (filteredTableData) => (
        <StockInsButton
          name={filteredTableData.row.name}
          data={
            dataUsedForTable.find(
              (a) => a.tableData.id === filteredTableData.row.id
            )?.moreInfoData ?? []
          }
        />
      ),
    },
    /* RecentOrdersButton */
    {
      field: "RecentOrdersButton",
      headerName: (
        <div
          style={{
            fontFamily: "Lucida Sans Unicode, sans-seriff",
            padding: "10px",
            letterSpacing: "2px",
            fontSize: responsiveFont(),
            fontWeight: "semibold",
          }}
        >
          RECENT ORDERS
        </div>
      ),
      width: responsiveTableWidthItemName(),
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
      sortable: false,
      renderCell: (filteredTableData) => (
        <RecentOrdersButton
          name={filteredTableData.row.name}
          data={
            dataUsedForTable.find(
              (d) => d.tableData.id === filteredTableData.row.id
            )?.moreInfoData ?? []
          }
        />
      ),
    },
  ];

  const ROW_HEIGHT = 230;



  return (
    <div ref={p1} className=" w-11/12 2lg:w-9/12 ml-1 mr-3 mt-10 2lg:mt-0 bg-gradient-to-t from-stone-100 to-green-100 border-2 border-green-700 rounded-md">
        <Box
          sx={{
            height: "100%",
            "& .super-app-theme--header": {
              backgroundImage: "linear-gradient(to bottom, #95E8D7, #ADF7D1)",
            },
            "@media only screen and (max-width: 900px)": {
              height: "100%",
              width: "97%",
            },
          }}
          className='w-full'
        >
          <DataGrid
            rows={filtered}
            columns={columns}
            rowHeight={ROW_HEIGHT}
            sortingOrder={['desc', 'asc']}
            // sortModel={[{field: 'totalStocks', sort: 'asc'}]}
          />
          
        </Box>
      {/* )} */}
    </div>
  );
}
export default InventoryTable;
