
# Marching Ants

  SVG marching ants for file upload UI

## Installation

  Install with [component(1)](http://component.io):

    $ component install peteschaffner/marching-ants

## Events

- `march` — the dashed stroke is rotating
- `stop` — the dashed stroke has stopped rotating

## API

### MarchingAnts(els, number)

Attach a `MarchingAnts` to each element.
Equivalent to `MarchingAnts(els, { speed: number })`.

### new MarchingAnts(el, [options])

Attach a `MarchingAnts` to an element. Available `options` include:

  - `speed` — rotation speed in milliseconds [60]
  - `radius` — border radius of the dashed rectangle [5]
  - `strokeWidth` — stroke width [2]
  - `strokeColor` — stroke color ['rgba(0,0,0,0.1)']
  - `strokeDasharray` — dash size and spacing ['6,5']
  - `fill` — fill color ['none']

### MarchingAnts#march()

Make the ants march.

### MarchingAnts#stop()

Stop the marching ants.

### Fallback

For those browsers that don't support inline SVG, 
a class of `ma-no-svg` will be added to the `el[s]`.

## License

  MIT
