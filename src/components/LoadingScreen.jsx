import { useEffect, useState } from 'react';
import MaskedHeading from './ui/MaskedHeading';
import kali from '../assets/HS/web.svg';

export default function LoadingScreen({ onDone }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setExiting(true), 2300);
    const t2 = setTimeout(onDone, 3200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <div className={`loading-screen ${exiting ? 'loading-screen--exit' : ''}`}>
      <div className="loading-screen__inner">
        <MaskedHeading
          className="loading-screen__masked"
          text="VOID SOCIETY"
          mediaType="image"
          src={kali}
          fillScale={1.2}
          parallax={0}
          drift={0}
          brightness={1}
          saturation={1}
          reveal="rise"
          trigger="mount"
          align="center"
          weight={800}
          tracking={-0.04}
          lineHeight={1.02}
          textScale={0.13}
          duration={1.2}
          stagger={0.12}
        />
      </div>
    </div>
  );
}
