import { ChangeEvent, MouseEventHandler, useEffect, useState } from 'react'
// import UpdateElectron from '@/components/update'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Card from '@/components/card'
import LiveDialog, { type ISubmitParams } from '@/components/liveInfo';
import { Add20Filled } from '@ricons/fluent'
import { Icon } from '@ricons/utils'
import IconButton from '@mui/material/IconButton';

import './App.css'
import { readLiveList, saveLiveList } from './util/storage';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      dark: '#7994e5',
      main: '#7994e5',
    },
    text: {
      // primary: '#ffab00',
    }
  },
})

function App() {
  const [open, setOpen] = useState(false)
  const [cardData, setCardData] = useState<ISubmitParams[]>([])


  useEffect(() => {
    setCardData(readLiveList())
  }, [])

  function openDialog() {
    setOpen(true)
  }
  function closeDialog() {
    setOpen(false)
  }
  function handleSubmit(data: ISubmitParams) {
    setCardData((d) => {
      d.push(data)
      saveLiveList(d)
      return d
    })
    closeDialog()
  }

  function updateCard(data: ISubmitParams) {
    const list = cardData.map(c => {
      if (c.name === data.name) {
        return data
      }
      return c
    })
    setCardData(list)
    saveLiveList(list)

  }

  function removeCard(url: string) {
    const list = cardData.filter(c => c.url !== url)
    setCardData(list)
    saveLiveList(list)
  }

  function cardRender() {
    return cardData.map(d => <Card key={d.url} data={d} remove={removeCard} update={updateCard} />)
  }


  return (
    <ThemeProvider theme={darkTheme}>
      <div className='App flex flex-wrap gap-8' >
        {cardRender()}
        <IconButton onClick={openDialog}>
          <Icon size={200}>
            {/* 
          // @ts-ignore */}
            <Add20Filled />
          </Icon>
        </IconButton>
      </div>
      <LiveDialog open={open} close={closeDialog} submit={handleSubmit} />
      {/* <UpdateElectron /> */}
    </ThemeProvider>
  )
}

export default App
