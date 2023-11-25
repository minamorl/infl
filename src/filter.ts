import {Event} from './event'

export function filter(events: Event[]) {
  // Filter out inactive events
  const activeEvents = [...events].filter(event => event.isActive)
  // Filter out events with the same type and publisher, keeping recent 5 events
  const filteredEvents = activeEvents.reduce((acc, event) => {
    const {type, publisher} = event
    const key = `${type}-${publisher}`
    const events = acc.get(key) || []
    events.push(event)
    acc.set(key, events.slice(-5))
    return acc
  }, new Map<string, Event[]>())
  // Sort events by timestamp
  const sortedEvents = [...filteredEvents.values()].flat().sort((a, b) => {
    return a.timestamp - b.timestamp
  })
  return sortedEvents
}