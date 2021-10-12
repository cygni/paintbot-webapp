import React, { useLayoutEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';

import { DefaultLink } from '../common/ui/DefaultLink';
import { Heading1 } from '../common/ui/Heading';
import { Paper, PaperRow } from '../common/ui/Paper';
import introImage1 from '../resources/images/welcome1.png';
import introImage2 from '../resources/images/welcome2.png';

interface YouTubeVideoProps {
  cssHeight: string;
}

const YouTubeVideo = styled.iframe<YouTubeVideoProps>`
  width: calc(100% + 3rem);
  height: ${props => props.cssHeight};
  margin: 0 -1.5rem;

  @media screen and (min-width: 420px) {
    width: 100%;
    margin: 0;
  }
`;

export default function WelcomeScreen() {
  const [videoHeight, setVideoHeight] = useState('0');
  const video = useRef<HTMLIFrameElement>(null);

  useLayoutEffect(() => {
    function updateVideoHeight() {
      const width = video.current?.clientWidth ?? 0;
      setVideoHeight(`${width * 315/560}px`);
    }
    window.addEventListener('resize', updateVideoHeight);
    updateVideoHeight();
    return () => window.removeEventListener('resize', updateVideoHeight);
  }, []);

  return (
    <>
      <Paper>
        <PaperRow>
          <Heading1>Welcome!</Heading1>
        </PaperRow>
        <PaperRow>
          Paintbot is the colorful game where your bot competes with other bots about the board.
        </PaperRow>
        <PaperRow>
          To play, you program your own Paint Bot. Your bot will move across the board, painting it as it goes. The
          winner is the color that covers most of the paper in the end. You can also pick up power-ups that will allow
          you to paint a larger area around you. Look out for holes in the paper though!
        </PaperRow>
        <PaperRow>
          <DefaultLink to={'readme'}>Getting started is really easy.</DefaultLink> Clone an example Paint Bot and get
          going!
        </PaperRow>
        <PaperRow>Here's a video of what gameplay looks like:</PaperRow>
        <PaperRow>
          <YouTubeVideo
            ref={video}
            cssHeight={videoHeight}
            src="https://www.youtube.com/embed/G6M7RpQaInQ"
            title="Paintbot gameplay"
            frameBorder={0}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </PaperRow>
      </Paper>
      <ComicImages>
        <ComicImage src={introImage1} alt="Blue, green, red, yellow..." />
        <ComicImage
          src={introImage2}
          alt="Long ago, all the colors lived together in harmony. Then, everything changed when the red nuance attacked."
        />
      </ComicImages>
    </>
  );
}

const ComicImages = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 1rem;

  @media screen and (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
  }
`;

const ComicImage = styled.img`
  box-shadow: 0 0 2px rgb(0 0 0 / 10%), 0 0 4px rgb(0 0 0 / 10%), 0 0 6px rgb(0 0 0 / 10%);
  width: 100%;
`;
