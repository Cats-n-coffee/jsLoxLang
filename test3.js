function foo(name) {

    return function bar(age) {

        return function print(food) {
            console.log(name, age,food)
        }
    }
}

const foo2 = name => age => print => console.log(name, age, print)

foo('chichi')('4')('rice')
foo2('chichi')('4')('rice')

// Currying