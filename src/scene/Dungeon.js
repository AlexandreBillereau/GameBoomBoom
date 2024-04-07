import Phaser from "phaser";
import DungeonGenerator from "@mikewesthad/dungeon";
import { Player } from "../entities/player/player";

export default class Dungeon extends Phaser.Scene {
  constructor() {
    super("dungeon");
  }
  preload() {
    this.load.image("tiles", "../assets/Tiles.png");
    Player.preLoad(this);
  }

  update(time, delta) {
    this.player.update();
  }

  create() {
    // Generate a random world
    const dungeon = new DungeonGenerator({
      width: 50,
      height: 50,
      rooms: {
        width: { min: 7, max: 15 },
        height: { min: 7, max: 15 },
        maxRooms: 12,
      },
    });

    // Create a blank tilemap with dimensions matching the dungeon
    const map = this.make.tilemap({
      tileWidth: 48,
      tileHeight: 48,
      width: dungeon.width,
      height: dungeon.height,
    });
    const tileset = map.addTilesetImage("tiles", null, 48, 48, 1, 0); // 1px margin, 2px spacing
    const layer = map.createBlankLayer("Layer 1", tileset);

    // Get a 2D array of tile indices (using -1 to not render empty tiles) and place them into the
    // blank layer
    const mappedTiles = dungeon.getMappedTiles({
      empty: -1,
      floor: 2,
      door: 2,
      wall: 0,
    });
    layer.putTilesAt(mappedTiles, 0, 0);
    layer.setCollision(0); // We only need one tile index (the walls) to be colliding for now

    // Place the player in the center of the map. This works because the Dungeon generator places
    // the first room in the center of the map.
    this.player = new Player(
      this,
      map.widthInPixels / 2,
      map.heightInPixels / 2
    );
    this.player.entity.anims.play("walk");

    // Watch the player and layer for collisions, for the duration of the scene:
    this.physics.add.collider(this.player.entity, layer);

    // Phaser supports multiple cameras, but you can access the default camera like this:
    const camera = this.cameras.main;
    camera.startFollow(this.player.entity);
    camera.setBounds(0, 0, map.widthInPixelsdas, map.heightInPixelsdas);
  }
}