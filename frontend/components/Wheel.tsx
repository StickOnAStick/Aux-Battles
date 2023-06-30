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
  const [screenWidth, setScreenWidth] = useState<number>(0);

  useEffect(() => {
    if (spin) {
      const numberOfSlices = options.length;
      const degreesPerSlice = 360 / numberOfSlices;
      const targetRotation =
        360 * 3 - (winningIndex * degreesPerSlice + degreesPerSlice / 2);
      setRotation(targetRotation);
    }
  }, [spin, options, winningIndex]);

  useEffect(()=>{
    setScreenWidth(window.innerWidth);
  },[])

  const screenSize = screenWidth > 550 ? '600px' : '350px'
  const innerCircleSize = screenWidth > 550 ? ' w-20 h-20 ' : ' w-12 h-12 ';
  const arrowSize = screenWidth > 550 ? ' w-12 h-8 ' : ' w-8 h-6 ';
  const arrowPosition = screenWidth > 550 ? ' translate-x-[3rem] translate-y-[1.25rem] ' : ' translate-x-[1.5rem] translate-y-[0.4rem] '

  const wheelStyles: CSSProperties = {
    width: screenSize,
    height: screenSize,
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
    bottom: '44%',
    left: '43.5%',
    transformOrigin: '0 100%',
  }

  const arrowStyle: CSSProperties = {
    clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%',
    
  }

  return (
    <>
        <div style={centerStyles} className={innerCircleSize + ' bg-base-300 rounded-full border-4 border-primary'}>
            <div style={arrowStyle} className={ arrowSize + arrowPosition + ' bg-base-300 absolute border-r-4 border-primary'}></div>
        </div>
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
            width: screenWidth > 550 ? '170px' : '50px',
            textAlign: 'end',
            transform: `rotate(${rotation + degreesPerSlice/2}deg) translateX(100px)`,
            transformOrigin: '0 100%',
            color: 'white',
            fontSize: screenWidth > 550 ? '1rem':'0.55rem',
            };
            return (
            <div key={index} style={textStyles}>{option}</div>
            );
        })}
        
        </div>
    </>
  );
};

export default WheelSpinner;
