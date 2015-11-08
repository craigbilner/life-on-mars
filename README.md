# life on mars

calculates the eventual position of the given robots on mars [demo](http://craigbilner.github.io/life-on-mars/)

## input syntax

first line - x and y co-ordinates of the extreme top right of the martian surface separated by a space

following lines - pairs of lines (pairs can be split by blank lines) consisting of:

* first line - x and y co-ordinates of the robot's starting position with the initial compass orientation separated by spaces
* second line - a string of movements L (90deg rotate left), R (90deg rotate right), F (move one unit forward)

sample input:

    5 3
    1 1 E
    RFRFRFRF

    3 2 N
    FRRFLLFFRRFLL

    0 3 W
    LLFFFLFLFL

## output syntax

one line for each robot with it's final co-ordinates and it's orientation separated by spaces. If the unit has been lost it is the last known location with the word "LOST"

caveat - if a robot is lost, a following robot will not make the same mistake and ignore the command

sample output:

    1 1 E
    3 3 N LOST
    2 3 S