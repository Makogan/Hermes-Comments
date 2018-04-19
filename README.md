# ![](Assets/result.png)  Hermes Comments 

Hermes Comments is a simple visual studio extension that I created to help structure C and C++ code (and other languages using // and /**/ comments). It's purpose is to automate the creation of more visually complex comments to structure and document code.

## Features

Using shortcuts you can now turn a selected text into one of three
possible formats, centered, left justified or subsection.

So far the extension supports lef justified section titles:

![left comment](Assets/Left.gif)

Centered section titles:

![left comment](Assets/Centered.gif)

And subsection titles:

![left comment](Assets/sub.gif)

> To create a complex comment all you need is to highlight the desired text and use one of the shortcuts.

Support for modifying pre-existing comments
![left comment](Assets/comments.gif)

The shortcuts are:

* `alt+shit+p` Creates a centered title 
* `alt+shift+l` Creates a left justified title 
* `alt+shift+o`   Creates a subtitle
* `alt+shift+;` Creates a separator line

![left comment](Assets/bar.png)
>The separator bar, created with `alt+shift+;` (; is the actual ';' key)

## Known Issues

Applying the commands twice eliminates empty lines in between text

It won't handle comments whose length is bigger than the maximum length of characters (90 by default).

## Release Notes
----
### 1.0.0

Initial release of hermes comments

**Enjoy!**
