import { useState } from 'react'
import { Menu } from 'react-feather'

import {
  defaultShapeColors,
  defaultBorderColors,
  usePaintStore,
} from '../store/paintStore'

import { classnames } from '../utils/classnames'

export const ObjectOptions = () => {
  const [isActive, setIsActive] = useState(true)

  const { shapeColor, setShapeColor, borderColor, setBorderColor } =
    usePaintStore()

  return (
    <div className="flex flex-col-reverse items-start lg:flex-col fixed bottom-0 gap-4 lg:top-0 left-0 mb-4 lg:mb-0 lg:mt-4 ml-4 z-10 text-white w-1/2 pointer-events-none">
      <button
        className="rounded-lg bg-zinc-900 cursor-pointer p-3 pointer-events-auto"
        onClick={() => setIsActive((prev) => !prev)}
      >
        <Menu className="w-6 h-6 text-white" />
      </button>
      <div
        className={classnames({
          'bg-zinc-900 rounded-lg transition overflow-hidden pointer-events-auto flex flex-col gap-4': true,
          'p-4 w-full max-w-xs': isActive,
          'p-0 w-0': !isActive,
        })}
      >
        <div>
          <p className="mb-2">Contorno</p>
          <div className="flex flex-wrap gap-1">
            {defaultBorderColors.map((color) => (
              <button
                key={color}
                onClick={() => setBorderColor(color)}
                className={classnames({
                  'h-10 w-10 p-0.5 rounded-lg border border-2 border-transparent': true,
                  'hover:border-zinc-400': color !== borderColor,
                  'border-violet-500': color === borderColor,
                })}
              >
                <div
                  className="w-full h-full rounded border border-px border-zinc-800"
                  style={{
                    backgroundColor: color,
                  }}
                ></div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2">Fundo</p>
          <div className="flex flex-wrap gap-1">
            {defaultShapeColors.map((color) => (
              <button
                key={color}
                onClick={() => setShapeColor(color)}
                className={classnames({
                  'h-10 w-10 p-0.5 rounded-lg border border-2 border-transparent': true,
                  'hover:border-zinc-400': color !== shapeColor,
                  'border-violet-500': color === shapeColor,
                })}
              >
                <div
                  className="w-full h-full rounded border border-px border-zinc-800"
                  style={{
                    backgroundColor: color,
                    ...(color === 'transparent'
                      ? {
                          backgroundImage:
                            'linear-gradient(45deg, #09090b 25%, transparent 25%), linear-gradient(-45deg, #09090b 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #09090b 75%), linear-gradient(-45deg, transparent 75%, #09090b 75%)',
                          backgroundSize: '20px 20px',
                          backgroundPosition:
                            '0 0, 0 10px, 10px -10px, -10px 0px',
                        }
                      : {}),
                  }}
                ></div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
