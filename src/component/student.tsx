interface StudentProps {
    name: string;
    age: number;
    course: string;
}

export function Student({ name, age, course }: StudentProps) {
    return (
        <>
            <h1>Hello my name is: {name}</h1>
            <h1>And I am {age} years old</h1>
            <h1>And my subject is {course}</h1>
        </>
    );
}