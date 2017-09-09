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

var url     = require('url');
var util    = require('util');
var Scraper = require('./scraper');

/**
 * The defult configuration
 */
var HOST             = 'https://google.com'; // google's host
var PATH             = '/search';            // search path
var LIMIT            = 10;                   // google's page limit
var START_AT_PAGE    = 0;                    // starts at page 0
var URL_ELEMENT      = '.g h3 a';            // html tag to search

/**
 * The default constructor 
 */
function Google() {
  Scraper.call(this);
}

/**
 * The implementation of the abstract method transform()
 * Returns a single array of the given multi array
 * 
 * @param  {Array} result The multi array
 * @return {Array} single The single array
 */
Google.prototype.transform = function(result) {    
  return [].concat.apply([], result);
}

/**
 * The implementation of the abstract method scrape()
 * It performs a scrape of the Google's search page.
 * 
 * @param  {Function} $     The cheerio instance
 * @return {Array}    links The Google's search links
 */
Google.prototype.scrape = function($) {
  var links = [];
  $(URL_ELEMENT).each(function(i, element) {
    var href = $(element).attr('href');
    var parsed = url.parse(href, true);
    links.push(parsed.query.q);
  });

  return links;
}

/**
 * Performs a Google search
 * 
 * @param  {String}  term    The term to search
 * @param  {Number}  limit   The result limit
 * @return {Promise} promise A promise of the execution chain
 */
Google.prototype.search = function(term, limit) {
  var promises = [];
  var size     = limit || LIMIT;

  for (var i = START_AT_PAGE; i < size; i += LIMIT) {        
    var promise = this.prepare(HOST + PATH, { q: term, start: i });
    promises.push(promise);
  }

  return this.execute(promises);
}

util.inherits(Google, Scraper);
module.exports = Google;
