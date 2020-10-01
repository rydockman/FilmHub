class Person {

    constructor(name, dateOfBirth) { // Each person has a name (String) and a date of birth (Date)
        this.name = name;
        if(dateOfBirth instanceof Date) // dateOfBirth CANNOT accept any data types other than a Date class
            this.dateOfBirth = dateOfBirth;
        else   
            this.dateOfBirth = new Date(); // In case dateOfBirth being passed in is not a Date, set it to the current date to avoid errors
    }

    getName() { // All getters will simply return the value, as the data types should already line up
        return this.name;
    }

    setName(name) {
        if(name instanceof String) // Do not want to set this.name to something that isn't a String
            this.name = name;
    }

    getDOB() {
        return this.dateOfBirth;
    }

    setDOB(dateOfBirth) {
        if(dateOfBirth instanceof Date) // CANNOT accept any data type into dateOfBirth outside of a Date class
            this.dateOfBirth = dateOfBirth;
    }
}