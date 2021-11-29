# Conventions and useful tips

## Conventions
- Order variables and mixins by type and or purpose
- It's a good idea to have a general component where you declare your general site esthetics and map those variables into the component
- Try to give significant name that describes what they are used for to the variables and not only one that describes what they are.
- The variable must end by the type of value they are. [Consult the list of the allowed sass values](https://sass-lang.com/documentation/values).
- Give a general idea of what the variable is without giving any visual clue of what they are.

## Useful tips
> We asked our internal developers that use Nwayo daily their tips and tricks and here's the result

### In [Kebab case](https://en.wiktionary.org/wiki/kebab_case) your selector you shall write

### Separate concerns, separates files it will be
This also apply to components.

### Yes, there's still jQuery features ¯\\\_(ツ)_/¯
Even us we need to get over it. 

### Time to go trough the [Nwayo Toolbox](TODO) you will invest.
There's a bunch of mixins and other stuff available. Why do it again? Ain't nobody got time for that!

### `nwayo watch` is a horse wearing blinders🏇🏻
When we do some modifications to yaml files (include new stuff or change konstan), you need to stop and restart the `nwayo watch`. Otherwise, changes won't be take into consideration. 

### If you don't know how to say Nwayo, try `nwayo --pronounce`
It's always easier to now how to pronouns what you're talking about

### Properly your development tools you shall set
Exemple, automatically order css value so that the linters don't scream at you for the same things all the time 😱