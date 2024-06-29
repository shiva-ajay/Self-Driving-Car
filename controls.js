class Controls {
    constructor(type) {
        // The constructor initializes the control states for forward, left, right, and reverse to false
        this.forward = false;
        this.left = false;
        this.right = false;
        this.reverse = false;
        
        switch(type){
            case "KEYS":
                this.#addKeyboardListeners();
                break;
            case "DUMMY":
                this.forward=true;
                break;
        }
    }

    #addKeyboardListeners() {
        // Adds event listeners on the document

        document.onkeydown = (event) => {
            // When a key is pressed down, this function is called
            switch(event.key) {
                case "ArrowLeft":
                    this.left = true; // Sets the left control state to true when the left arrow key is pressed
                    break;
                case "ArrowRight":
                    this.right = true; // Sets the right control state to true when the right arrow key is pressed
                    break;
                case "ArrowUp":
                    this.forward = true; // Sets the forward control state to true when the up arrow key is pressed
                    break;
                case "ArrowDown":
                    this.reverse = true; // Sets the reverse control state to true when the down arrow key is pressed
                    break;
            }
            
        };
        
        document.onkeyup = (event) => {
            // When a key is released, this function is called
            switch(event.key) {
                case "ArrowLeft":
                    this.left = false; // Sets the left control state to false when the left arrow key is released
                    break;
                case "ArrowRight":
                    this.right = false; // Sets the right control state to false when the right arrow key is released
                    break;
                case "ArrowUp":
                    this.forward = false; // Sets the forward control state to false when the up arrow key is released
                    break;
                case "ArrowDown":
                    this.reverse = false; // Sets the reverse control state to false when the down arrow key is released
                    break;
            }
            
        };
        
    }
}