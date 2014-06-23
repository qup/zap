import { GameState } from './state';
import { GameLoadState } from './load';

import { GameAction, GameAssetLoader } from '../';
import { GameKeyTrigger } from '../triggers';
import { Stage, TileActor, SpriteActor } from '../actors';

import { Level, Unit, Cell, Terrain } from '../../world';
import { MoveAbility, StopAbility, EffectAbility } from '../../world/abilities';
import { EffectBehavior, SpawnBehavior } from '../../world/behaviors/';
import { ApplyForceEffect, LaunchMissileEffect } from '../../world/effects/';

var move = new MoveAbility();
move.id = 'move';

var stop = new StopAbility();
stop.id = 'stop';

var jump = new EffectAbility();
jump.id = 'jump';

jump.effect = new ApplyForceEffect();
jump.effect.amount = { x: 0, y: -350 };
jump.cooldown.duration.use = 0.25;

var fire = new EffectAbility();
fire.id = 'fire';
fire.effect = new LaunchMissileEffect();
fire.cooldown.duration.use = 0.025;
fire.effect.ammo = 'bullet';

export class GamePlayState extends GameState {
   constructor() {
      super();

      this.actions = {
         'move-left': new GameAction('Move Left', new GameKeyTrigger(37)),
         'move-right': new GameAction('Move Right', new GameKeyTrigger(39)),
         'jump': new GameAction('Jump', new GameKeyTrigger(38)),
         'fire': new GameAction('Fire', new GameKeyTrigger(32)),
      };

      this.level = null;
   }

   initializeLevel() {
      // Create the level.
      var level = new Level();

      // Register level event listeners.
      var events = ['TerrainChanged', 'UnitInserted'];

      for (var i = 0; i < events.length; i++) {
         var event = events[i];
         level.addEventListener(event, this.handleEvent.bind(this));
      }

      var json = this.assets.get('levels/tech.json');

      // Create the terrain described.
      var rows = json.terrain.rows;
      var columns = json.terrain.columns;
      var cells = new Array(2);

      // Collides with nothing.
      cells[0] = new Cell();
      cells[0].collision.category = 0;
      cells[0].collision.mask = 0;

      // Collides with everything.
      cells[1] = new Cell();
      cells[1].collision.category = ~0;
      cells[1].collision.mask = ~0;

      var data = json.terrain.data;
      level.terrain = new Terrain(columns, rows, cells, data);

      // Register units.
      level.registerUnit('player', {
      });

      var player = level.createUnit('player');
      player.collision.group = -1;
      player.addAbility(fire);

      player.move(128, 0);

      var spawner = level.createUnit('player');
      spawner.addBehavior(new SpawnBehavior());

      spawner.id = undefined;
      spawner.mass = 0;
      spawner.move(128, 5);

      level.insertUnit(player);
      level.insertUnit(spawner);

      this.level = level;
      this.player = player;
   }

   activate() {
      if (this.assets == null) {
         this.assets = new GameAssetLoader();

         this.assets.queueSpriteSheet('spritesheets/bullet.json');
         this.assets.queueSpriteSheet('spritesheets/player.json');
         this.assets.queueSpriteSheet('spritesheets/enemy.json');
         this.assets.queueTileSheet('tilesheets/tech.json');
         this.assets.queueJSON('levels/tech.json');

         this.game.pushState(new GameLoadState(this.assets));
      } else {
         // Create the stage.
         var stage = new Stage();
         stage.display = this.display;

         this.stage = stage;

         this.initializeLevel();
      }

      super();
   }

   handleEvent(event) {
      var stage = this.stage;

      // TODO the ruleset should be moved into data.
      if (event.type == 'TerrainChanged') {
         var tileSheet = this.assets.get('tilesheets/tech.json');

         var actor = new TileActor(tileSheet);

         actor.data = event.terrain.data;
         actor.columns = event.terrain.columns;
         actor.rows = event.terrain.rows;

         stage.prependChild(actor);
      } else if (event.type == 'UnitInserted') {
         var unit = event.unit;
         var path = 'spritesheets/' + unit.id + '.json';

         var spriteSheet = this.assets.get(path);
         if (!spriteSheet) {
            console.info("couldn't find spriteSheet " + path);
            return;
         }

         var actor = new SpriteActor(spriteSheet);
         actor.setAnimationById('idle');
         actor.position = unit.position;

         unit.addEventListener('UnitDied', function() {
            stage.removeChild(actor);
         });

         unit.addEventListener('UnitRemoved', function() {
            stage.removeChild(actor);
         });

         event.unit.addEventListener('UnitAbility', function(ev) {
            if (ev.ability.name == 'move') {
               if (unit.velocity.x > 0) {
                  actor.scale.x = 1;
               } else {
                  actor.scale.x = -1;
               }

               actor.setAnimationById('walk');
            } else if (ev.ability.name == 'stop') {
               actor.setAnimationById('idle');
            }
         });

         stage.appendChild(actor);
      }

      for (var key in this.actions) {
         var action = this.actions[key];
         action.handleEvent(event);
      }

      var player = this.player;
      if (player) {
         if (this.actions['move-left'].value) {
            player.performAbility(move, move.move, { x: -1, y: 0 });
         } else if (this.actions['move-right'].value) {
            player.performAbility(move, move.move, { x: 1, y: 0 });
         } else {
            player.performAbility(stop, stop.stop);
         }

         if (this.actions['jump'].value) {
            player.performAbility(jump, jump.execute, player);
         }

         if (this.actions['fire'].value) {
            var v = { x: Math.cos(player.angle), y: 0 };
            player.performAbility(fire, fire.execute, v);
         }
      }
   }

   evaluate(deltaTime) {
      this.level.evaluate(deltaTime);
   }

   present(time) {
      this.stage.present(time);
   }
}
