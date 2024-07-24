import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { PencilOutline } from '@ricons/ionicons5'
import { Icon } from '@ricons/utils'
import LiveDialog, { type ISubmitParams } from '../liveInfo';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';


interface IProps {
  data: ISubmitParams
  remove: (url: string) => void
  update: (params: any) => void
}

let timer: null | ReturnType<typeof setInterval> = null;


function clearTimer() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

const LiveCard = (props: IProps) => {
  const { data, remove, update } = props
  const [open, setOpen] = useState(false)
  const [edit, setEdit] = useState(false)
  const [err, setError] = useState('')
  const [running, setRunning] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (running) {
      timer = setInterval(async () => {
        const ret = await window.living.isLiveRunning(`${data.url}${data.key}`)
        if (!ret) {
          setRunning(false)
        }
      }, 1000)
    } else {
      clearTimer()
    }

    return () => clearTimer()
  }, [running])

  const streamPusher = async () => {
    if (!data.url.trim()) {
      setError('URL参数不能为空')
      setOpen(true)
      return
    }
    const ret = await window.common.openFile()

    if (ret.cancel) {
      setError('文件选择被取消。')
      setOpen(true)
      return
    }

    try {
      setLoading(true)
      const res = await window.living.liveStreamPush({
        url: `${data.url}${data.key}`,
        target_path: ret.file_path,
      })
      if (res.code === 0) {
        setRunning(true)
        return
      }

      setError('推流启动失败')
      setOpen(true)
    } catch (error) {

    } finally {
      setLoading(false)
    }

  }

  const streamStop = async () => {
    setLoading(true)
    try {
      const res = await window.living.liveStreamStop(`${data.url}${data.key}`)
      if (res.code === 0) {
        setRunning(false)
        return
      }
      setError('推流停止失败')
      setOpen(true)
    } catch (error) {

    } finally {
      setLoading(false)
    }

  }

  const removeStream = () => {
    remove(data.url)
  }

  const handleEdit = (params: ISubmitParams) => {
    update(params)
    setEdit(false)
  }

  return (
    <>
      {
        loading ? <Skeleton variant="rectangular" width={300} height={220} /> :

          <Card sx={{ width: 300 }}>
            <CardContent sx={{ height: 150 }} className='p-2 relative'>
              <Typography variant="h5" component="div">
                {data.name}
              </Typography>
              <Typography sx={{ fontSize: 14, wordBreak: 'break-all' }} color="text.secondary">
                URL: {data.url}{data.key}
              </Typography>
              {
                !running && <div className='absolute right-2 top-2'>
                  <IconButton onClick={() => setEdit(true)}>
                    <Icon size={20}>
                      {/* 
          // @ts-ignore */}
                      <PencilOutline />
                    </Icon>
                  </IconButton>
                </div>
              }
              <div className="absolute right-5 bottom-4">
                <Typography color={running ? '#12f712' : '#ffab00'}>{running ? '运行中' : '待机中'}</Typography>
              </div>
            </CardContent>
            <CardActions className='flex items-center justify-center !p-0'>
              {
                !running ? <Button style={{ width: '50%' }} size="large" variant="text" onClick={streamPusher}>推流</Button>
                  : <Button style={{ width: '100%' }} size="large" variant="text" onClick={streamStop}>停止</Button>
              }
              {
                !running && <Button style={{ width: '50%' }} size="large" color="error" variant="text" onClick={removeStream}>删除</Button>
              }
            </CardActions>
          </Card >
      }
      <LiveDialog data={props.data} open={edit} close={() => setEdit(false)} submit={handleEdit} />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent sx={{ width: 300 }}>
          <DialogContentText id="alert-dialog-description">
            {err}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} >
            知道了
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default LiveCard
