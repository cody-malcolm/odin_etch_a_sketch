# Etch-a-Sketch

## Objective

To create a virtual "Etch-a-sketch" where when the user passes the mouse through a div, the div gets colored and remains colored until the grid is reset.

## Project Overview

As with the previous projects, I've [done this one before](https://github.com/codyMalcolm/odin-etch-a-sketch). I was unsure if I would benefit from redoing it, however, I reviewed some other student solutions and was inspired to make it a little more user-friendly with an eraser and brush toggle.

#### Specifications

##### Main

1. Project should utilize Git and GitHub.
2. The webpage should be initialized with a 16x16 square grid of divs, created in Javascript.
3. Divs should change color on mouseover, and remain changed.
4. There should be a button at the top of the screen to clear the current grid and prompt the user for the number of squares per side in a new grid. New grids should occupy the same total space, even if the number of squares is different.

##### Recommended

1. The grid of divs should go in a container.

##### Additions

1. Add setting to change squares to random colors.
2. Add setting to change squares to a selected color.
3. For all three color settings, implement a toggle where the color requires multiple passes to fully saturate.
4. Allow initialisation of the grid to a selected color.
5. Implement mouse toggles for drawing, erasing, and neither.

#### Learning Objectives

To demonstrate mastery of manipulating DOM elements with Javascript.

## Author's Notes

#### Preliminary Thoughts

Between the sliders, buttons, toggles, and main grid, this should be a thorough refresher on DOM event handling.

#### Final Thoughts

This was quite the project after all. As it started to take shape, I had my wife mess around with it a bit. Learning from last time, I had added the ability to "turn off" the cursor via mouse clicks, as well as an eraser, with visual indicators on the right hand side to show which pen style was active. Still, she struggled, sometimes clicking by accident and turning the eraser on, or being on the eraser when she thought she had the toggle off. Additionally, she kept trying to change the pen style by clicking on the icons. This prompted me to add a visual cursor to indicate the current pen type. This still wasn't good enough, so on top of the above I also added the ability to click to select pen type, and a click and drag mode.

I also decided to add optional gridlines. All told, the final page has two different ways to draw, 3 different color palettes, multiple ways to switch from ink to eraser to off, and both ink and eraser options have a shader option which mutes the effect of a single pass. I tried a bunch of things that were new to me, so there were some issues, which is great because I learned a lot.

Challenges (and how I fixed them):
* I quickly came up with the idea of using icons as toggles, and they look great. For the palette that lets the user select a color, though, I had to find a way to get the toggle to open an `input type="color"`. It didn't take much to think of and figure out how to get the toggle to trigger a separate element (an input of type color), but the styling was a challenge. I started with the input styled with `display: none;`, which kept my document flow neat, but this made the color selector appear in the top left corner, which was across the grid from the palette that opens it. I solved this with `position: absolute;` combined with `visibility: hidden;`.
* When implementing the custom cursors, I used the same icons as I had used elsewhere in the page. Originally, the code wasn't working like all the reference material suggested it should. Was I using the wrong filetype? Was my CSS wrong? Browser issue? After a bit of Google-Fu I found the issue - there is a maximum size for cursors, and it's much smaller than the 512x512 icons I had. I also needed to recolor the "cursors", so I learned a little bit about using GIMP for image manipulation.
* The document stores color values in RGB format. I knew this from reviewing my comments from my first go at this project. However, a color input returns a value in hex format. When it came time to implement the shader, this caused a spaghetti code disaster where I had to trace which variables would be holding values in RGB format and which would be holding values in hex format, complete with parallel functions to parse the RGB individual values for each type. I did get the ink pen working like that, before I decided it was time to implement a class to handle all that stuff. I'm very comfortable with OOP, but I haven't done it in JavaScript. I decided if I was going to rip that band-aid off, I might as well also implement the class in a separate file. What could go wrong? Well, the class worked beautifully, but...
* In order to import the class to scripts.js (soon to be renamed), I had to tell index.html that scripts.js was a module. Up to this point, I had just been viewing the work in progress in my browser on my local machine. Apparently, you can't do that with a module. As a result, I had to install http-server and run a local server. Fine, until I neglected to run it with the `-c-1` command to disable caching. Once my browser cached the page, I was left trying to figure out my none of my changes seemed to be having an effect. That wouldn't be the only time, though...
* Shortly after figuring out the caching issue, I created the scripts folder, used the commands `mv scripts.js scripts/main.js` and `mv color.js scripts/`, updated index.html to point to new file/location, and went for a meal break (this is important). I got back and started working on the next piece of the project. Imagine my surprise when *again* none of my changes are taking effect...I can't even print a `console.log()`. This time, the issue was that my text editor still had scripts.js open, so all my new work was in the old file! Thankfully, I was organized enough that it wasn't hard to copy over the new additions. Still, you can bet I won't make that mistake again!

Overall, this was a really rewarding project. There was just enough "new" to keep it interesting, but not so much that I felt like I wasn't making any headway. It's nice to know I was not only able to implement all the functionality I wanted, but was able to implement it the way I wanted to, and that when the need for additional functionality became apparent I was able to add that too.

## Miscellaneous

Read more about this project at [The Odin Project.](https://www.theodinproject.com/courses/web-development-101/lessons/etch-a-sketch-project)
