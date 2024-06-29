class Road {
    constructor(x, width, laneCount = 3) {
      // Set basic properties of the road
      this.x = x; // Center position of the road on the x-axis
      this.width = width; // Width of the road
      this.laneCount = laneCount; // Number of lanes on the road (default 3)
  
      // Calculate derived properties based on width and center
      this.left = x - width / 2; // Left edge of the road (x-coordinate)
      this.right = x + width / 2; // Right edge of the road (x-coordinate)
  
      // Set initial values for top and bottom boundaries (placeholders)
      const infinity = 1000000;
      this.top = -infinity; // Top boundary (y-coordinate)
      this.bottom = infinity; // Bottom boundary (y-coordinate)
  
      // Define corner points of the road rectangle
      const topLeft = { x: this.left, y: this.top };
      const topRight = { x: this.right, y: this.top };
      const bottomLeft = { x: this.left, y: this.bottom };
      const bottomRight = { x: this.right, y: this.bottom };
  
      // Create an array of line segments representing the road borders
      this.borders = [
        [topLeft, bottomLeft], // Left border
        [topRight, bottomRight], // Right border
      ];
    }
  
    getLaneCenter(laneIndex) {
      // Calculate the width of each lane
      const laneWidth = this.width / this.laneCount;
  
      // Calculate the center position of the requested lane
      // Clamps the laneIndex to stay within valid range (0 to laneCount-1)
      return (
        this.left +  //The left edge of the road (starting point).
        laneWidth / 2 + // Half the lane width to reach the center from the left edge.
        Math.min(laneIndex, this.laneCount - 1) * laneWidth // The offset from the left edge based on the requested lane number (clamped index).
        //By adding these values, you get the x-coordinate representing the center of the requested lane on the road.
      );
    }
  
    draw(ctx) {
      // Set styling for the lane markings
      ctx.lineWidth = 5; // Thickness of the lane lines
      ctx.strokeStyle = "white"; // Color of the lane lines
  
      // Draw lane markings for each lane except the first and last
      for (let i = 1; i <= this.laneCount - 1; i++) {
        const x = lerp(this.left, this.right, i / this.laneCount); // Calculate x position for the lane line
  
        // Set dashed line style for lane markings
        ctx.setLineDash([20, 20]); // Creates a dashed line with 20px segments and 20px gaps
  
        ctx.beginPath(); // Start a new path for the line
        ctx.moveTo(x, this.top); // Set starting point of the line (top of the road)
        ctx.lineTo(x, this.bottom); // Set end point of the line (bottom of the road)
        ctx.stroke(); // Draw the line
      }
  
      // Reset line style to solid
      ctx.setLineDash([]); // Clear any existing line dashing
  
      // Draw the road borders
      this.borders.forEach((border) => {
        ctx.beginPath(); // Start a new path for each border line
        ctx.moveTo(border[0].x, border[0].y); // Set starting point of the line
        ctx.lineTo(border[1].x, border[1].y); // Set end point of the line
        ctx.stroke(); // Draw the line
      });
    }
  }
  

  