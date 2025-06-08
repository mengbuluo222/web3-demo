"use client";
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

export default function page({ analytics }: { analytics: any }) {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    // 监听窗口大小变化
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // 清理监听器
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // 空依赖数组确保只在组件挂载和卸载时运行

  return (
    <div>
     <h1>当前可视区域宽度: {width}px</h1>
    </div>
  )
}
