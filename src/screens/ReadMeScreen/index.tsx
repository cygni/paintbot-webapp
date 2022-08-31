import React from 'react';

import { Heading1, Heading2 } from '../../components/Heading';
import { Paper, PaperHeadingRow, PaperRow } from '../../components/Paper';

export default function ReadMeScreen() {
  return (
    <Paper>
      <PaperRow>
        <Heading1>Getting started</Heading1>
      </PaperRow>
      <PaperRow>
        Your mission is to write the best Paint Bot and survive within the game world. We have prepared bindings in
        multiple languages for you to make it really easy to get started. All the boring stuff concerning server-client
        communication, message parsing and event handling is already implemented.
      </PaperRow>
      <PaperHeadingRow>
        <Heading2>General principles</Heading2>
      </PaperHeadingRow>
      <PaperRow>
        The game progresses through Game Ticks. For each Game Tick participating Paint Bots have to choose an action
        (and they have to do it fast, response is expected within 250ms). Actions are defined by a direction to move the
        bot in. A bot head may move UP, DOWN, RIGHT or LEFT. A bot may also use a power-up to EXPLODE and cover a larger
        area around it in paint.
      </PaperRow>
      <PaperRow>
        On every Game Tick each Paint Bot receives the current Map. The map contains the positions of all the objects in
        the map.
      </PaperRow>
      <PaperHeadingRow>
        <Heading2>Language bindings</Heading2>
      </PaperHeadingRow>
      <PaperRow>
        Below are listed the currently implemented (and up to date) language bindings. Each project has a Readme file
        that explains how to get going.
        <ul>
          <li>
            <a href="https://github.com/cygni/paintbot-client-java">Java</a>
          </li>
          <li>
            <a href="https://github.com/cygni/paintbot-client-go">Go</a>
          </li>
          <li>
            <a href="https://github.com/cygni/paintbot-client-csharp">C#</a>
          </li>
          <li>
            <a href="https://github.com/cygni/paintbot-client-js">JavaScript</a>
          </li>
        </ul>
      </PaperRow>
    </Paper>
  );
}
