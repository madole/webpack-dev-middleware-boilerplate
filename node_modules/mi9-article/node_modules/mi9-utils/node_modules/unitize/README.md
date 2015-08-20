# Unitizer

Unitizes a value by converting it to the highest unit in a set of units. Ex:
123456 unitized into bytes would be 120.56kb. Once converted,
unitizer provides basic formatting functions that are chainable,
allowing for quick display of converted numbers. Using unitizer,
you can convert and display a number within a few chained
function calls.

## Installation

    npm install unitizer

## Usage

First you have to require the module.

    var unitize = require('unitizer');

Once you have unitizer available, you have to call a unitize function that
converts your value into a
unitized format. By default, unitize will use units of 1000,
which converts to k(thousand), m(million), b(billion), and t(trillion).

    unitize(12.131432);

Or, for any other unit set, you use a method on the unitize base.

    unitize.bytes(1231231310);

## Formatting

Each unitize function returns a chainable instance of a formatter object,
which helps you format the unitized value into something more human readable.
 Calling `toString()` on the formatter will return a string of the value,
 formatted with the unit on the end. By default, all numbers are formatted
 with two points of precision, with a space between the value and the unit.

    unitize(23124).toString(); //23.12 k

You can remove the space by simply passing in `false` to `toString()`.

    unitize(23124).toString(false); //23.12k

There are many other formatting functions, such as making the precision 3
instead of four.

    unitize(23124).precision(3).toString(); //23.124 k


## Unitize Functions

### unitizer(value, [base], [units])

Converts a number to base units. By default, this will use 1000 base units,
labeled with k, m, b, and t.

    unitizer(12131432).toString(); //12.13 m

However you can provide any base and units you want. Just provide a number
for the base and an array of strings for the units. Unitizer will loop until
it cannot divide any further or it runs out of units.

    unitizer(5732, 12, ['','dozen','gross','great gross']).toString(); //3.32 great gross

By default, unitizer will process values in powers of the base. 12^2 is a
gross, for example. However, if you need more control over your divison,
you can pass in an array of increments as the base, and those will be used
instead of using a power of the base. For example, the imperial mesauring
system does not have a standard increment for each unit,
so we need to use our own array of increments to convert inches to miles.

    var increments = [12,3,1760];
    var units = ['inches','feet','yards','miles'];
    unitizer(323311,increments,units).toString()

Using this method, the number of increments will always be one less than the
number of units, because the base for the first unit is used for the
calclation of the amount for the next. 12 inches = 1 foot, 3 feet = 1 yard,
and 1760 yards = 1 mile. Any value less than 12 is inches.

### unitizer.bytes(value)

Converts a number to 1024 base units, labeled as byte increments. Goes to
petabytes.

    unitizer.bytes(123123313).toString(); //117.42 mb

### unitizer.finance(value, country)

Converts a number to 1000 base units, but labels the number based on financal
 standards (M, MM, etc.), prefixes the number with the currency symbol for
 the country provided, and removes the space between the vaule and unit.
 Country defaults to US.

    unitizer.finance(5423234).toString(); //$5.42MM

##Formatting Functions

### toString(unitSpace)

Returns a string, formatted to the specifications set and with the unit
postfixed to the value. By default there is a space between the value and
unit, but passing false for the `unitSpace` param will prevent it from being
added.

    unitizer(12131432).toString(); //12.13 m

### precision(precision)

Formats the value to the specificed precision.

    unitizer(12131432).precision(3).toString(); //12.131 m

### significant(digits)

Formats the value to the specified significant digits.

    unitizer(12131432).significant(3).toString(); //12.1 m

### floor()

Removes any percision (decimals) from the value.

    unitizer(12131432).floor().toString(); //12 m

### capitalize()

Capitalizes the unit.

    unitizer(12131432).capitalize().toString(); //12 M

### currency(useSymbol, country)

Formats the value with two percision, removes the space between the value
 and unit, and prefixes the string with either the currency symbol (Ex: $) or
 the internal three character currency represetation (Ex: USD). The three
 character representation will have a space between it and the value. Defaults
 to a
 symbol in the US.

    unitizer(12131432).currency().toString(); //$12.13m
    unitizer(12131432).currency(false).toString(); //USD 12.13m