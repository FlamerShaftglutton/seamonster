# seamonster
A proof of concept HTML5 game about a sea monster.

The arrow keys are for movement: up accelerates the monster, down decelerates, and left and right turn counter-clockwise and clockwise respectively. Changing direction in the air isn't allowed. Space bar (or clicking on the UI bar) pulls down the UI to show the current achievements. At this point winning is essentially getting all of the achievements.

This is still very rough with poor programmer's art and such, but it is just a proof of concept at this point. If I finish fleshing it out and it is indeed fun to play then I'll either invest more time into art or I'll invest in an artist.

Upcoming features/known bugs:
- The wraparound-view drawing works, but collision detection is rough on the seam.
- A lot more achievements.
- Health, which can be replenished by feeding, and diminished by not eating or by attacking bigger ships or by mines
- Updating the boat creation timing logic
- Bosses: Titanic, aircraft carriers, ice flows, barges, etc. which can be defeated by hitting them with ships.
- More air stuff: varieties of birds, helicopters (who can drop mines), airplanes that can be hit by boats
- Upgrades? Can't think of any that shouldn't just be automatic (speed and size).
- Fix wave creation logic. Currently waves either get super crazy or super dull, with no inbetween.
- Fix Monster speed issues caused by the above issue (by pushing down the wave, it gets more gravity time, and the inverse)
- Declare the player a winner after getting all of the achievements, but allowed continued free play.
