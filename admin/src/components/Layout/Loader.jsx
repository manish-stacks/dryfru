
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function ImprovedLoader({ loading }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (loading) {
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          const newProgress = Math.min(oldProgress + Math.random() * 10, 99)
          return newProgress
        })
      }, 500)

      return () => {
        clearInterval(timer)
      }
    }
  }, [loading])

  if (!loading) return null

  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-gray-900 bg-opacity-75 z-50 animate-fade-in">
      <div className="text-center space-y-4">
      

        <h2 className="text-2xl font-bold text-white">Adding Product</h2>
        
        <p className="text-lg text-gray-300">
          Please wait while we upload the images and add the product.
        </p>

        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-sm text-gray-400">
          Progress: {Math.round(progress)}%
        </p>
      </div>
    </div>
  )
}

