import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
import ImageUploadButton from './components/ImageComponents/ImageUploadButton'



ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <BrowserRouter>
      {/* <App /> */}
      <ImageUploadButton folderName={'orderChat'}  orderReferenceNumber={'testref1234'} buttonTitle={'Upload Image'} userId={'xB80hL1fGRGWnO1yCK7vYL2hHQCP'} />
    </BrowserRouter>
  // </React.StrictMode>
)
