// one second * 60 = 1 minute * 15
const FIFTEEN_MINUTES = 1000 * 60 * 15
export function getTimeIntervals(start: Date, end: Date): Date[] {
  if (!start || !end || isNaN(start.getTime?.()) || isNaN(end.getTime?.())) {
    return []
  }

  let baseTime = start.getTime()
  if (end < start) {
    return []
  }

  const result: Date[] = []
  while (baseTime <= end.getTime()) {
    result.push(new Date(baseTime))
    baseTime += FIFTEEN_MINUTES
  }

  return result
}

export function getValidTime(time: any): Date {
  let newDate = time
  if (typeof newDate === 'string') {
    newDate = new Date(newDate)
  }

  if (typeof newDate === 'object') {
    if (!isNaN(newDate?.getTime())) {
      return newDate
    }
  }

  return null
}
