'use client';
import { useState } from 'react'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
export default function DocsLayout({ children, content, tabs }) {
  const [activeTab, setActiveTab] = useState('overview')
  const segment = useSelectedLayoutSegment('content')
  const tabsList = [
    { id: 'overview', label: '概览' },
    { id: 'api', label: 'API文档' },
    { id: 'examples', label: '示例' }
  ]
  
  return (
    <div className="flex flex-col">
      {/* 选项卡导航区 */}
      <nav className="flex space-x-4">
        {tabsList.map(tab => (
          <>
           <Link
            key={tab.id}
            href={`/docs/${tab.id}`}
            className={`px-3 py-2 ${segment === tab.id ? 'border-b-2 border-blue-500' : ''}`}
          >
            {tab.label}
          </Link>
          <br />
          </>
        ))}
      </nav>
      
      {/* 内容区 */}
      <div className="flex-1 p-4">
        { children}
      </div>
    </div>
  )
}