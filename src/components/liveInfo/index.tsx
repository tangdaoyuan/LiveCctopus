import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

export interface ISubmitParams { url: string; name: string; key: string; path: string }

interface IProps {
  open: boolean
  close: () => void
  submit: (params: ISubmitParams) => void
  data?: ISubmitParams
}


const ErrHelper = {
  name: '请输入正确别名',
  url: '请输入格式正确的url',
  key: '请输入验证密钥',
}

const ErrStr = JSON.stringify({
  name: {
    error: false,
    helperText: ''
  },
  url: {
    error: false,
    helperText: ''
  },
  key: {
    error: false,
    helperText: ''
  }
})

const LiveDialog = (props: IProps) => {
  const { open, close, submit } = props;
  const [url, setUrl] = useState('')
  const [key, setKey] = useState('')
  const [name, setName] = useState('')
  const [err, setError] = useState(JSON.parse(ErrStr))


  useEffect(() => {
    if (!props.data) {
      return
    }
    if (!open) {
      return
    }
    const { url, name, key } = props.data!
    setKey(key)
    setName(name)
    setUrl(url)

  }, [open])

  function handleSubmit() {
    const errObj = JSON.parse(ErrStr)
    let errCount = 0

    if (name.trim() === '') {
      errCount++
      errObj.key = {
        error: true,
        helperText: ErrHelper.name
      }
    }

    if (!/(rtmp|rtsp):\/\/([\w.]+\/?)\S*/.test(url)) {
      errCount++
      errObj.url = {
        error: true,
        helperText: ErrHelper.url
      }
    }

    if (key.trim() === '') {
      errCount++
      errObj.key = {
        error: true,
        helperText: ErrHelper.key
      }
    }

    if (errCount > 0) {
      setError(errObj)
      return
    }

    submit({ url, name, key, path: '' })
    setError(JSON.parse(ErrStr))
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={close}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>配置推流信息</DialogTitle>
        <DialogContent sx={{ width: 500 }} className='flex flex-col gap-5 !p-5'>
          <TextField disabled={!!props.data} helperText={err.name.helperText} error={err.name.error} size='small' value={name} onChange={e => setName(e.target.value)} required label="别名" variant="outlined" />
          <TextField helperText={err.url.helperText} error={err.url.error} size='small' value={url} onChange={e => setUrl(e.target.value)} required label="URL" variant="outlined" />
          <TextField helperText={err.key.helperText} error={err.key.error} size='small' value={key} onChange={e => setKey(e.target.value)} required label="密钥" variant="outlined" />
        </DialogContent>
        <DialogActions>
          <Button onClick={close} >
            取消
          </Button>
          <Button onClick={handleSubmit} >
            确定
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default LiveDialog
