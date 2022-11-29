//let data = 42;
//data = '42'; This is can't be used as it is a number

//let data: any = 42;
//data = '42'; This is like javaScript

//let data: number | string = 42;
//data = '42';

export interface Duck{
    name: string;
    numLegs: number;
    makeSound: (sound: string) => void
}

const duck1 : Duck = {
    name: 'Huey',
    numLegs: 2,
    makeSound: (sound: any) => console.log(sound)
}

const duck2 : Duck = {
    name: 'Dewey',
    numLegs: 2,
    makeSound: (sound: any) => console.log(sound)
}

duck1.makeSound('quack');

export const ducks = [duck1, duck2]