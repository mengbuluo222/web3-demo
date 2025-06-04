import './global.css';
import React from 'react'

export default function layout({children, modal}) {
  return (
    <div>
      {children}
      {modal}
      <div id="modal-root" />
    </div>
  )
}
