import mousetrap from 'mousetrap'

/**
 * @example
 * useEffect(() => {
 *  const events = [{ key: 'command+k', cb: () => {} }]
 *  const cleanup = bindEvents(events)
 *  return () => cleanup()
 * }, [])
 */
export function bindEvents(events) {
  for (const { key, cb } of events) {
    mousetrap.bind(key, cb)
  }

  return () => {
    for (const { key } of events) {
      mousetrap.unbind(key)
    }
  }
}
