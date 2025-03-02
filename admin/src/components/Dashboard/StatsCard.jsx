export default function StatsCard({ icon: Icon, title, value, trend, color }) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center">
          <div className={`p-3 rounded-full bg-${color}-100 dark:bg-${color}-900/50`}>
            <Icon className={`h-6 w-6 text-${color}-600 dark:text-${color}-400`} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className={`text-sm text-${color}-600 dark:text-${color}-400`}>{trend}</p>
          </div>
        </div>
      </div>
    )
  }