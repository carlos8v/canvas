export const classnames = (props) => {
  const classes = []

  for (const [key, value] of Object.entries(props)) {
    if (value) classes.push(key)
  }

  return classes.join(' ')
}
