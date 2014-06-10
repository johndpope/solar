solar
=====

provides heliocentric and geocentric positions of planets at a given time

USE CASES:
1) planet based architecture
Webservice is accessed through Rhino to get geocetric coordinates of planets at a given time at a given position. This allows to create geometry based on the position of planets. Computational Stonhenge, Computational pyramids, Computational Geomancy.

2) Create a simulation of our solar system. The planet position reflect the real positions. 

3) Calculate the gravitational forces acting on a person based on his position on the earth and the positions of all the planets at a given time. 

WHAT WE NEED:
Something like
var system = solar.getHelioCentric();
var pluto = system.getPluto();
var pos = pluto.getPos(new Date(2013,5,3));

or

var plutopos = solar.getPos(PLUTO,HELIOCENTRIC,new Date(2013,5,3))

or

url: solar/pos/pluto/heliocentric/2013/5/3

swisseph API:http://www.astro.com/swisseph/swephprg.htm#_Toc379890430

