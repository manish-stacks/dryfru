import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Doughnut } from 'react-chartjs-2';
import { format } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Sun, Moon, Calendar, TrendingUp, Package, AlertCircle, Loader2 } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Reports() {
  const [darkMode, setDarkMode] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reportType, setReportType] = useState('weekly');
  const [dateRange, setDateRange] = useState({
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.post('https://api.dyfru.com/api/v1/get-reports', {
        reportType,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      });
      setReportData(response.data);
    } catch (err) {
      setError('Failed to fetch report data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [reportType, dateRange]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const chartData = reportData ? {
    labels: ['Total Orders', 'Total Quantity'],
    datasets: [
      {
        label: 'Orders Overview',
        data: [reportData.data.totalAmount, reportData.data.totalQuantity],
        backgroundColor: [
          'rgba(59, 130, 246, 0.6)',
          'rgba(16, 185, 129, 0.6)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)'
        ],
        borderWidth: 1
      }
    ]
  } : null;

  const productChartData = reportData ? {
    labels: [
      reportData.data.mostSoldProduct.productName,
      reportData.data.leastSoldProduct.productName,
      ...(reportData.data.unsoldProducts || [])
    ],
    datasets: [{
      data: [
        reportData.data.mostSoldProduct.quantitySold,
        reportData.data.leastSoldProduct.quantitySold,
        ...(reportData.data.unsoldProducts.map(() => 0))
      ],
      backgroundColor: [
        'rgba(16, 185, 129, 0.6)',
        'rgba(245, 158, 11, 0.6)',
        'rgba(239, 68, 68, 0.6)'
      ]
    }]
  } : null;

  return (
    <div className={`min-h-screen transition-colors duration-200  'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto p-4">
        {/* Header */}
       
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="p-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <option value="weekly">Weekly Report</option>
            <option value="monthly">Monthly Report</option>
            <option value="custom">Custom Range</option>
          </select>

          {reportType === 'custom' && (
            <>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="p-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="p-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </>
          )}
        </div>
  {/* Report Content */}
  {reportData && !loading && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Sales</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                     Rs: {reportData.data.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Quantity</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {reportData.data.totalQuantity}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                    <Calendar className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Report Period</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                      {reportType}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4 dark:text-white">Orders Overview</h3>
                {chartData && <Bar data={chartData} options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      labels: {
                        color: darkMode ? 'white' : 'black'
                      }
                    }
                  },
                  scales: {
                    y: {
                      ticks: {
                        color: darkMode ? 'white' : 'black'
                      }
                    },
                    x: {
                      ticks: {
                        color: darkMode ? 'white' : 'black'
                      }
                    }
                  }
                }} />}
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4 dark:text-white">Product Distribution</h3>
                {productChartData && <Doughnut data={productChartData} options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      labels: {
                        color: darkMode ? 'white' : 'black'
                      }
                    }
                  }
                }} />}
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 dark:text-white">Product Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                  <h4 className="font-medium text-green-700 dark:text-green-400">Most Sold Product</h4>
                  <p className="text-lg font-bold text-green-900 dark:text-green-300">
                    {reportData.data.mostSoldProduct.productName}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {reportData.data.mostSoldProduct.quantitySold} units sold
                  </p>
                </div>

                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                  <h4 className="font-medium text-yellow-700 dark:text-yellow-400">Least Sold Product</h4>
                  <p className="text-lg font-bold text-yellow-900 dark:text-yellow-300">
                    {reportData.data.leastSoldProduct.productName}
                  </p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    {reportData.data.leastSoldProduct.quantitySold} units sold
                  </p>
                </div>

                <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
                  <h4 className="font-medium text-red-700 dark:text-red-400">Unsold Products</h4>
                  <div className="space-y-1">
                    {reportData.data.unsoldProducts.map((product, index) => (
                      <p key={index} className="text-sm text-red-600 dark:text-red-300">{product}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Loading and Error States */}
        {loading && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        )}

        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded relative mb-8">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          </div>
        )}

      
      </div>
    </div>
  );
}

export default Reports;