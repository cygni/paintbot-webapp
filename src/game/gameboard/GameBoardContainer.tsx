import React from 'react';

import { Character, Coordinate, GameBoardState } from '../type';

interface Props {
  gameBoardState: GameBoardState;
  explosionRange: number;
}

enum Direction {
  UP,
  RIGHT,
  DOWN,
  LEFT,
}

export default class GameBoardContainer extends React.Component<Props> {
  private readonly boardWidth: number;
  private readonly boardHeight: number;
  private readonly tileSize: number;
  private readonly canvasRef = React.createRef<HTMLCanvasElement>();
  private updateInterval?: number;
  private fractionOfTick = 0;

  constructor(props: Props) {
    super(props);
    const { width, height } = this.props.gameBoardState;
    this.tileSize = this.calculateTileSize(width);
    this.boardWidth = width * this.tileSize;
    this.boardHeight = height * this.tileSize;
  }

  private clearCanvas(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, this.boardWidth, this.boardHeight);
  }

  private renderBackground(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'rgb(0,7,52)';
    ctx.fillRect(0, 0, this.boardWidth, this.boardHeight);
  }

  private renderTiles(ctx: CanvasRenderingContext2D) {
    const { tiles } = this.props.gameBoardState;
    tiles.forEach(tile => {
      tile.coordinates.forEach(coordinate => {
        const boardCoordinate = this.getTileBoardCoordinate(coordinate);
        ctx.fillStyle = tile.colour;
        ctx.fillRect(boardCoordinate.x, boardCoordinate.y, this.tileSize, this.tileSize);
      });
    });
  }

  private renderNewTiles(ctx: CanvasRenderingContext2D, fractionOfTick: number) {
    const { newTiles, characters } = this.props.gameBoardState;
    newTiles.forEach(tiles => {
      tiles.coordinates.forEach(coordinate => {
        if (!characters.find(character => this.sameCoordinates(coordinate, character.coordinate))) {
          this.renderNewTile(ctx, fractionOfTick, tiles.colour, coordinate);
        }
      });
    });
  }

  private renderNewTile(ctx: CanvasRenderingContext2D, fractionOfTick: number, colour: string, coordinate: Coordinate) {
    const boardCoordinate = this.getCircleBoardCoordinate(coordinate);
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.arc(boardCoordinate.x, boardCoordinate.y, (this.tileSize / 2) * fractionOfTick, 0, Math.PI * 2, true);
    ctx.fill();
  }

  private renderCharacters(ctx: CanvasRenderingContext2D, fractionOfTick: number) {
    const { characters, prevCharacters } = this.props.gameBoardState;
    characters.forEach(character => {
      const prevCharacter = prevCharacters.find(prevChar => prevChar.id === character.id);
      this.renderCharacter(ctx, fractionOfTick, character, prevCharacter || character);
    });
  }

  private renderCharacter(
    ctx: CanvasRenderingContext2D,
    fractionOfTick: number,
    character: Character,
    prevCharacter: Character,
  ) {
    const direction = this.getDirection(character.coordinate, prevCharacter.coordinate);
    const boardCoordinate = this.getCharacterBoardCoordinate(
      character.coordinate,
      prevCharacter.coordinate,
      fractionOfTick,
    );
    ctx.fillStyle = character.colour;
    ctx.strokeStyle = 'black';
    if (character.carryingPowerUp) {
      ctx.beginPath();
      ctx.arc(
        boardCoordinate.x,
        boardCoordinate.y,
        this.tileSize * 0.4 + this.tileSize * 0.2 * (1 - Math.abs(fractionOfTick - 0.5)),
        0,
        Math.PI * 2,
        true,
      );
      ctx.fill();
      ctx.stroke();
    } else if (prevCharacter.carryingPowerUp) {
      ctx.beginPath();
      ctx.arc(
        boardCoordinate.x,
        boardCoordinate.y,
        this.tileSize / 2 + fractionOfTick * this.tileSize * this.props.explosionRange * 0.75,
        0,
        Math.PI * 2,
        true,
      );
      ctx.fill();
      ctx.beginPath();
      ctx.arc(boardCoordinate.x, boardCoordinate.y, this.tileSize / 2, 0, Math.PI * 2, true);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(boardCoordinate.x, boardCoordinate.y, this.tileSize / 2, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.stroke();
    }

    if (character.stunned) {
      this.renderStunnedEyes(ctx, direction, boardCoordinate);
      this.renderShine(ctx, direction, boardCoordinate);
      this.renderStunnedStars(ctx, boardCoordinate, fractionOfTick);
    } else {
      this.renderNormalEyes(ctx, direction, boardCoordinate);
      this.renderShine(ctx, direction, boardCoordinate);
    }
  }

  private renderShine(ctx: CanvasRenderingContext2D, direction: Direction, boardCoordinate: Coordinate) {
    ctx.fillStyle = 'white';
    ctx.beginPath();
    switch (direction) {
      case Direction.DOWN:
        ctx.arc(boardCoordinate.x, boardCoordinate.y - this.tileSize / 3, this.tileSize / 10, 0, Math.PI * 2, true);
        break;
      case Direction.UP:
        ctx.arc(boardCoordinate.x, boardCoordinate.y + this.tileSize / 3, this.tileSize / 10, 0, Math.PI * 2, true);
        break;
      case Direction.LEFT:
        ctx.arc(boardCoordinate.x + this.tileSize / 3, boardCoordinate.y, this.tileSize / 10, 0, Math.PI * 2, true);
        break;
      case Direction.RIGHT:
        ctx.arc(boardCoordinate.x - this.tileSize / 3, boardCoordinate.y, this.tileSize / 10, 0, Math.PI * 2, true);
        break;
    }
    ctx.fill();
  }

  private renderNormalEyes(ctx: CanvasRenderingContext2D, direction: Direction, boardCoordinate: Coordinate) {
    ctx.fillStyle = 'black';
    switch (direction) {
      case Direction.DOWN:
        ctx.beginPath();
        ctx.arc(
          boardCoordinate.x - this.tileSize / 4,
          boardCoordinate.y + this.tileSize / 4,
          this.tileSize / 12,
          0,
          Math.PI * 2,
          true,
        );
        ctx.fill();
        ctx.beginPath();
        ctx.arc(
          boardCoordinate.x + this.tileSize / 4,
          boardCoordinate.y + this.tileSize / 4,
          this.tileSize / 12,
          0,
          Math.PI * 2,
          true,
        );
        ctx.fill();
        break;
      case Direction.UP:
        ctx.beginPath();
        ctx.arc(
          boardCoordinate.x - this.tileSize / 4,
          boardCoordinate.y - this.tileSize / 4,
          this.tileSize / 12,
          0,
          Math.PI * 2,
          true,
        );
        ctx.fill();
        ctx.beginPath();
        ctx.arc(
          boardCoordinate.x + this.tileSize / 4,
          boardCoordinate.y - this.tileSize / 4,
          this.tileSize / 12,
          0,
          Math.PI * 2,
          true,
        );
        ctx.fill();
        break;
      case Direction.LEFT:
        ctx.beginPath();
        ctx.arc(
          boardCoordinate.x - this.tileSize / 4,
          boardCoordinate.y - this.tileSize / 4,
          this.tileSize / 12,
          0,
          Math.PI * 2,
          true,
        );
        ctx.fill();
        ctx.beginPath();
        ctx.arc(
          boardCoordinate.x - this.tileSize / 4,
          boardCoordinate.y + this.tileSize / 4,
          this.tileSize / 12,
          0,
          Math.PI * 2,
          true,
        );
        ctx.fill();
        break;
      case Direction.RIGHT:
        ctx.beginPath();
        ctx.arc(
          boardCoordinate.x + this.tileSize / 4,
          boardCoordinate.y - this.tileSize / 4,
          this.tileSize / 12,
          0,
          Math.PI * 2,
          true,
        );
        ctx.fill();
        ctx.beginPath();
        ctx.arc(
          boardCoordinate.x + this.tileSize / 4,
          boardCoordinate.y + this.tileSize / 4,
          this.tileSize / 12,
          0,
          Math.PI * 2,
          true,
        );
        ctx.fill();
        break;
    }
  }

  private renderStunnedEyes(ctx: CanvasRenderingContext2D, direction: Direction, boardCoordinate: Coordinate) {
    ctx.strokeStyle = 'black';
    switch (direction) {
      case Direction.DOWN:
        ctx.beginPath();
        ctx.moveTo(boardCoordinate.x - this.tileSize / 3, boardCoordinate.y + this.tileSize / 3);
        ctx.lineTo(boardCoordinate.x - this.tileSize / 6, boardCoordinate.y + this.tileSize / 6);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(boardCoordinate.x - this.tileSize / 3, boardCoordinate.y + this.tileSize / 6);
        ctx.lineTo(boardCoordinate.x - this.tileSize / 6, boardCoordinate.y + this.tileSize / 3);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(boardCoordinate.x + this.tileSize / 3, boardCoordinate.y + this.tileSize / 3);
        ctx.lineTo(boardCoordinate.x + this.tileSize / 6, boardCoordinate.y + this.tileSize / 6);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(boardCoordinate.x + this.tileSize / 3, boardCoordinate.y + this.tileSize / 6);
        ctx.lineTo(boardCoordinate.x + this.tileSize / 6, boardCoordinate.y + this.tileSize / 3);
        ctx.stroke();
        break;
      case Direction.UP:
        ctx.beginPath();
        ctx.moveTo(boardCoordinate.x - this.tileSize / 3, boardCoordinate.y - this.tileSize / 3);
        ctx.lineTo(boardCoordinate.x - this.tileSize / 6, boardCoordinate.y - this.tileSize / 6);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(boardCoordinate.x - this.tileSize / 3, boardCoordinate.y - this.tileSize / 6);
        ctx.lineTo(boardCoordinate.x - this.tileSize / 6, boardCoordinate.y - this.tileSize / 3);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(boardCoordinate.x + this.tileSize / 3, boardCoordinate.y - this.tileSize / 3);
        ctx.lineTo(boardCoordinate.x + this.tileSize / 6, boardCoordinate.y - this.tileSize / 6);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(boardCoordinate.x + this.tileSize / 3, boardCoordinate.y - this.tileSize / 6);
        ctx.lineTo(boardCoordinate.x + this.tileSize / 6, boardCoordinate.y - this.tileSize / 3);
        ctx.stroke();
        break;
      case Direction.LEFT:
        ctx.beginPath();
        ctx.moveTo(boardCoordinate.x - this.tileSize / 3, boardCoordinate.y - this.tileSize / 3);
        ctx.lineTo(boardCoordinate.x - this.tileSize / 6, boardCoordinate.y - this.tileSize / 6);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(boardCoordinate.x - this.tileSize / 3, boardCoordinate.y - this.tileSize / 6);
        ctx.lineTo(boardCoordinate.x - this.tileSize / 6, boardCoordinate.y - this.tileSize / 3);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(boardCoordinate.x - this.tileSize / 3, boardCoordinate.y + this.tileSize / 3);
        ctx.lineTo(boardCoordinate.x - this.tileSize / 6, boardCoordinate.y + this.tileSize / 6);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(boardCoordinate.x - this.tileSize / 3, boardCoordinate.y + this.tileSize / 6);
        ctx.lineTo(boardCoordinate.x - this.tileSize / 6, boardCoordinate.y + this.tileSize / 3);
        ctx.stroke();
        break;
      case Direction.RIGHT:
        ctx.beginPath();
        ctx.moveTo(boardCoordinate.x + this.tileSize / 3, boardCoordinate.y - this.tileSize / 3);
        ctx.lineTo(boardCoordinate.x + this.tileSize / 6, boardCoordinate.y - this.tileSize / 6);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(boardCoordinate.x + this.tileSize / 3, boardCoordinate.y - this.tileSize / 6);
        ctx.lineTo(boardCoordinate.x + this.tileSize / 6, boardCoordinate.y - this.tileSize / 3);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(boardCoordinate.x + this.tileSize / 3, boardCoordinate.y + this.tileSize / 3);
        ctx.lineTo(boardCoordinate.x + this.tileSize / 6, boardCoordinate.y + this.tileSize / 6);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(boardCoordinate.x + this.tileSize / 3, boardCoordinate.y + this.tileSize / 6);
        ctx.lineTo(boardCoordinate.x + this.tileSize / 6, boardCoordinate.y + this.tileSize / 3);
        ctx.stroke();
        break;
    }
  }

  private renderStunnedStars(ctx: CanvasRenderingContext2D, boardCoordinate: Coordinate, fractionOfTick: number) {
    const { worldTick } = this.props.gameBoardState;
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(
      boardCoordinate.x + this.tileSize / 3,
      boardCoordinate.y,
      (this.tileSize / 4) * (((2 + worldTick + fractionOfTick) % 5) / 5),
      0,
      Math.PI * 2,
      true,
    );
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(
      boardCoordinate.x - this.tileSize / 3,
      boardCoordinate.y - this.tileSize / 3,
      (this.tileSize / 4) * (((worldTick + fractionOfTick) % 5) / 5),
      0,
      Math.PI * 2,
      true,
    );
    ctx.stroke();
    ctx.lineWidth = 1;
  }

  private sameCoordinates(c1: Coordinate, c2: Coordinate): boolean {
    return c1.x === c2.x && c1.y === c2.y;
  }

  private renderPowerUps(ctx: CanvasRenderingContext2D, fractionOfTick: number) {
    const { powerUpCoordinates, worldTick } = this.props.gameBoardState;
    powerUpCoordinates.forEach(powerUpCoordinate => {
      const boardCoordinate = this.getCircleBoardCoordinate(powerUpCoordinate);
      const currentRadiant = (((worldTick % 10) + fractionOfTick) / 10) * Math.PI * 2;
      const r = Math.sin(currentRadiant) * 100 + 155;
      const g = Math.cos(currentRadiant) * 100 + 155;
      const b = Math.tan(currentRadiant) * 100 + 155;
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.strokeStyle = 'black';
      ctx.beginPath();
      ctx.arc(boardCoordinate.x, boardCoordinate.y, this.tileSize / 4, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.stroke();
    });
  }

  private getCharacterBoardCoordinate(
    coordinate: Coordinate,
    prevCoordinate: Coordinate,
    fractionOfTick: number,
  ): Coordinate {
    return {
      x: (prevCoordinate.x + (coordinate.x - prevCoordinate.x) * fractionOfTick) * this.tileSize + this.tileSize / 2,
      y: (prevCoordinate.y + (coordinate.y - prevCoordinate.y) * fractionOfTick) * this.tileSize + this.tileSize / 2,
    };
  }

  private getCircleBoardCoordinate(coordinate: Coordinate): Coordinate {
    return {
      x: coordinate.x * this.tileSize + this.tileSize / 2,
      y: coordinate.y * this.tileSize + this.tileSize / 2,
    };
  }

  private getTileBoardCoordinate(coordinate: Coordinate): Coordinate {
    return {
      x: coordinate.x * this.tileSize,
      y: coordinate.y * this.tileSize,
    };
  }

  private calculateTileSize(width: number) {
    return Math.round(window.innerWidth / width / 1.7);
  }

  private draw(fractionOfTick: number) {
    this.fractionOfTick += fractionOfTick;
    this.fractionOfTick = Math.min(this.fractionOfTick, 1);
    const canvas = this.canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      this.clearCanvas(ctx);
      this.renderBackground(ctx);
      this.renderTiles(ctx);
      this.renderNewTiles(ctx, this.fractionOfTick);
      this.renderCharacters(ctx, this.fractionOfTick);
      this.renderPowerUps(ctx, this.fractionOfTick);
    }
  }

  componentDidMount() {
    const canvas = this.canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      this.renderBackground(ctx);
      this.renderTiles(ctx);
      this.renderCharacters(ctx, 1);
      this.renderPowerUps(ctx, 1);
    }
  }

  componentDidUpdate() {
    const fps = 30;
    const timeInMsPerFrame = 1000 / fps;
    const { timeInMsPerTick } = this.props.gameBoardState;
    const fractionOfTick = timeInMsPerFrame / timeInMsPerTick;
    if (this.updateInterval !== undefined) {
      this.fractionOfTick = 0;
      clearInterval(this.updateInterval);
    }
    this.updateInterval = setInterval(() => {
      this.draw(fractionOfTick);
    }, timeInMsPerFrame);
  }

  componentWillUnmount() {
    if (this.updateInterval !== undefined) {
      clearInterval(this.updateInterval);
    }
  }

  getDirectionName(direction: Direction) {
    switch (direction) {
      case Direction.DOWN:
        return 'down';
      case Direction.LEFT:
        return 'left';
      case Direction.UP:
        return 'up';
      case Direction.RIGHT:
        return 'right';
    }
  }

  getDirection(coordinate: Coordinate, prevCoordinate: Coordinate): Direction {
    if (coordinate.x > prevCoordinate.x) {
      return Direction.RIGHT;
    } else if (coordinate.x < prevCoordinate.x) {
      return Direction.LEFT;
    } else if (coordinate.y < prevCoordinate.y) {
      return Direction.UP;
    } else {
      return Direction.DOWN;
    }
  }

  getRotation(direction: Direction): number {
    switch (direction) {
      case Direction.DOWN:
        return 0;
      case Direction.LEFT:
        return Math.PI * 0.5;
      case Direction.UP:
        return Math.PI;
      case Direction.RIGHT:
        return Math.PI * 1.5;
    }
  }

  getPaintRotation(direction: Direction): number {
    switch (direction) {
      case Direction.UP:
        return 0;
      case Direction.RIGHT:
        return Math.PI * 0.5;
      case Direction.DOWN:
        return Math.PI;
      case Direction.LEFT:
        return Math.PI * 1.5;
    }
  }

  render() {
    return (
      <canvas ref={this.canvasRef} width={this.boardWidth} height={this.boardHeight}>
        Game
      </canvas>
    );
  }
}
