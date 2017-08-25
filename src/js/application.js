/**
 * Conway's Game of Life
 * Implemented in JavaScript on a HTML5 Canvas.
 * @author S. Bischoff <info@bischoff.media>
 */

+(function(undefined){

  /**
   * Constructor
   */
  ConwaysCanvas = function(sCanvasID, oConfig){
    var oSelf = this;

    oSelf.oConfig = oConfig || {
      nCellSize: 10,
      nOffset: .5,
      iRandomShapes: 30, // more blank space if bigger than actual defined shapes
      iRandomShapeMaxX: 5,
      iRandomShapeMaxY: 5,
      sForegroundColor: 'rgba(0,255,0,1)',
      nLineWidth: 1
    };

    oSelf.oCanvas = document.getElementById(sCanvasID).getContext('2d');
    oSelf.nCanvasHeight = oSelf.oCanvas.canvas.clientHeight;
    oSelf.nCanvasWidth = oSelf.oCanvas.canvas.clientWidth;
    oSelf.nCellSize = oSelf.oConfig.nCellSize;
    oSelf.nOffset = oSelf.oConfig.nOffset;
    oSelf.nWeight = oSelf.oConfig.nWeight;

    oSelf.oCanvas.strokeStyle = oSelf.oConfig.sForegroundColor;
    oSelf.oCanvas.fillStyle = oSelf.oConfig.sForegroundColor;
    oSelf.oCanvas.lineWidth = oSelf.oConfig.nLineWidth;

    oSelf.aMap = [];
    oSelf.aNewMap = [];
    oSelf.aMapInitialized = []; // to prevent overriding

    oSelf.nMapHeight = Math.floor(oSelf.nCanvasHeight/oSelf.nCellSize);
    oSelf.nMapWidth = Math.floor(oSelf.nCanvasWidth/oSelf.nCellSize)

    for (var i = oSelf.nMapWidth; i >= 0; i--) {
      oSelf.aMap[i] = new Array(oSelf.nMapHeight)
      oSelf.aNewMap[i] = new Array(oSelf.nMapHeight)
    }

    for (var i = oSelf.aMap.length - 1; i >= 0; i--) {
      if (!oSelf.aMapInitialized[i]) {
          oSelf.aMapInitialized[i] = []; // dynamic initialization (otherwise it had to be initialized in another loop)
      }
      for (var j = oSelf.aMap[i].length - 1; j >= 0; j--) {
        if (!(oSelf.aMapInitialized[i][j])) { // make sure the coordinates haven't already been initialized
            oSelf.initialize(oSelf.aMap, i, j);
        }
      }
    }

    return oSelf;
  };

  /**
   * ConwaysCanvas.prototype.initialize
   *
   * @description Initializes a shape at given coordinates
   *
   * @return {*} Canvay
   */
  ConwaysCanvas.prototype.initialize = function(aMap, x, y){
    var oSelf = this,
        iShape = 0,
        aShape = [];

    iShape = Math.round(Math.random() * oSelf.oConfig.iRandomShapes); // bigger iRandomShapes = more free space
    aShape = oSelf.getShape(iShape);

    for (var i = aShape.length - 1; i >= 0; i--) {
      for (var j = aShape[i].length - 1; j >= 0; j--) {
        if (aMap[x-i] && !(oSelf.aMapInitialized[x-i] && oSelf.aMapInitialized[x-i][y-j])) {
          aMap[x-i][y-j] = aShape[i][j];
        }
        if (!oSelf.aMapInitialized[x-i]) {
          oSelf.aMapInitialized[x-i] = [];
        }
        oSelf.aMapInitialized[x-i][y-j] = true;
      }
    }

    return oSelf;
  }

  /**
   * ConwaysCanvas.prototype.reset
   *
   * @description Resets the canvas for redrawing.
   *
   * @return {*} Canvay
   */
  ConwaysCanvas.prototype.reset = function(){
    var oSelf = this,
        oCanvas = oSelf.oCanvas;

    oCanvas.clearRect(0, 0, oSelf.nCanvasWidth, oSelf.nCanvasHeight);

    return oSelf;
  }

  /**
   * ConwaysCanvas.prototype.iterateMap
   *
   * @description Iterates over the map, setting living state of each cell
   *
   * @return {*} Canvay
   */
  ConwaysCanvas.prototype.iterateMap = function(callback){
    var oSelf = this;

    callback = callback || function(bValue, nX, nY){ return bValue; };

    for (var i = oSelf.aMap.length - 1; i >= 0; i--) {
      for (var j = oSelf.aMap[i].length - 1; j >= 0; j--) {
        oSelf.aNewMap[i][j] = callback(oSelf.aMap[i][j], i, j);
      }
    }

    oSelf.aMap = JSON.parse(JSON.stringify(oSelf.aNewMap));

    return oSelf;
  };

  /**
   * ConwaysCanvas.prototype.drawCircleAt
   *
   * @description Draws a circle at the given coordinates.
   *
   * @return {*} Canvay
   */
  ConwaysCanvas.prototype.drawCircleAt = function(nXPos, nYPos){
    var oSelf = this,
        oCanvas = oSelf.oCanvas,
        nXPos = nXPos * oSelf.nCellSize + oSelf.nCellSize/2,
        nYPos = nYPos * oSelf.nCellSize + oSelf.nCellSize/2;

    oCanvas.beginPath();
    oCanvas.arc(nXPos, nYPos, oSelf.nCellSize/2, 0, 2*Math.PI);
    oCanvas.fill();

    return oSelf;
  };

  /**
   * ConwaysCanvas.prototype.setup
   *
   * @description Bootstraps the logic.
   *
   * @return {*} Canvay
   */
  ConwaysCanvas.prototype.setup = function(){
    var oSelf = this;

    oSelf.reset();
    oSelf.drawGrid();

    return oSelf;
  };

  /**
   * ConwaysCanvas.prototype.drawGrid
   *
   * @description Draws the given grid.
   *
   * @return {*} Canvay
   */
  ConwaysCanvas.prototype.drawGrid = function(){
    var oSelf = this,
        oCanvas = oSelf.oCanvas;

    for (
      var nPointer = 0;
      nPointer < Math.round(oSelf.nCanvasHeight/oSelf.nCellSize);
      nPointer++
    ) {
        var nCurrentPosition = nPointer * oSelf.nCellSize - oSelf.nOffset;
        oCanvas.beginPath();
        oCanvas.moveTo(oSelf.nOffset, nCurrentPosition);
        oCanvas.lineTo(oSelf.nCanvasWidth, nCurrentPosition);
        oCanvas.stroke();
    }

    for (
      var nPointer = 0;
      nPointer < Math.round(oSelf.nCanvasWidth/oSelf.nCellSize);
      nPointer++
    ) {
        var nCurrentPosition = nPointer * oSelf.nCellSize - oSelf.nOffset;
        oCanvas.beginPath();
        oCanvas.moveTo(nCurrentPosition, oSelf.nOffset);
        oCanvas.lineTo(nCurrentPosition, oSelf.nCanvasHeight);
        oCanvas.stroke();
    }

    return oSelf;
  };

  /**
   * ConwaysCanvas.prototype.countNeighbours
   *
   * @description Counts and returns the amount of neighbours for a given cell.
   *
   * @return {Number} nNeighbourCount
   */
  ConwaysCanvas.prototype.countNeighbours = function(nXPos, nYPos){
    var oSelf = this,
        aMap = oSelf.aMap,
        nNeighbourCount = 0;

    nNeighbourCount += (aMap[nXPos-1] && aMap[nXPos-1][nYPos-1]) ? 1 : 0;
    nNeighbourCount += (aMap[nXPos-1] && aMap[nXPos-1][nYPos]) ? 1 : 0;
    nNeighbourCount += (aMap[nXPos-1] && aMap[nXPos-1][nYPos+1]) ? 1 : 0;
    nNeighbourCount += (aMap[nXPos] && aMap[nXPos][nYPos-1]) ? 1 : 0;
    nNeighbourCount += (aMap[nXPos] && aMap[nXPos][nYPos+1]) ? 1 : 0;
    nNeighbourCount += (aMap[nXPos+1] && aMap[nXPos+1][nYPos-1]) ? 1 : 0;
    nNeighbourCount += (aMap[nXPos+1] && aMap[nXPos+1][nYPos]) ? 1 : 0;
    nNeighbourCount += (aMap[nXPos+1] && aMap[nXPos+1][nYPos+1]) ? 1 : 0;

    return nNeighbourCount;
  };

  /**
   * ConwaysCanvas.prototype.checkLivingState
   *
   * @description Checks whether a cell is alive or dead, draws a circle if it's alive.
   *
   * @return {Boolean} bIsAlive
   */
  ConwaysCanvas.prototype.checkLivingState = function(bIsAlive, nXPos, nYPos){
    var oSelf = this,
        nNeighbourCount = oSelf.countNeighbours(nXPos, nYPos);

    if (nNeighbourCount < 2) {
      bIsAlive = false;
    } else if (!bIsAlive && nNeighbourCount === 3) {
      bIsAlive = true;
    } else if (bIsAlive && (nNeighbourCount === 3 || nNeighbourCount === 2)) {
      bIsAlive = true;
    } else if (nNeighbourCount > 3) {
      bIsAlive = false;
    };

    if (bIsAlive) {
      oSelf.drawCircleAt(nXPos, nYPos);
    }

    return bIsAlive;
  };

  /**
   * ConwaysCanvas.prototype.play
   *
   * @description Plays one round of CGoL.
   *
   * @return {*} Canvay
   */
  ConwaysCanvas.prototype.play = function(){
    var oSelf = this;

    oSelf.reset();
    oSelf.drawGrid();
    oSelf.iterateMap(function(bIsAlive, nXPos, nYPos){
      return oSelf.checkLivingState(bIsAlive, nXPos, nYPos);
    });

    return oSelf;
  }

  /**
   * ConwaysCanvas.prototype.getRandomShape
   *
   * @description Returns a random shape array by given or random dimensions
   *
   * @return [*] Array
   */
  ConwaysCanvas.prototype.getRandomShape = function(iSetX, iSetY){
    var oSelf = this,
        x = iSetX || Math.ceil(Math.random() * oSelf.oConfig.iRandomShapeMaxX),
        y = iSetY || Math.ceil(Math.random() * oSelf.oConfig.iRandomShapeMaxY),
        aShape = [];

    for (var i = 0; i <= x; i++) {
      aShape[i] = [];
      for (var j = 0; j <= y; j++) {
        aShape[i][j] = Math.round(Math.random());
      }
    }

    return aShape;
  }

  /**
   * ConwaysCanvas.prototype.getShape
   *
   * @description Returns a shape array by given number
   *
   * @return [*] Array
   */
  ConwaysCanvas.prototype.getShape = function(i){
    var oSelf = this,
        aShape = [];

    switch(i) {
      case 0: // random
        aShape = oSelf.getRandomShape();
        break;
      // Shapes from: https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
      case 1: // Block
        aShape[0] = [0,0,0,0];
        aShape[1] = [0,1,1,0];
        aShape[2] = [0,1,1,0];
        aShape[3] = [0,0,0,0];
        break;
      case 2: // Beehive
        aShape[0] = [0,0,0,0,0,0];
        aShape[1] = [0,0,1,1,0,0];
        aShape[2] = [0,1,0,0,1,0];
        aShape[3] = [0,0,1,1,0,0];
        aShape[4] = [0,0,0,0,0,0];
        break;
      case 3: // Loaf
        aShape[0] = [0,0,0,0,0,0];
        aShape[1] = [0,0,1,1,0,0];
        aShape[2] = [0,1,0,0,1,0];
        aShape[3] = [0,0,1,0,1,0];
        aShape[4] = [0,0,0,1,0,0];
        aShape[5] = [0,0,0,0,0,0];
        break;
      case 4: // Boat
        aShape[0] = [0,0,0,0,0];
        aShape[1] = [0,1,1,0,0];
        aShape[2] = [0,1,0,1,0];
        aShape[3] = [0,0,1,0,0];
        aShape[4] = [0,0,0,0,0];
        break;
      case 5: // Tub
        aShape[0] = [0,0,0,0,0];
        aShape[1] = [0,0,1,0,0];
        aShape[2] = [0,1,0,1,0];
        aShape[3] = [0,0,1,0,0];
        aShape[4] = [0,0,0,0,0];
        break;
      case 6: // Blinker a
        aShape[0] = [0,0,0,0,0];
        aShape[1] = [0,0,0,0,0];
        aShape[2] = [0,1,1,1,0];
        aShape[3] = [0,0,0,0,0];
        aShape[4] = [0,0,0,0,0];
        break;
      case 7: // Blinker b
        aShape[0] = [0,0,0,0,0];
        aShape[1] = [0,0,1,0,0];
        aShape[2] = [0,0,1,0,0];
        aShape[3] = [0,0,1,0,0];
        aShape[4] = [0,0,0,0,0];
        break;
      case 8: // Toad a
        aShape[0] = [0,0,0,0,0,0];
        aShape[1] = [0,0,0,0,0,0];
        aShape[2] = [0,0,1,1,1,0];
        aShape[3] = [0,1,1,1,0,0];
        aShape[4] = [0,0,0,0,0,0];
        aShape[5] = [0,0,0,0,0,0];
        break;
      case 9: // Toad b
        aShape[0] = [0,0,0,0,0,0];
        aShape[1] = [0,0,0,1,0,0];
        aShape[2] = [0,1,0,0,1,0];
        aShape[3] = [0,1,0,0,1,0];
        aShape[4] = [0,0,1,0,0,0];
        aShape[5] = [0,0,0,0,0,0];
        break;
      case 10: // Beacon a
        aShape[0] = [0,0,0,0,0,0];
        aShape[1] = [0,1,1,0,0,0];
        aShape[2] = [0,1,1,0,0,0];
        aShape[3] = [0,0,0,1,1,0];
        aShape[4] = [0,0,0,1,1,0];
        aShape[5] = [0,0,0,0,0,0];
        break;
      case 11: // Beacon b
        aShape[0] = [0,0,0,0,0,0];
        aShape[1] = [0,1,1,0,0,0];
        aShape[2] = [0,1,0,0,0,0];
        aShape[3] = [0,0,0,0,1,0];
        aShape[4] = [0,0,0,1,1,0];
        aShape[5] = [0,0,0,0,0,0];
        break;
      case 12: // Pulsar
        aShape[0]  = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        aShape[1]  = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        aShape[2]  = [0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,0];
        aShape[3]  = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        aShape[4]  = [0,0,1,0,0,0,0,1,0,1,0,0,0,0,1,0,0];
        aShape[5]  = [0,0,1,0,0,0,0,1,0,1,0,0,0,0,1,0,0];
        aShape[6]  = [0,0,1,0,0,0,0,1,0,1,0,0,0,0,1,0,0];
        aShape[7]  = [0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,0];
        aShape[8]  = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        aShape[9]  = [0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,0];
        aShape[10] = [0,0,1,0,0,0,0,1,0,1,0,0,0,0,1,0,0];
        aShape[11] = [0,0,1,0,0,0,0,1,0,1,0,0,0,0,1,0,0];
        aShape[12] = [0,0,1,0,0,0,0,1,0,1,0,0,0,0,1,0,0];
        aShape[13] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        aShape[14] = [0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,0];
        aShape[15] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        aShape[16] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        break;
      case 13: // Pentadecathlon
        aShape[0]  = [0,0,0,0,0,0,0,0,0,0,0];
        aShape[1]  = [0,0,0,0,0,0,0,0,0,0,0];
        aShape[2]  = [0,0,0,0,0,0,0,0,0,0,0];
        aShape[3]  = [0,0,0,0,0,0,0,0,0,0,0];
        aShape[4]  = [0,0,0,0,1,1,1,0,0,0,0];
        aShape[5]  = [0,0,0,0,1,0,1,0,0,0,0];
        aShape[6]  = [0,0,0,0,1,1,1,0,0,0,0];
        aShape[7]  = [0,0,0,0,1,1,1,0,0,0,0];
        aShape[8]  = [0,0,0,0,1,1,1,0,0,0,0];
        aShape[9]  = [0,0,0,0,1,1,1,0,0,0,0];
        aShape[10] = [0,0,0,0,1,0,1,0,0,0,0];
        aShape[11] = [0,0,0,0,1,1,1,0,0,0,0];
        aShape[12] = [0,0,0,0,0,0,0,0,0,0,0];
        aShape[13] = [0,0,0,0,0,0,0,0,0,0,0];
        aShape[14] = [0,0,0,0,0,0,0,0,0,0,0];
        aShape[15] = [0,0,0,0,0,0,0,0,0,0,0];
        aShape[16] = [0,0,0,0,0,0,0,0,0,0,0];
        break;
      case 14: // Glider a
        aShape[0] = [0,0,0,0,0];
        aShape[1] = [0,0,1,0,0];
        aShape[2] = [0,0,0,1,0];
        aShape[3] = [0,1,1,1,0];
        aShape[4] = [0,0,0,0,0];
        break;
      default:
        aShape[0] = [0,0,0,0,0,0];
        aShape[1] = [0,0,0,0,0,0];
        aShape[2] = [0,0,0,0,0,0];
        aShape[3] = [0,0,0,0,0,0];
        aShape[4] = [0,0,0,0,0,0];
        aShape[5] = [0,0,0,0,0,0];
    }

    return aShape;
  }

  if (!window.Canvay) {
    window.Canvay = new ConwaysCanvas('gameoflife');
  }

  Canvay.setup();

  window.setInterval(function(){
    Canvay.play();
  }, 100);
}())
