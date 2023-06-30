import React, { useState, useEffect, CSSProperties } from 'react';

type WheelSpinnerProps = {
  options: string[];
  winningIndex: number;
  spin: boolean;
};

const WheelSpinner: React.FC<WheelSpinnerProps> = ({
  options,
  winningIndex,
  spin,
}) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (spin) {
      const numberOfSlices = options.length;
      const degreesPerSlice = 360 / numberOfSlices;
      const targetRotation =
        360 * 3 - (winningIndex * degreesPerSlice + degreesPerSlice / 2);
      setRotation(targetRotation);
    }
  }, [spin, options, winningIndex]);

  const wheelStyles: CSSProperties = {
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    borderWidth: '5px',
    borderColor: 'black',
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 1.2s ease-out',
    transform: `rotate(${rotation}deg)`,
  };

  const sliceContainerStyles: CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: '0',
    top: '0',
  };
  const centerStyles: CSSProperties = {
    position: 'absolute',
          bottom: '43%',
          left: '43%',
          transformOrigin: '0 100%',
  }

  return (
    <div style={wheelStyles} className='-z-40'>
      <div style={sliceContainerStyles}>
        {options.map((option, index) => {
          const numberOfSlices = options.length;
          const degreesPerSlice = 360 / numberOfSlices;
          const rotation = index * degreesPerSlice;
          const sliceStyles: CSSProperties = {
            position: 'absolute',
            width: '0',
            height: '0',
            borderTop: '250px solid transparent',
            borderBottom: '250px solid transparent',
            borderLeft: `125px solid ${index % 2 === 0 ? "#ff4d4d" : "#17191b"}`,
            transform: `rotate(${rotation}deg)`,
            transformOrigin: '0% 100%',
            left: '50%',
            bottom: '50%',
          };
          return (
            <div key={index} style={sliceStyles}></div>
          );
        })}
      </div>
      {options.map((option, index) => {
        const numberOfSlices = options.length;
        const degreesPerSlice = 360 / numberOfSlices;
        const rotation = index * degreesPerSlice;
        const textStyles: CSSProperties = {
          position: 'absolute',
          bottom: '50%',
          left: '50%',
          width: '170px',
          textAlign: 'end',
          transform: `rotate(${rotation + degreesPerSlice/2}deg) translateX(100px)`,
          transformOrigin: '0 100%',
          color: 'white',
          fontSize: '1rem',
        };
        return (
          <div key={index} style={textStyles}>{option}</div>
        );
      })}
      <div style={centerStyles} className=' w-20 h-20 bg-base-300 rounded-full border-4 border-primary'>
        <div className='w-8 h-8 bg-red-400 translate-x-0 translate-y-2 absolute'></div>
      </div>
    </div>
  );
};

export default WheelSpinner;
