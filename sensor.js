class Sensor {
    constructor(car) {
      // Store a reference to the car object
      this.car = car;
  
      // Define sensor properties
      this.rayCount = 5; // Number of rays cast by the sensor
      this.rayLength = 150; // Maximum length of each ray
      this.raySpread = Math.PI / 2; // Total angular spread of the rays (full 180 degrees)
  
      // Initialize empty arrays for storing ray data
      this.rays = []; // Array to store start and end points of each ray
      this.readings = []; // Array to store collision points for each ray (initially empty)
    }
  
    update(roadBorders,traffic){
      this.#castRays();
      this.readings=[];
      for(let i=0;i<this.rays.length;i++){
          this.readings.push(
              this.#getReading(
                  this.rays[i],
                  roadBorders,
                  traffic
              )
          );
      }
  }
  
    #getReading(ray, roadBorders, traffic) {
      // Stores potential collision points with road borders
      let touches = [];
  
      // Check each road border segment for collision with the ray
      for (let i = 0; i < roadBorders.length; i++) {
        const touch = getIntersection(ray[0], ray[1], roadBorders[i][0], roadBorders[i][1]);
        if (touch) {
          touches.push(touch); // Add the collision point to the list
        }
      }

      for(let i=0;i<traffic.length;i++){
        const poly=traffic[i].polygon;
        for(let j=0;j<poly.length;j++){
            const value=getIntersection(
                ray[0],
                ray[1],
                poly[j],
                poly[(j+1)%poly.length]
            );
            if(value){
                touches.push(value);
            }
        }
    }
  
      // Handle cases where the ray doesn't hit any road borders
      if (touches.length === 0) {
        return null; // No collision detected, return null
      } else {
        // Find the closest collision point based on distance from the ray's origin
        const offsets = touches.map(e => e.offset); // Get offsets (distances) of each collision point
        const minOffset = Math.min(...offsets); // Find the minimum offset (closest point)
        return touches.find(e => e.offset === minOffset); // Return the closest collision point
      }
    }
  
    #castRays() {
      // Clear previous rays before casting new ones
      this.rays = [];
  
      // Loop to create and store rays with different angles
      for (let i = 0; i < this.rayCount; i++) {
        const rayAngle = lerp(
          this.raySpread / 2, // Start angle (half spread)
          -this.raySpread / 2, // End angle (negative half spread)
          this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1) // Normalize angle based on ray count
        ) + this.car.angle; // Add car's orientation to the ray angle
  
        // Calculate start and end points of the ray based on car's position, angle, and ray length
        const start = { x: this.car.x, y: this.car.y };
        const end = {
          x: this.car.x - Math.sin(rayAngle) * this.rayLength,
          y: this.car.y - Math.cos(rayAngle) * this.rayLength,
        };
  
        // Store the ray (start and end points) in the rays array
        this.rays.push([start, end]);
      }
    }

    draw(ctx){
        for(let i=0;i<this.rayCount;i++){
            let end=this.rays[i][1];
            if(this.readings[i]){
                end=this.readings[i];
            }

            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="yellow";
            ctx.moveTo(
                this.rays[i][0].x,
                this.rays[i][0].y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="black";
            ctx.moveTo(
                this.rays[i][1].x,
                this.rays[i][1].y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();
        }
    }        
}