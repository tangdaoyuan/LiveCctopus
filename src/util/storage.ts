
export function saveLiveList(data: any[]) {
  localStorage.setItem('live_list', JSON.stringify(data))
}

export function readLiveList(): any[] {
  const d = localStorage.getItem('live_list')
  if (!d) {
    return []
  }
  return JSON.parse(d)
}
