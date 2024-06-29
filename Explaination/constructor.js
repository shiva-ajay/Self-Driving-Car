// A constructor is a special method in a class that is automatically called when a new instance of the class is created.
//  Its primary purpose is to initialize the newly created object by setting initial values 
//  for its properties and executing any setup code needed for the object.



class Person {
    constructor(name, age) {
        // This is the constructor method
        this.name = name; // Initialize the name property with the provided value
        this.age = age;   // Initialize the age property with the provided value
    }

    sayHello() {
        console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
    }
}

const person1 = new Person("Alice", 30); // Creates a new Person object with name "Alice" and age 30
person1.sayHello(); // Outputs: Hello, my name is Alice and I am 30 years old.
