import React from 'react'
import { Card } from '../ui/Card'

function NewsWidget() {
  return (
    <Card title="News">
      <div className="p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <button className="btn btn-sm btn-primary">Technology</button>
          <button className="btn btn-sm btn-outline">Business</button>
          <button className="btn btn-sm btn-outline">Sports</button>
          <button className="btn btn-sm btn-outline">Health</button>
        </div>
        
        <div className="space-y-4">
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold">Latest Technology News</h3>
            <p className="text-sm text-gray-600">2 hours ago • TechNews</p>
            <p className="mt-1">Artificial Intelligence breakthroughs are transforming healthcare with new diagnostic tools.</p>
          </div>
          
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold">Major Market Shifts</h3>
            <p className="text-sm text-gray-600">4 hours ago • BusinessWeekly</p>
            <p className="mt-1">Global markets respond to central bank policy changes with mixed results.</p>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default NewsWidget