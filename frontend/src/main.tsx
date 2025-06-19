import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import { Provider } from 'react-redux'

import './global.less'
import App from './App'
import { store } from './store'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider>
        <App />
      </ConfigProvider>
    </Provider>
  </React.StrictMode>
)
