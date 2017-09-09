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
var _       = require('lodash');
var Scraper = require('./scraper');

/**
 * The default constructor
 */
function Instagram() {
  Scraper.call(this);
}

/**
 * The implementation of the abstract method transform()
 * Returns a single array of the given multi array
 * 
 * @param  {Array} result The multi array
 * @return {Array} single The single array
 */
Instagram.prototype.transform = function(result) {
  var profiles = [].concat.apply([], result);
  return _.compact(profiles);
}

/**
 * The implementation of the abstract method scrape()
 * It performs a scrape of the user's Insragram account page.
 * 
 * @param  {Function} $ The cheerio instance
 * @return {Array}    profiles The Insgram account profiles
 */
Instagram.prototype.scrape = function($) {
  var link        = $('link[hreflang="x-default"]').attr('href');
  var picture     = $('meta[property="og:image"]').attr('content');
  var description = $('meta[property="og:description"]').attr('content');

  // profile not found
  if (!link || !picture || !description)
    return;

  if (link.endsWith('/'))
    link = link.substring(0, link.length - 1);

  var splited   = link.split('/');
  var username  = splited[splited.length -1];
  var indexOf   = description.indexOf('-');
  var info      = description.substring(0, indexOf - 1).trim();
  var followers = info.split(',')[0].replace(' Followers', '');
  var title     = $('title').text();
  var index     = title.indexOf('(');
  var name      = title.substring(0, index - 1).trim();

  return {
    link     : link,
    username : username,
    name     : name,
    followers: followers,
    picture  : picture
  }
}

/**
 * Extracts information of the given instagram links
 *
 * @param  {Array}   links The instagram links
 * @return {Promise} promise A promise of the execution chain
 */
Instagram.prototype.profiles = function(links) {
  var promises = [];
  
  for (var index in links) {
    var link = links[index];
    var promise = this.prepare(link);
    promises.push(promise);
  }

  return this.execute(promises);

}

util.inherits(Instagram, Scraper);
module.exports = Instagram;
