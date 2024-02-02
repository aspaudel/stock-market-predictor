import "./App.css";
import React, { useEffect, useState, useRef } from "react";
import sp500Import from "./json/s&p500.json";
import nseImport from "./json/nse.json";
import stockSymbolsImport from "./constants/StockSymbols";
import axios from "axios";
import StockChart from "./StockChart";

function App() {
  const [stockSymbols, setStockSymbols] = useState([]);
  const [currentStockList, setCurrentStockList] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [stockName, setStockName] = useState("");
  const [stockSymbol, setStockSymbol] = useState("");
  const [chartData, setChartData] = useState([]);
  const [accuracy, setAccuracy] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const stockExchangNameRef = useRef();
  const stockNameRef = useRef();

  const stockExchangeMap = new Map();
  stockExchangeMap.set("S&P500", sp500Import);
  stockExchangeMap.set("NSE", nseImport);

  useEffect(() => {
    setStockSymbols(stockSymbolsImport);
    setFilteredResults(sp500Import);
    setCurrentStockList(sp500Import);
  }, []);

  function handleStockExchangeName(e) {
    let stockExchangeName = stockExchangNameRef.current.value;
    setCurrentStockList(stockExchangeMap.get(stockExchangeName));
    setFilteredResults(stockExchangeMap.get(stockExchangeName));
  }

  function handleStockName(e) {
    let stockName = stockNameRef.current.value;
    setStockName(stockName);
    setFilteredResults(
      currentStockList.filter((stocks, index) => {
        return stocks.Name.toLowerCase().includes(stockName.toLowerCase());
      })
    );
  }

  function handleStockNameClick(stockName, stockSymbol) {
    setStockName(stockName);
    setStockSymbol(stockSymbol);
  }

  function generatePrediction() {
    let stockExchangeName = stockExchangNameRef.current.value;
    axios
      .get("http://localhost:3001/getPrediction", {
        params: { stockSymbol, stockIndex: stockExchangeName },
      })
      .then((response) => {
        if (response.status === 200) {
          const chartDataResponse = JSON.parse(response.data);
          setChartData(chartDataResponse[0]);
          setAccuracy(chartDataResponse[1][0].accuracy);
          setShowChart(true);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div className="App">
      <h1>Stock Predictor</h1>
      <div className="d-flex flex-column align-items-center mt-4">
        <div className="form-floating col-md-2">
          <select
            className="form-select"
            id="floatingSelect"
            aria-label="Floating label select example"
            onChange={handleStockExchangeName}
            ref={stockExchangNameRef}
          >
            {stockSymbols.map((ss, index) => {
              return (
                <option key={index} value={ss}>
                  {ss}
                </option>
              );
            })}
          </select>
          <label htmlFor="floatingSelect">Select stock symbol</label>
        </div>

        <div className="col-md-6">
          <div className="input-group mt-3 dropdown">
            <input
              ref={stockNameRef}
              value={stockName}
              onChange={handleStockName}
              type="text"
              className="form-control dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              placeholder="Enter Stock Name/Symbol"
              aria-label="Stock Name/Symbol"
              aria-describedby="button-addon2"
            />
            <ul className="dropdown-menu overflow-auto">
              {filteredResults.map((stock, index) => {
                return (
                  <li
                    key={index}
                    onClick={() => {
                      handleStockNameClick(stock.Name, stock.Symbol);
                    }}
                  >
                    <a className="dropdown-item" href="#">
                      {stock.Name}
                    </a>
                  </li>
                );
              })}
            </ul>
            <button
              className="btn btn-success"
              type="button"
              id="button-addon2"
              onClick={generatePrediction}
            >
              Generate Prediction
            </button>
          </div>
          {showChart && <StockChart data={chartData} accuracy={accuracy} />}
        </div>
        <div className="col-md-6"></div>
      </div>
    </div>
  );
}

export default App;
