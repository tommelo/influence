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

var request = require('request-promise');
var cheerio = require('cheerio');

/**
 * The default constructor
 */
function Scraper() {

}

/**
 * Returns a http get request promise
 * 
 * @param  {Object}  req     The request definition
 * @return {Promise} promise The get request promise
 */
Scraper.prototype.get = function(req) {
  return request(req);
}

/**
 * Returns a cheerio instance loaded with the given html body
 * 
 * @param  {String}   body The html body
 * @return {Function} $    The cheerio instance
 */
Scraper.prototype.load = function(body) {
  return cheerio.load(body);
}

/**
 * Returns a promise of a request call
 * 
 * @param  {String}  uri The request uri
 * @param  {Object}  qs  The request query string 
 * @return {Promise} promise The request promise
 */
Scraper.prototype.prepare = function(uri, qs) {
  var req = {
    uri:             uri,
    qs:              qs,
    simple:          false,
    transform:       this.load,
    followRedirects: false
  };

  return this.get(req).then(this.scrape);
}

/**
 * Executes the scrape chain: 
 * request -> cheerio load -> scrape -> transform
 * 
 * @param  {Array}   promises The promises array
 * @return {Promise} promise  The execution result
 */
Scraper.prototype.execute = function(promises) {
  var self = this;
  return Promise.all(promises).then(function(result) {
    return self.transform(result);
  });
}

/**
 * The scrape method.
 * This is the abstract method that should be implemented by all the scrapers.
 * It performs a html body scrape.
 * 
 * @param  {Function} $ The cheerio instance
 * @return {Array}    result The scrape result
 */
Scraper.prototype.scrape = function($) {
  throw new TypeError('scrape() method must be implemented');
}

/**
 * The transform method.
 * This is the abstract method that should be implemented by all the scrapers.
 * It transform the scrape result in a array of objects.
 * 
 * @param  {Array} result The scrape result
 * @return {Array} normalized An array of normalized data
 */
Scraper.prototype.transform = function(result) {
  throw new TypeError('transform() method must be implemented');
}

module.exports = Scraper;