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
      nWeight: .545, 
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

    oSelf.nMapHeight = Math.floor(oSelf.nCanvasHeight/oSelf.nCellSize);
    oSelf.nMapWidth = Math.floor(oSelf.nCanvasWidth/oSelf.nCellSize)

    for (var i = oSelf.nMapWidth; i >= 0; i--) {
      oSelf.aMap[i] = new Array(oSelf.nMapHeight)
      oSelf.aNewMap[i] = new Array(oSelf.nMapHeight)
    }

    for (var i = oSelf.aMap.length - 1; i >= 0; i--) {
      for (var j = oSelf.aMap[i].length - 1; j >= 0; j--) {
        oSelf.aMap[i][j] = !!Math.round(Math.random()*oSelf.nWeight);
      }
    }

    return oSelf;
  };

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

  if (!window.Canvay) {
    window.Canvay = new ConwaysCanvas('gameoflife');
  }

  Canvay.setup();

  window.setInterval(function(){
    Canvay.play();
  }, 100);
}())
