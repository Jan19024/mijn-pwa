import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const HelloVideo: React.FC<{title: string}> = ({title}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const entrance = spring({frame, fps, config: {damping: 14}});
  const translateY = interpolate(entrance, [0, 1], [80, 0]);
  const opacity = interpolate(
    frame,
    [0, 20, durationInFrames - 20, durationInFrames],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #1e3a8a, #7c3aed)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1
        style={{
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontSize: 120,
          color: 'white',
          opacity,
          transform: `translateY(${translateY}px)`,
        }}
      >
        {title}
      </h1>
    </AbsoluteFill>
  );
};
