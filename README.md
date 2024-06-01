## Rubik's Cube

A representation of a Rubik's cube state with `Three.js` and `react-three-fiber`. It support the ability to do rotations of faces and display the current cube color state. The interface for rotation can be as simple as it needs to be. e.g it can be 6 buttons that select the face to rotate and a toggle for which direction. Your code should: - Emphasize correctness, readability, and maintainability - In areas with complex logic, be either self-documenting or documented - Leverage good, modern language practices

For specifics of display and rotation, you can refer to a Rubik's cube. For illustration, given an initial state of ...

```
                +------------+
 1              | U1  U2  U3 |
                |            |
 2              | U4  U5  U6 |
                |            |
 3              | U7  U8  U9 |
   +------------+------------+------------+------------+
 4 | L1  L2  L3 | F1  F2  F3 | R1  R2  R3 | B1  B2  B3 |
   |            |            |            |            |
 5 | L4  L5  L6 | F4  F5  F6 | R4  R5  R6 | B4  B5  B6 |
   |            |            |            |            |
 6 | L7  L8  L9 | F7  F8  F9 | R7  R8  R9 | B7  B8  B9 |
   +------------+------------+------------+------------+
 7              | D1  D2  D3 |
                |            |
 8              | D4  D5  D6 |
                |            |
 9              | D7  D8  D9 |
                +------------+
```
A rotation of face U clockwise would look like
```
                +------------+
 1              | U7  U4  U1 |
                |            |
 2              | U8  U5  U2 |
                |            |
 3              | U9  U6  U3 |
   +------------+------------+------------+------------+
 4 | F1  F2  F3 | R1  R2  R3 | B1  B2  B3 | L1  L2  L3 |
   |            |            |            |            |
 5 | L4  L5  L6 | F4  F5  F6 | R4  R5  R6 | B4  B5  B6 |
   |            |            |            |            |
 6 | L7  L8  L9 | F7  F8  F9 | R7  R8  R9 | B7  B8  B9 |
   +------------+------------+------------+------------+
 7              | D1  D2  D3 |
                |            |
 8              | D4  D5  D6 |
                |            |
 9              | D7  D8  D9 |
                +------------+
```
And then a rotation of face F counter-clockwise:
```
                +------------+
 1              | U7  U4  U1 |
                |            |
 2              | U8  U5  U2 |
                |            |
 3              | B1  R4  R7 |
   +------------+------------+------------+------------+
 4 | F1  F2  U3 | R3  F6  F9 | D3  B2  B3 | L1  L2  L3 |
   |            |            |            |            |
 5 | L4  L5  U6 | R2  F5  F8 | D2  R5  R6 | B4  B5  B6 |
   |            |            |            |            |
 6 | L7  L8  U9 | R1  F4  F7 | D1  R8  R9 | B7  B8  B9 |
   +------------+------------+------------+------------+
 7              | F3  L6  L9 |
                |            |
 8              | D4  D5  D6 |
                |            |
 9              | D7  D8  D9 |
                +------------+
```

The connotation of how the cube rotation works are derived from [here](https://ruwix.com/the-rubiks-cube/notation/advanced/)
