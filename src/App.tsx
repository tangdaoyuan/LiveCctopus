import { ChangeEvent, MouseEventHandler, useState } from 'react'
// import UpdateElectron from '@/components/update'
import logoVite from './assets/logo-vite.svg'
import logoElectron from './assets/logo-electron.svg'
import './App.css'

function App() {
  const [url, setUrl] = useState('')
  const [path, setPath] = useState('')

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value)
  }

  const streamPusher = async () => {
    const ret = await window.common.openFile()

    console.log(ret)
    if (ret.cancel) {
      return
    }
    setPath(ret.file_path)
    const res = await window.living.liveStreamPush({
      url,
      target_path: ret.file_path,
    })
    console.log(res)
  }

  const streamStop = async () => {
    const res = await window.living.liveStreamStop(url)
    console.log(res)
  }

  return (
    <div className='App'>
      <div className='w-full'>
        <div className='w-full'>
          <input value={url} type="text" onChange={handleInput} />
        </div>
        <div className='w-full'>
          <input value={path} type="text" readOnly={true} />
        </div>
        <button onClick={streamPusher}>推流</button>
        <button onClick={streamStop}>停止</button>
      </div>
      {/* <UpdateElectron /> */}
    </div>
  )
}

export default App
