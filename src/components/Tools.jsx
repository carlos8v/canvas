import { useEffect, useState } from 'react'
import { MousePointer, Minus, Circle, Square } from 'react-feather'

import { classnames } from '../utils/classnames'
import { usePaintContext } from '../contexts/PaintContext'
import { bindEvents } from '../utils/events'

const tools = [
  {
    id: 'selection',
    label: 'Seleção',
    Icon: ({ active }) => (
      <MousePointer
        className={classnames({
          'w-6 h-5 text-white transition': true,
          'fill-white': active,
        })}
      />
    ),
  },
  {
    id: 'line',
    label: 'Linha',
    Icon: () => <Minus className="w-6 h-6 text-white transition" />,
  },
  {
    id: 'ellipse',
    label: 'Elipse',
    Icon: ({ active }) => (
      <Circle
        className={classnames({
          'w-6 h-6 text-white transition': true,
          'fill-white': active,
        })}
      />
    ),
  },
  {
    id: 'rectangle',
    label: 'Retângulo',
    Icon: ({ active }) => (
      <Square
        className={classnames({
          'w-6 h-6 text-white transition': true,
          'fill-white': active,
        })}
      />
    ),
  },
  {
    id: 'diamond',
    label: 'Losango',
    Icon: ({ active }) => (
      <Square
        className={classnames({
          'w-6 h-5 text-white rotate-45 transition': true,
          'fill-white': active,
        })}
      />
    ),
  },
]

export const Tools = () => {
  const { changeTool } = usePaintContext()
  const [selectedToolIdx, setSelectedToolIdx] = useState(0)

  useEffect(() => {
    const events = tools.map(({ id }, idx) => ({
      key: `${idx + 1}`,
      cb: () => handleSelectTool(id, idx),
    }))

    const cleanup = bindEvents(events)
    return () => cleanup()
  }, [])

  function handleSelectTool(id, idx) {
    changeTool(id)
    setSelectedToolIdx(idx)
  }

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 mt-4 p-2 bg-zinc-900 z-10 rounded-lg flex gap-2">
      {tools.map(({ id, label, Icon }, idx) => (
        <button
          key={id}
          type="button"
          title={label}
          onClick={() => handleSelectTool(id, idx)}
          className={classnames({
            'rounded-lg cursor-pointer p-3 transition relative': true,
            'hover:bg-zinc-800': idx !== selectedToolIdx,
            'bg-violet-500/40': idx === selectedToolIdx,
          })}
        >
          <Icon active={idx === selectedToolIdx} />
          <span className="absolute bottom-0 right-1 text-sm font-thin text-zinc-400 select-none">
            {idx + 1}
          </span>
        </button>
      ))}
    </div>
  )
}
