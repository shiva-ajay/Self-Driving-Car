class Car {
  constructor(x, y, width, height, controlType, maxSpeed = 3) {
    this.x = x; // Initial x-coordinate of the car
    this.y = y; // Initial y-coordinate of the car
    this.width = width; // Width of the car
    this.height = height; // Height of the car

    this.speed = 0; // Initial speed of the car
    this.acceleration = 0.2; // How much the speed increases when moving forward or backward
    this.maxSpeed = maxSpeed; // Maximum speed of the car
    this.friction = 0.05; // Deceleration applied when the car is not accelerating
    this.angle = 0; // Initial direction the car is facing in radians
    this.damaged = false;

    this.useBrain=controlType=="AI";

    if(controlType!="DUMMY"){
      this.sensor=new Sensor(this);
      this.brain=new NeuralNetwork(
          [this.sensor.rayCount,6,4]
      );
  }
  this.controls=new Controls(controlType);
}

update(roadBorders,traffic){
  if(!this.damaged){
      this.#move();
      this.polygon=this.#createPolygon();
      this.damaged=this.#assessDamage(roadBorders,traffic);
  }
  if(this.sensor){
      this.sensor.update(roadBorders,traffic);
      const offsets=this.sensor.readings.map(
          s=>s==null?0:1-s.offset
      );
      const outputs=NeuralNetwork.feedForward(offsets,this.brain);

      if(this.useBrain){
          this.controls.forward=outputs[0];
          this.controls.left=outputs[1];
          this.controls.right=outputs[2];
          this.controls.reverse=outputs[3];
      }
  }
}

  #assessDamage(roadBorders, traffic) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (polysIntersect(this.polygon, roadBorders[i])) {
        return true;
      }
    }
    for (let i = 0; i < traffic.length; i++) {
      if (polysIntersect(this.polygon, traffic[i].polygon)) {
        return true;
      }
    }
    return false;
  }

  #createPolygon() {
    const points = [];
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);
    points.push({
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    });
    return points;
  }

  #move() {
    if (this.controls.forward) {
      // Increase speed if forward control is active
      this.speed += this.acceleration;
    }
    if (this.controls.reverse) {
      // Decrease speed if reverse control is active
      this.speed -= this.acceleration;
    }

    // Clamp the speed to maxSpeed and -maxSpeed/2
    if (this.speed > this.maxSpeed) {
      // If the speed is greater than the maximum allowed speed, set it to maxSpeed
      this.speed = this.maxSpeed;
    }
    if (this.speed < -this.maxSpeed / 2) {
      // If the speed is less than half the maximum speed in the reverse direction, set it to -maxSpeed/2
      this.speed = -this.maxSpeed / 2;
    }

    // Apply friction to reduce speed gradually
    if (this.speed > 0) {
      // If the car is moving forward (speed is positive), decrease the speed by the friction amount
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      // If the car is moving backward (speed is negative), increase the speed by the friction amount
      this.speed += this.friction;
    }
    // Stop the car if speed is very low
    if (Math.abs(this.speed) < this.friction) {
      // Check if the absolute value of speed is less than the friction value
      this.speed = 0; // Set speed to zero to stop the car
    }

    // Adjust the car's angle based on the controls and current speed
    if (this.speed != 0) {
      // Check if the car is moving (speed is not zero)
      const flip = this.speed > 0 ? 1 : -1; // Determine direction multiplier based on speed
      if (this.controls.left) {
        // If left control is active, rotate the car to the left
        this.angle += 0.03 * flip; // Increase the angle of rotation
      }
      if (this.controls.right) {
        // If right control is active, rotate the car to the right
        this.angle -= 0.03 * flip; // Decrease the angle of rotation
      }
    }

    // Update the car's position based on its angle and speed
    this.x -= Math.sin(this.angle) * this.speed; // Horizontal movement
    this.y -= Math.cos(this.angle) * this.speed; // Vertical movement
  }

  draw(ctx, color) {
    if (this.damaged) {
      ctx.fillStyle = "gray";
    } else {
      ctx.fillStyle = color;
    }
    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.fill();

    if (this.sensor) {
      this.sensor.draw(ctx);
    }
  }
}
