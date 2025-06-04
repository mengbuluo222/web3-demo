import React from 'react'

export default function layout({
  children,
  siderbar,
  header,
  widgets}) {
  return (
    <div>
      <div >
        {header || <DefaultHeader />}
        {siderbar}
        {widgets}
        {children}
      </div>
      
    </div>
  )
}
