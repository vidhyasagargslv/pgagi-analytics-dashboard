import React from 'react'
import {Card} from '@/components/ui/Card'
function WeatherWidget() {
  return (
     <Card title="Weather">
      <div className="text-center p-4">
        <p className="text-lg">Weather data will be displayed here</p>
        <div className="flex flex-col items-center mt-4">
          <div className="text-6xl font-bold">23°</div>
          <div className="text-xl mt-2">Sunny</div>
          <div className="text-sm text-gray-500">New York, NY</div>
          <div className="grid grid-cols-3 gap-4 mt-6 w-full">
            <div className="text-center">
              <div className="font-medium">Humidity</div>
              <div>45%</div>
            </div>
            <div className="text-center">
              <div className="font-medium">Wind</div>
              <div>8 mph</div>
            </div>
            <div className="text-center">
              <div className="font-medium">Feels Like</div>
              <div>24°</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default WeatherWidget