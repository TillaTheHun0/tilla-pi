import { Flip } from '../Flip'

export function parseVideoArgs (options) {
  let args = [
    ...parseArgs(options),
    /**
     * Bit rate
     */
    ...(options.bitRate ? ['--bitrate', options.bitRate.toString()] : []),

    /**
     * Frame rate
     */
    ...(options.fps ? ['--framerate', options.fps.toString()] : []),

    /**
     * Codec
     *
     * H264 or MJPEG
     *
     */
    ...(options.codec ? ['--codec', options.codec.toString()] : []),

    /**
     * Sensor mode
     *
     * Camera version 1.x (OV5647):
     *
     * | Mode |        Size         | Aspect Ratio | Frame rates |   FOV   |    Binning    |
     * |------|---------------------|--------------|-------------|---------|---------------|
     * |    0 | automatic selection |              |             |         |               |
     * |    1 | 1920x1080           | 16:9         | 1-30fps     | Partial | None          |
     * |    2 | 2592x1944           | 4:3          | 1-15fps     | Full    | None          |
     * |    3 | 2592x1944           | 4:3          | 0.1666-1fps | Full    | None          |
     * |    4 | 1296x972            | 4:3          | 1-42fps     | Full    | 2x2           |
     * |    5 | 1296x730            | 16:9         | 1-49fps     | Full    | 2x2           |
     * |    6 | 640x480             | 4:3          | 42.1-60fps  | Full    | 2x2 plus skip |
     * |    7 | 640x480             | 4:3          | 60.1-90fps  | Full    | 2x2 plus skip |
     *
     *
     * Camera version 2.x (IMX219):
     *
     * | Mode |        Size         | Aspect Ratio | Frame rates |   FOV   | Binning |
     * |------|---------------------|--------------|-------------|---------|---------|
     * |    0 | automatic selection |              |             |         |         |
     * |    1 | 1920x1080           | 16:9         | 0.1-30fps   | Partial | None    |
     * |    2 | 3280x2464           | 4:3          | 0.1-15fps   | Full    | None    |
     * |    3 | 3280x2464           | 4:3          | 0.1-15fps   | Full    | None    |
     * |    4 | 1640x1232           | 4:3          | 0.1-40fps   | Full    | 2x2     |
     * |    5 | 1640x922            | 16:9         | 0.1-40fps   | Full    | 2x2     |
     * |    6 | 1280x720            | 16:9         | 40-90fps    | Partial | 2x2     |
     * |    7 | 640x480             | 4:3          | 40-90fps    | Partial | 2x2     |
     *
     */
    ...(options.sensorMode ? ['--mode', options.sensorMode.toString()] : [])
  ]

  return args
}

export function parseArgs (options) {
  let args = [
    /**
     * Width
     */
    ...(options.width ? ['--width', options.width.toString()] : []),

    /**
     * Height
     */
    ...(options.height ? ['--height', options.height.toString()] : []),

    /**
     * Rotation
     */
    ...(options.rotation ? ['--rotation', options.rotation.toString()] : []),

    /**
     * Horizontal flip
     */
    ...(options.flip && (options.flip === Flip.AboutY || options.flip === Flip.Both)
      ? ['--hflip'] : []),

    /**
     * Vertical flip
     */
    ...(options.flip && (options.flip === Flip.AboutX || options.flip === Flip.Both)
      ? ['--vflip'] : []),

    /**
     * Capture time (ms)
     *
     * Zero = forever
     *
     */
    '--timeout', (0).toString(),

    /**
     * Do not display preview overlay on screen
     */
    '--nopreview',

    /**
     * Output to stdout
     */
    '--output', '-'
  ]

  return args
}
