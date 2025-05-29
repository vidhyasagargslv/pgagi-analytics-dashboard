import React from 'react'
import { Card } from '../ui/Card'

function FinanceWidget() {
  return (
     <Card title="Finance">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold">AAPL</h3>
            <p className="text-sm text-gray-600">Apple Inc.</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">$182.63</div>
            <div className="text-sm text-green-600">+1.23 (0.68%)</div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <button className="btn btn-sm btn-primary">1D</button>
          <button className="btn btn-sm btn-outline">1W</button>
          <button className="btn btn-sm btn-outline">1M</button>
          <button className="btn btn-sm btn-outline">1Y</button>
        </div>
        
        <div className="h-48 bg-gray-100 flex items-center justify-center rounded">
          <p className="text-gray-500">Stock chart will render here</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <div className="text-sm text-gray-500">Open</div>
            <div>$181.27</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Close</div>
            <div>$182.63</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">High</div>
            <div>$183.12</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Low</div>
            <div>$180.96</div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default FinanceWidget