/*
* The MIT License (MIT)
*
* Copyright (c) 2017 tommelo
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/

'use strict';

var util    = require('util');
var Scraper = require('./scraper');

/**
 * The default constructor 
 */
function Hunter() {
  Scraper.call(this);
}

/**
 * The implementation of the abstract method transform()
 * Returns a single array of the given multi array
 * 
 * @param  {Array} result The multi array
 * @return {Array} single The single array
 */
Hunter.prototype.transform = function(result) {  
  var profiles = [].concat.apply([], result);
  return Array.from(new Set(profiles));
}

/**
 * The implementation of the abstract method scrape()
 * It searches for instagram profiles in the given html body.
 * 
 * @param  {Function} $     The cheerio instance
 * @return {Array}    links The Insgragram account links
 */
Hunter.prototype.scrape = function($) {
  var profiles = [];
  var links = $('a[href^="http://instagram.com/"],a[href^="https://instagram.com/"]')
                .not('[href^="http://instagram.com/p/"]')
                .not('[href^="https://instagram.com/p/"]')
                .not('[href^="http://instagram.com/d/"]')
                .not('[href^="https://instagram.com/d/"]');

  $(links).each(function(i, link) {
    var href = $(link).attr('href');
    if (href.endsWith('/')) {
      href = href.substring(0, href.length - 1);
    }

    profiles.push(href);
  });

  return profiles;
}

/**
 * Searches for instagram profiles links in the given page's url
 *
 * @param  {Array} links The page's url
 * @return {Promise} promise A promise of the execution chain
 **/
Hunter.prototype.hunt = function(links) {
  var promises = [];

  for (var index in links) {
    var link = links[index];
    var promise = this.prepare(link);
    promises.push(promise);
  }

  return this.execute(promises);  
}

util.inherits(Hunter, Scraper);
module.exports = Hunter;