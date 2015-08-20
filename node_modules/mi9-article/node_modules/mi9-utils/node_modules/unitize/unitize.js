/**
  * A chainable object that helps to format and
  * display the value and unit.
  */
var Formatter = function(original, reduced, unit) {
  this.original = original;
  this.value = reduced;
  this.unit = unit;
  this.prefix = '';
  this.postfix = '';
  this._formatted = false;
  this.unitSpace = true;
};

//Currency prefix symbols
Formatter.currencySymbols = {
  'US': '$'
};

//Currency prefix notations
Formatter.currencyPrefixes = {
  'US': 'USD'
};

//Removes the decimal values from the value
Formatter.prototype.floor = function() {
  this._formatted = true;

  this.value = Math.floor(this.value);

  //Chain
  return this;
};

//Converts the value to the requested precision
Formatter.prototype.precision = function(precision) {
  this._formatted = true;

  if(precision < 1 || typeof precision !== 'number') {
    this.floor();
  } else {
    this.value = this.value.toFixed(precision);
    this.value = parseFloat(this.value);
  }

  //Chain
  return this;
};

//Formats the value to the specified number of significant digits
Formatter.prototype.significant = function(digits) {
  this._formatted = true;
  
  this.value = this.value.toPrecision(digits);
  this.value = parseFloat(this.value);

  //Chain
  return this;
};

/**
 * Formats the value and unit for currency of the specified country
 * @param useSymbol Whether or not to use the currency symbol or
 * the three letter international notation.
 * @param country The two letter abbreviation of the country to use.
 * Defaults to 'US';
 */
Formatter.prototype.currency = function(useSymbol, country) {
  this._formatted = true;

  country = country || 'US';
  if(typeof useSymbol !== 'boolean') {
    useSymbol = true;
  }

  if(useSymbol) {
    this.prefix = Formatter.currencySymbols[country.toUpperCase()] || '';
  } else {
    this.prefix = Formatter.currencyPrefixes[country.toUpperCase()] || '';

    if(this.prefix.length > 0) {
      this.prefix += ' ';
    }
  }

  this.precision(2);

  this.unitSpace = false;

  //Chain
  return this;
};

//Capitalizes the unit
Formatter.prototype.capitalize = function() {
  this._formatted = true;

  this.unit = this.unit.toUpperCase();

  //Chain
  return this;
};

/**
 * Returns a formatted string with the value and unit.
 * This function does not chain.
 * @param unitSpace Whether or not to add a space between the
 * value and the unit. Defaults to true.
 */
Formatter.prototype.toString = function(unitSpace) {
  if(typeof unitSpace === 'boolean' && unitSpace !== true) {
    this.unitSpace = false;
  }

  if(!this._formatted) {
    this.precision(2);
  }

  var str = this.prefix + this.value;

  if(this.unitSpace) {
    str += ' ';
  }

  str += this.unit + this.postfix;

  return str;
};

/**
  * Unitizes a value.
  * @param value The value to unitize.
  * @param base The numerical base for the unit.
  * Defaults to 1000.
  * @param units An array of values to use at each
  * base step. Defaults to ['', 'k', 'm', 'b', 't'].
  */
var unitize = function(value, base, units) {
  //Default empty values
  base = base || 1000;

  if(!units || units instanceof Array === false) {
    units = ['', 'k', 'm', 'b', 't'];
  }

  //Make sure all the necessary values are numbers
  try {
    value = unitize._makeNumber(value);
    if(base instanceof  Array === false) {
      base = unitize._makeNumber(base);
    }
  } catch(e) {
    return new Formatter(0, 0, '');
  }

  if(base instanceof Array) {
    return unitize._array(value, base, units);
  }

  //Setup of variables
  var increment = base; //The divisor
  var reduced = value; //Converted value
  var unit = units[0]; //Unit of the value

  //Loop until the value is converted or we run out of units
  var i = 1;
  while(value / increment >= 1 && i < units.length) {
    //increase the divisor by the base
    increment *= base;

    //Update the converted value and unit
    reduced = (value / increment * base);

    unit = units[i];

    i++;
  }

  return new Formatter(value, reduced, unit);
};

//Attempts to convert a value to a float
unitize._makeNumber = function(value) {
  if(typeof value !== 'number') {
    value = parseFloat(value);
    if(isNaN(value)) {
      throw 'Not a Number';
    } else {
      return value;
    }
  }

  return value;
};

unitize._array = function(value, base, units) {

  var increment = base[0];
  var reduced = value;
  var unit = units[0];

  //Loop until the value is converted or we run out of units
  var i = 1;
  while(reduced / increment >= 1 && i < units.length) {
    //Update the converted value and unit
    reduced = reduced / increment;
    unit = units[i];

    //Set the increment to the current base
    if(base.length > i) {
      increment = base[i];
    } else {
      increment = base[base.length - 1];
    }

    i++;
  }

  return new Formatter(value, reduced, unit);
};

//Converts bytes to the largest unit
unitize.bytes = function(bytes) {
  return unitize(
    bytes,
    1024,
    ['b', 'kb', 'mb', 'gb', 'tb', 'pb']
  );
};

//Converts and formats a value to the currency of
//the specified country.
unitize.finance = function(value, country) {
  country = country || 'us';

  return unitize(
    value,
    1000,
    ['', 'M', 'MM', 'B', 'T']
  ).currency(true, country);
};

module.exports = unitize;