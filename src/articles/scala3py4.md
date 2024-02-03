# Scala 3 is Python 4 ... or is it? Part 1.
## Setting the stage

On a nice day in late 2023 I was [doomscrolling](https://en.wikipedia.org/wiki/Doomscrolling) on Reddit when I saw an enticing [opinion](https://www.reddit.com/r/scala/comments/14cfh1n/comment/jokrski/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button).

> The move to Scala 3 syntax should have been coupled with a marketing push to Python3 developers.
   **Scala 3 is python 4 in a lot of ways.**

Initially, I brushed it off as just another hot take. However, the thought lingered longer than I expected. Was there a grain of truth to this comparison?

Since I want to have readers ~~of diverse backgrounds~~ here's some context you need to be fully up to speed. Scala's leap from version 2 to 3 introduced a bunch of [new features](https://docs.scala-lang.org/scala3/new-in-scala3.html), most of which were met with enthusiasm—or at least a nod of approval—within the community. Yet, the introduction of an **optional** Python-style indentation syntax sparked the most debate.

We'll kick things off by examining a simple temperature conversion program written in both Python and Scala to get your feet wet. The scenario involves cities with temperatures in either Celsius or Fahrenheit, which we'll convert and display in both units.

Here's how I would do it with Python:

```python
from dataclasses import dataclass, replace
from typing import Self

def celsius_to_fahrenheit(celsius: float):
    return celsius * 9 / 5 + 32

def fahrenheit_to_celsius(fahrenheit: float):
    return (fahrenheit - 32) * 5 / 9
    
@dataclass(frozen=True)
class Location:
    name: str
    temperature: float
    celsius: bool

  def to_celsius(self) -> Self:
	  if self.celsius:
		  return self
	  else:
		  celsius = fahrenheit_to_celsius(self.temperature)
		  return replace(celsius = True, temperature=celsius)

  def to_fahrenheit(self) -> Self:
	  if not self.celsius:
		  return self
	  else:
		  fahrenheit = celsius_to_fahrenheit(self.temperature)
		  return replace(self, celsius = False, temperature=fahrenheit)

cities = [
    Location("New York", 60, False),  
    Location("London", 15, True),        
    Location("Helsinki", 5, True)      
]

cities_celsius = [city.to_celsius() for city in cities]
cities_fahrenheit = [city.to_fahrenheit() for city in cities]


for city_c, city_f in zip(cities_celsius, cities_fahrenheit):
    print(f"{city_c.name}: {city_c.temperature}°C or {city_f.temperature}°F")

```

And how it translates into Scala 2:

```scala
// Scala 2

// Top level functions aren't allowed, they need to be placed in an object.
object Temperature {
  def fahrenheitToCelsius(fahrenheit: Double): Double = (fahrenheit - 32) * 5 / 9
  def celsiusToFahrenheit(celsius: Double): Double = celsius * 9 / 5 + 32
}

case class Location(name: String, temperature: Double, celsius: Boolean) {
  import Temperature._ 
  def toCelsius: Location = {
    if (celsius) this
    else this.copy(temperature=fahrenheitToCelsius(temperature))
  }

  def toFahrenheit: Location = {
    if (!celsius) this
    else this.copy(temperature = celsiusToFahrenheit(temperature), celsius = false)
  }
}

object TemperatureConversion {
  def main(args: Array[String]): Unit = {
    val cities = List(
      Location("New York", 60, false),
      Location("London", 15, true),
      Location("Helsinki", 5, true)
    )
	// shorthand for cities.map(city => city.toCelsius)
    val citiesCelsius = cities.map(_.toCelsius) 
    val citiesFahrenheit = cities.map(_.toFahrenheit)

    citiesCelsius
    .zip(citiesFahrenheit)
	.foreach{case (cityC, cityF) => 
	println(s"${cityC.name}: ${cityC.temperature}°C or ${cityF.temperature}°F")}
    }
  }
}

```

Explaining every line of Scala code isn't my goal here—there are plenty of excellent [resources](https://docs.scala-lang.org/scala3/book/introduction.html) for that. But in brief: Scala utilizes `case classes` for immutable data structures and supports defining methods without parentheses when they don't accept arguments, like `def toCelsius: Location`. Scala 2 requires a namespace for top-level methods, hence the `object Temperature` to house our conversion functions. Scala's expression-based syntax means `if` conditions yield values, allowing our functions to return either the original or a converted `Location` instance.

Scala 3 changed the game with its indentation style syntax. Look mum - no braces!

```scala
// Scala 3

// top level functions!
def fahrenheitToCelsius(fahrenheit: Double): Double = (fahrenheit - 32) * 5 / 9
def celsiusToFahrenheit(celsius: Double): Double = celsius * 9 / 5 + 32

case class Location(name: String, temperature: Double, celsius: Boolean):
  def toCelsius: Location =
    if celsius then this
    else copy(temperature = fahrenheitToCelsius(temperature))

  def toFahrenheit: Location =
    if !celsius then this
    else copy(temperature = celsiusToFahrenheit(temperature), celsius = false)

// say bye to the verbose main 👋 
@main def temperatureConversion(): Unit =
  val cities = List(
    Location("New York", 60, false),
    Location("London", 15, true),
    Location("Helsinki", 5, true)
  )

  val citiesCelsius = cities.map(_.toCelsius)
  val citiesFahrenheit = cities.map(_.toFahrenheit)

  citiesCelsius
   .zip(citiesFahrenheit)
   .foreach((cityC, cityF) => 
   println(s"${cityC.name}: ${cityC.temperature}°C or ${cityF.temperature}°F"))
  
```

The resemblance between Scala 3 and Python examples is uncanny. So much so that friends have occasionally mistaken one for the other in my snippets. While I'm a fan of Scala 3's indentation-based syntax for its cleanliness [Reddit disagrees](https://www.reddit.com/r/scala/comments/142ecvf/comment/jn4khr6/?utm_source=share&utm_medium=web2x&context=3). Transitioning a language's style can indeed be scary, and Scala 3's support for both indentation and brace styles does open the floor to much debate, or [bike-shedding](https://en.wikipedia.org/wiki/Law_of_triviality).

With that, let's circle back to our main question: Can Scala 3 genuinely be seen as "Python 4"? To get there, we must first answer two questions:

1. **Are Python and Scala even similar?** If they aren't then calling Scala 3 Python 4 is out of the question.
2. **What is Scala's value proposition**? If the first point holds and there are similarities, calling Scala 3 Python 4 implies it's a step forward. 
## Intermission: how to compare programming languages

To understand whether or not Python and Scala are similar we'd have to put them side-by-side. Comparisons between programming languages are usually not fruitful discussions. To show their absurdity let's replace them with discussions about cars.

>**Motorhead**: "The new BMW X7 is a beast! It's got 375 horsepower, a turbocharged 6-cylinder engine, and can go from 0 to 60 in just 5.8 seconds. Isn't it a beauty?"
>
>**Average Person**: "(Looks at the photo) Eh, I'm not sold on the blue. My car's way cooler. Take a look."
>
>**Motorhead**: "That? Over the X7? But it's only got like 250 horsepower!"

Here, the motorhead is like a programming language enthusiast, geeking out over the technical specs and capabilities. The average person, on the other hand, cares more about aesthetics and personal preference — syntax and libraries in the programming world. Both perspectives are valid; it's just that they value different aspects.

Inspired by a great [blog post](https://morepablo.com/2023/05/where-have-all-the-hackers-gone.html), which I highly recommend (it's too good to just summarize here), we see that programming languages can be evaluated on a wide spectrum. This ranges from the nitty-gritty that keeps theorists up at night to the everyday usability concerns like syntax, all the way to the ecosystem and community.

While I admire the rigour I'll take a more hands-on approach by making three programs in both languages:

1. **A Simple Scripting Task:** To test the waters with something straightforward.
2. **A Link Shortener:** A practical utility that’s a step up in complexity.
3. A small, but more involved project that benefits from **concurrency**.

After each round, I'll share my unfiltered thoughts on how it all went. I've got a soft spot for both Python and Scala, so expect a fair play-by-play. This will help us answer our first question. Before we do so let's look at what is one of Python's biggest pain points in my opinion.

## Python's journey into static typing

Every programming language carves out its niche, its very reason for being. For Ruby, it was about maximizing developer happiness. In Python's case it was initially its simplicity, and [runtime typing](https://www.artima.com/articles/strong-versus-weak-typing) is an embodiment of this. At compile-time ([yes, Python has a small compilation step](https://devguide.python.org/internals/compiler/#compiler)) there is no type information however at runtime there is. The upside of this is that when an error occurs at runtime you have a lot of information to help you understand what went wrong. That's one of the reasons why Python's error messages are so good, if you care to read them that is.

Python has gradually tiptoed into the realm of static typing. Enter tools like [Mypy](https://peps.python.org/pep-0484/) and [Pyright](https://github.com/microsoft/pyright), which allow for optional type hints. For simplicity's sake, let's lump these together under "mypy". These type checkers can help you while refactoring. For instance, add a parameter to a function and your type checker or linter will complain. An additional upside of adding types to your program makes it more readable by conveying intent. 

Consider these examples:

```python
# Untyped
def suggest_meal(menu, restrictions): 
	...
```

```python
# Typed-ish
def suggest_meal(menu: dict[str, float], restrictions: list[str]) -> float:
	...
```

```python
# Typed
from dataclasses import dataclass
from typing import Literal

@dataclass(frozen=True)
class MenuItem:
	name: str
	price: float
	
DietaryRestriction = Literal["Vegetarian", "Vegan", "GlutenIntolerant"]

Menu = list[MenuItem]

def suggest_meal(menu: Menu, restrictions: list[DietaryRestriction]) -> float:
	...
```

Which flavour do you lean towards—\#Typed or \#Untyped? 

My vote goes to \#Typed, hands down. It locks down the code with **fewer degrees of freedom**, essentially guiding its use down a singular path. The middle ground, while more constrained than the Wild West of untyped code, still leaves a bit too much to interpretation. For instance, we know how many dietary restrictions there are so we could have encoded that information into our program. Doing so gives an indication that there are at least 3 specific cases to handle.

Before static typing's ascent, the first line of defence was descriptive naming (`menu_dict`, `dietary_restrictions_list`), followed by a rigorous regime of testing. Testing, while essential, is a double-edged sword—it secures your code but at the [cost of time and future maintenance overhead](https://www.manning.com/books/unit-testing). The appeal of tools like mypy lies in their ability to lower the degrees of freedom, reducing both the need for tests and the potential for runtime surprises.

Speaking from experience, this is easier said than done. Writing tests isn't free since they cost time. Testing is a necessity for longer lived programs, but each test not written is a win because it ultimately means you have less code to maintain. One way to achieve this is by reducing the degrees of freedom of your programs, afterwards tooling that finds incorrect programs "for free", in my opinion this is one of the main advantages of mypy but and [type systems in general](https://ovid.github.io/articles/what-to-know-before-debating-type-systems.html).

Yet, mypy isn't without its pitfalls. Experience tells me it's only as robust as your code's weakest link. Using loosely typed interfaces means resorting to workarounds like `cast` or `# type: ignore`, which can sidestep linting errors but at the risk of runtime exceptions. Moreover, the shift towards gradual typing can inadvertently increase your code's complexity. I prefer \#Typed, but I also understand the opposite perspective, we've gone from a single function to a `dataclass`, `Literal`, a type alias and so on. 

The key takeaways here are that:

1. **Every programming language carves out its own space**, and for Python, its hallmark has been simplicity.
2. **A shift towards static typing has emerged**, offering the promise of more predictable codebases and reducing the reliance on extensive testing.
3. **Mypy's effectiveness is contingent on your codebase's weakest link**, that's one of the limitations inherent in tools designed to retrofit type safety.

Now, let's pivot to Scala and explore what it brings to the table...

## Scala's value proposition

Diving into Scala's offerings, we find three compelling advantages. Kicking things off is **Turning Complex Ideas into Simple Code**, addressing a fundamental challenge often encountered in Python development. Following this, we'll look at an interesting theory I've been mulling over. Our second standout feature, **Code Once, Run Anywhere (\* 3): Compiling to JVM, Native, and JavaScript**, might not be Scala's official slogan, but it's a suggestion the folks at Scala-center might find intriguing! Last but by no means least, we encounter **Resume Driven Development: (The Buzzwords)**. Despite the seemingly cynical name, this point is made with a dose of affection, acknowledging Scala's role in powering a range of innovative tools for tackling diverse challenges. Without further delay, let's examine our first value proposition in detail.


### Value proposition 1: Turning Complex Ideas into Simple Code

```scala
case class MenuItem(name: String, price: Float)
type menu = List[MenuItem]

enum DietaryRestriction:
	case Vegetarian, Vegan, GlutenIntolerant

def suggestMeal(menu: Menu, restrictions: List[DietaryRestriction]): Float = 
	...
```

The example above resembles Python once again syntax-wise. As this style of programming, roughly [domain modelling](https://docs.scala-lang.org/scala3/book/taste-modeling.html), is a first-class citizen in Scala it has a number of language features to facilitate it. Aside from the aforementioned `case class` and `enum` the language also has support for constants and immutable data structures. All of these have the intended effect of reducing the degrees of freedom of a program.

Now, let's tackle a common sense rule, menu prices shouldn't be negative otherwise you'd be getting paid to eat. Scala introduces `opaque type` to deal with such real-world constraints elegantly:


```scala
opaque type PositiveFloat = Float

case class MenuItem(name: String, price: PositiveFloat)
// same as before 

def suggestMeal(menu: Menu, restrictions: List[DietaryRestrictions]): PositiveFloat = 
	...
```

To work with this `PositiveFloat`, we need a bit of setup. Inside this object `Float` is the same as `PositiveFloat`:

```scala
object PositiveFloat:
	def fromFloat(fl: Float): Option[PositiveFloat] = 
		if (fl < 0) None else Some(fl)
		
	def zero: PositiveFloat = 0.0
```

This code smartly ensures that only positive prices make it through, returning `Some(Float)` for valid inputs and `None` for anything that doesn't make the cut. 

To the outside world `Float` and `PositiveFloat` are unrelated, you need to make one first and handle the case when creating a `PositiveFloat` fails.

```scala
import scala.io.StdIn.readLine
val name = readLine("Give me a name for your menu item: ")
val price = readLine("Give me a price for your menu item: ").toFloat

// getOrElse zero on the failing path otherwise the real value is returned
val positivePrice = PositiveFloat.fromFloat(price).getOrElse(PositiveFloat.zero)
val item = MenuItem(name, positivePrice)
```

In this toy example we set all negative input to zero. You can imagine in more complex applications this could be changed to retry logic. [The full script is here](https://gist.github.com/ChidiRnweke/796c063162542e61e654d5e471d1c9a8).

While Python offers [NewType](https://docs.python.org/3/library/typing.html#newtype) for a somewhat similar purpose. The difference is that the Python `NewType` is automatically a subtype of the type it's based on. This is something we don't want, subtyping means we need to remember what [Liskov Substitution Principle](https://en.wikipedia.org/wiki/Liskov_substitution_principle) is again...  
#### The Degrees of freedom hypothesis

To reiterate, the concept of degrees of freedom here refers to the ways one can interact with code—both correctly and incorrectly. A type system is one of the tools at our disposal to reduce these degrees of freedom. 

Scala has tools that nudge you into the right direction. For instance, it encourages the use of `val` for declaring immutable variables, and, by default, leans towards immutable collections. These practices are part of a broader strategy to minimize the code's degrees of freedom.

The guiding principle is straightforward: the fewer the degrees of freedom, [the lesser the need for extensive testing to achieve a certain quality threshold](https://ovid.github.io/articles/what-to-know-before-debating-type-systems.html). "Quality" is deliberately left undefined, as its criteria can dramatically vary from a quick, one-off script to complex \#EnterpriseSoftware. 

This may sound nebulous but let's look at the following two graphs:

![[degrees of freedom plot]](/images/scala3py4/dof_plot.jpg)

The takeaway? While in many programs you cannot eliminate the need for testing for altogether, reducing the degrees of freedom allows for a leaner testing strategy. However, this reduction often comes at the cost of increased code complexity—a trade-off that can be annoying. For Scala this curve looks more favorable than for Python: as you reduce the degrees of freedom the complexity rises more gracefully than in Python's case.
### Value proposition 2: Compiling to JavaScript and native


<img src="/images/scala3py4/scala-platforms.png" 
data-alt-src="/blog/images/scala3py4/scala-platforms-dark.png" class="dark-toggle"></img>

When you've put your heart and soul into creating a Python project, you naturally want to share it with the world. Whether it's a groundbreaking algorithm, a useful utility, or a fun game, sharing your work can be immensely satisfying. However, distribution can quickly become a headache. The first thing you could do is distribute it on pypi, the drawback is that doing so means you need a Python interpreter with the right version to run your project.

There are projects such as Pyinstaller that promise to bundle Python and all its dependencies into a single executable. I haven't used it but everyone I know that has relays the same frustrating experience. Containerization offers a more robust solution, but it assumes a certain level of technical proficiency from your users, which might not always be the case. The alternative? Turning your project into a web application, which, while more universally accessible, introduces its own set of complexities and limitations.

This is where the allure of using other programming languages, such as Scala, comes from. Aside from targeting the Java virtual machine (JVM) Scala is capable of compiling to both a standalone executable as well as JavaScript. This means that the language is truly cross-platform. ([Write once, run everywhere](https://en.wikipedia.org/wiki/Write_once,_run_anywhere) * 3) seems to be what they're going for.

However, as with any technology that seems too promising, there are caveats. For instance, Scala Native, at the time of writing, is limited to single-threaded execution, though this is expected to change in the upcoming 0.5 version. Considering it has not reached a 1.0 release, Scala Native's evolving nature means the platform is rapidly advancing but that may present stability concerns.

My reservations about Scala.js stem from the fact that my preferred Typescript stack uses web components. The API "feels" distinctly JavaScript-y to me and moving it to scala.js would have only marginal gains which are offset by the extra effort of something that seems on the experimental side. 

Where Scala.js would shine are cases where you have a lot of business logic. These can be written in Scala for the reasons outlined in value proposition 1. Afterwards you can compile these to JavaScript, build your frontend as usual and interact with the compiled JavaScript code.

To show how easy this is I went out of my way to convert an existing toy project, Tictactoe, to a project that compiles for the JVM, native and scala.js. You can see the result underneath:

%%game goes here%%

You can download the binaries for windows, macOS and Linux as well.
### Value proposition 3: The buzzwords


![[degrees of freedom plot]](/images/scala3py4/nest-kafka.jpg)

As someone that does a fair share of data engineering image such as the one above are our bread and butter. It's taken from a databricks blog series called [Scalable data](https://www.databricks.com/blog/2017/04/26/processing-data-in-apache-kafka-with-structured-streaming-in-apache-spark-2-2.html). People take fancy tools to construct a #RealTime, #Streaming #architecture. Not because they have to, but because they can but I digress. 

Scala has carved out a niche for itself in the space of advanced libraries and frameworks that are nothing short of impressive. Heavyweights like Apache Spark and Apache Hive have long been staples in the big data sphere. Meanwhile, Akka actors and especially Apache Kafka have become synonymous with distributed computing. On top of that it's a haven for cutting-edge functional programming housing ecosystems such as [Typelevel](https://typelevel.org/) and [ZIO](https://zio.dev/).

But here's the thing—while Scala's knack for handling complex systems is a big sell, it's also put it in a box. **Precisely because it's great at building complex systems that is the only context it's spoken about.** This gives the impression that that is the only thing the language is or should be used for. This is a fantastic blog post and ecosystem that addresses this issue [in more detail](https://www.lihaoyi.com/post/comlihaoyiScalaExecutablePseudocodethatsEasyBoringandFast.html#boring).  

Switching gears to Python, we find a stark contrast. Python's big selling point is its simplicity. So, putting Scala 3 in the shoes of "Python 4"? It doesn't quite fit. They're playing in different leagues, not because of what they can or can't do, but because of the communities they're in and the ecosystems they created. My day job is in machine learning, that simply means that Python is my go-to tool there. The sheer amount of libraries, textbooks and tutorials it has in this space means it more or less wins this by default. At the end of the day, the ecosystems and communities that grow around a language really shape what it's all about. 

While Scala is potentially a much harder language I don't believe the skill floor is all that different. It's perfectly possible to use Scala for every day tasks without advanced features or libraries. In practice what I've noticed is that the functional programming community is more active online and they also seem to have more maintained libraries. I don't know how I feel about this—on the one hand I enjoy functional programming but on the other hand, it has a steeper learning curve which means it's less accessible. The perception it's a language for cutting-edge functional programming and heavy duty projects may turn away newcomers.

To that end **I'll write two versions of the Scala programs for the next part**: one that adopts a simplicity-first mindset and another that uses some of the libraries mentioned above. 

### The value propositions, summarized

Wow, that was a lot of information. For the lucky few who've made it this far, let's briefly summarize the value propositions before wrapping up:


1. **Turning Complex Ideas into Simple Code**: Scala simplifies complex domain modeling into manageable code, with low degrees of freedom.
2. **Code Once, Run Anywhere (\* 3)**: Scala's versatility allows code to seamlessly target JVM, native, and web platforms.
3. **Resume Driven Development**: For better and for worse, Scala is equipped for crafting complex systems, showcasing its strength in tackling sophisticated challenges.

## Recap

Alright, let's circle back to our starting point: the big question of whether Scala 3 could be seen as Python 4. To get everyone introduces to Scala we put both languages to the test with a simple program to see just how they stack up on a basic level.

From there, we unpacked what Scala brings to the table: its solid type system, the ability to run just about anywhere, and a toolbox of advanced libraries for when things get complex. But, it's clear these strengths also kind of niche-fy Scala, making it seem more like a specialist's pick than a language for the average programmer.

We're eyeing to tackle projects in Python and in two flavours of Scala—keeping it simple in one and going all out with functional programming in the other. This approach isn't just about showing off Scala's range; it's about breaking down the perception that it's only for the heavy-lifting in coding. In total that's 3 projects written three times each, I hope to see you guys in the next 3 parts.

Let me know your thoughts by opening an issue on the repository, a comment section is in the works!

\- Chidi

*... But not without a lot of help from Singiamtel, Edd, Senjan, Bryant, and others! Appreciate you ✌️.*