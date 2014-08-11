# Intro Slide

# Who Am I

- Jacob Gable
- Front End developer at Sprout Social
- Ghost contributor
- jacobgable.com

# Sharing Time

- I must have a clear exit from a crowded room
- My household only buys SoftSoap hand soap for the sink area

# ES6 and the Future of JavaScript

- ES6 and the TC39 committee are making a concentrated effort to get some really neat productivity enhancements into the next version of JavaScript

# High points

- Shorter function declarations with arrow syntax
- A more approachable class declaration syntax
- Destructured assignment
- `let` and `const` variables
- Function parameter enhancements; default arguments, rest and spread parameters
- Iterators (yield)
- Template Strings
- Native module syntax

# So what?

- Ok, so what, all this stuff is just a pipe dream until it ships
- *Tyson Plan Quote*

# The magic of Transpilation

- *transpilation definition*
- Transpilation lets us write ES6 code today, and use it in modern browsers (IE9+)

# How transpilation works

- Takes the es6 code, converts it to es5 code.
- Example of template strings
- Example of modules to AMD

# Working them into your site right now

- I'm going to focus on Grunt since it seems to have the biggest community right now.  But others like gulp and broccoli have similar transpilation tasks (*link to esnext/es6-module-transpiler*)
- At Sprout Social, we've found it's easiest to move code over bit by bit as ES6 modules while shimming them back onto the global namespace as they are converted.
- I'm going to walk through an example of a code base that has a global namespace for their app.

# Converting a Boxes App

- Look at some example backbone boxes app that is separated into models/collections/views
- Create an es6 modules out of all the model first
- Create a shim file that exports everything to the global namespace
- Show how the model can be used just like before, but it's now converted to an ES6 module
- Continue to convert the other files
- Once all files are converted, show how to convert to a purely es6 -> AMD build without the global namespace

# Some gotchas

- Module code and dependencies can no longer be mocked in unit tests as easily
- Debugging your code can get a little more messy because of the transpilation junk at the top and bottom of files