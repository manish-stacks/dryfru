import { FiShoppingCart, FiPackage, FiUsers, FiBarChart2 } from 'react-icons/fi'
import StatsCard from '../../components/Dashboard/StatsCard'
import RecentOrders from '../../components/Dashboard/RecentOrders'
import axios from 'axios'
import { useEffect, useState } from 'react'
const statsData = [
  {
    icon: FiShoppingCart,
    title: 'Total Sales',
    value: '$54,321',
    trend: '↑ 12% from last month',
    color: 'green'
  },
  {
    icon: FiPackage,
    title: 'Products',
    value: '1,234',
    trend: '86 new this week',
    color: 'blue'
  },
  {
    icon: FiUsers,
    title: 'Customers',
    value: '892',
    trend: '↑ 4.3% conversion rate',
    color: 'purple'
  },
  {
    icon: FiBarChart2,
    title: 'Revenue',
    value: '$12,345',
    trend: '↑ 8% from last week',
    color: 'yellow'
  }
]

// const recentOrders = [
//   { id: '#12345', customer: 'John Doe', product: 'Premium Widget', amount: '$99.99', status: 'Completed' },
//   { id: '#12346', customer: 'Jane Smith', product: 'Super Gadget', amount: '$149.99', status: 'Processing' },
//   { id: '#12347', customer: 'Bob Johnson', product: 'Mega Tool', amount: '$79.99', status: 'Shipped' },
//   { id: '#12348', customer: 'Alice Brown', product: 'Power Device', amount: '$199.99', status: 'Pending' },
//   { id: '#12349', customer: 'Charlie Wilson', product: 'Ultimate Kit', amount: '$299.99', status: 'Completed' },
// ]

export default function DashboardPage() {
  const [recentOrders,setRecentOrders] = useState([])
  const fetchOrders = async()=>{
    try {
      const response = await axios.get('https://api.dyfru.com/api/v1/get-recent-orders')
      console.log("response",response.data.data)
      setRecentOrders(response.data.data)
    } catch (error) {
      console.log("Internal server error",error)
    }
  }

  useEffect(()=>{
    fetchOrders()
  },[])

  return (
    <>
      <div className="grid pt-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))} */}
      </div>
      <RecentOrders orders={recentOrders} />
    </>
  )
}