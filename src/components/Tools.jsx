import { useState } from 'react'
import { Minus, Circle, Square } from 'react-feather'

import { classnames } from '../utils/classnames'

const tools = [
  {
    id: 'line',
    label: 'Linha',
    Icon: <Minus className="w-6 h-6 text-white" />,
  },
  {
    id: 'circle',
    label: 'Elipse',
    Icon: <Circle className="w-6 h-6 text-white" />,
  },
  {
    id: 'square',
    label: 'Retângulo',
    Icon: <Square className="w-6 h-6 text-white" />,
  },
  {
    id: 'diamond',
    label: 'Losango',
    Icon: <Square className="w-6 h-5 text-white rotate-45" />,
  },
]

export const Tools = () => {
  const [selectedToolIdx, setSelectedToolIdx] = useState(0)

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 mt-4 p-2 bg-zinc-900 z-10 rounded-lg flex gap-2">
      {tools.map(({ id, label, Icon }, idx) => (
        <button
          key={id}
          type="button"
          title={label}
          onClick={() => setSelectedToolIdx(idx)}
          className={classnames({
            'rounded-lg cursor-pointer p-3 transition relative': true,
            'hover:bg-zinc-800': idx !== selectedToolIdx,
            'bg-violet-500/40': idx === selectedToolIdx,
          })}
        >
          {Icon}
          <span className="absolute bottom-0 right-1 text-sm font-thin text-zinc-400 select-none">
            {idx + 1}
          </span>
        </button>
      ))}
    </div>
  )
}
