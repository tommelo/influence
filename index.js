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

var Google    = require('./lib/google');
var Hunter    = require('./lib/hunter');
var Instagram = require('./lib/instagram');

/**
 * The defaul constructor
 */
function Influence() {

}

/**
 * Searches instagram profiles based on the given term
 * 
 * @param  {String}  term  The term to search
 * @param  {Number}  limit The google's search limit
 * @return {Promise} promise A promise to be executed 
 */
Influence.find = function(term, limit) {
  var google = new Google();

  return google.search(term, limit)
    .then(function(links) {
      var hunter = new Hunter();
      return hunter.hunt(links);
    })
    .then(function(profiles) {
      var instagram = new Instagram();
      return instagram.profiles(profiles);
    });
}

module.exports = {
  Google:    Google,
  Hunter:    Hunter,
  Instagram: Instagram,
  Influence: Influence
};
