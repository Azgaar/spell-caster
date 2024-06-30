/**
 * The $1 Unistroke Recognizer (JavaScript version)
 *
 *  Jacob O. Wobbrock, Ph.D.
 *  The Information School
 *  University of Washington
 *  Seattle, WA 98195-2840
 *  wobbrock@uw.edu
 *
 *  Andrew D. Wilson, Ph.D.
 *  Microsoft Research
 *  One Microsoft Way
 *  Redmond, WA 98052
 *  awilson@microsoft.com
 *
 *  Yang Li, Ph.D.
 *  Department of Computer Science and Engineering
 *  University of Washington
 *  Seattle, WA 98195-2840
 *  yangli@cs.washington.edu
 *
 * The academic publication for the $1 recognizer, and what should be
 * used to cite it, is:
 *
 *     Wobbrock, J.O., Wilson, A.D. and Li, y. (2007). Gestures without
 *     libraries, toolkits or training: A $1 recognizer for user interface
 *     prototypes. Proceedings of the ACM Symposium on User Interface
 *     Software and Technology (UIST '07). Newport, Rhode Island (October
 *     7-10, 2007). New York: ACM Press, pp. 159-168.
 *     https://dl.acm.org/citation.cfm?id=1294238
 *
 * The Protractor enhancement was separately published by Yang Li and programmed
 * here by Jacob O. Wobbrock:
 *
 *     Li, y. (2010). Protractor: A fast and accurate gesture
 *     recognizer. Proceedings of the ACM Conference on Human
 *     Factors in Computing Systems (CHI '10). Atlanta, Georgia
 *     (April 10-15, 2010). New York: ACM Press, pp. 2169-2172.
 *     https://dl.acm.org/citation.cfm?id=1753654
 *
 * This software is distributed under the "New BSD License" agreement:
 *
 * Copyright (C) 2007-2012, Jacob O. Wobbrock, Andrew D. Wilson and Yang Li.
 * All rights reserved. Last updated July 14, 2018.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *    * Redistributions of source code must retain the above copyright
 *      notice, this list of conditions and the following disclaimer.
 *    * Redistributions in binary form must reproduce the above copyright
 *      notice, this list of conditions and the following disclaimer in the
 *      documentation and/or other materials provided with the distribution.
 *    * Neither the names of the University of Washington nor Microsoft,
 *      nor the names of its contributors may be used to endorse or promote
 *      products derived from this software without specific prior written
 *      permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL Jacob O. Wobbrock OR Andrew D. Wilson
 * OR Yang Li BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
 * OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 **/

import type {Stroke} from "./strokes";

class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class Rectangle {
  x: number;
  y: number;
  Width: number;
  Height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.Width = width;
    this.Height = height;
  }
}

class Unistroke {
  Name: string;
  Points: Point[];
  Vector: number[];

  constructor(name: string, points: Point[]) {
    this.Name = name;
    this.Points = Resample(points, NumPoints);
    var radians = IndicativeAngle(this.Points);
    this.Points = RotateBy(this.Points, -radians);
    this.Points = ScaleTo(this.Points, SquareSize);
    this.Points = TranslateTo(this.Points, Origin);
    this.Vector = Vectorize(this.Points); // for Protractor
  }
}

class Result {
  Name: string | null;
  Score: number;
  Time: number;

  constructor(name: string | null, score: number, ms: number) {
    this.Name = name;
    this.Score = score;
    this.Time = ms;
  }
}

const NumPoints = 64;
const SquareSize = 250.0;
const Origin = new Point(0, 0);
const Diagonal = Math.sqrt(SquareSize * SquareSize + SquareSize * SquareSize);
const HalfDiagonal = 0.5 * Diagonal;
const AngleRange = Deg2Rad(45.0);
const AnglePrecision = Deg2Rad(2.0);
const Phi = 0.5 * (-1.0 + Math.sqrt(5.0)); // Golden Ratio

export default class DollarRecognizer {
  Recognize: (points: Point[], useProtractor: boolean) => Result;
  AddGesture: (name: string, points: Point[]) => number;

  constructor(strokes: Record<Stroke, Array<[number, number]>>) {
    const Unistrokes = Object.entries(strokes).map(
      ([name, points]) =>
        new Unistroke(
          name,
          points.map(([x, y]) => new Point(x, y))
        )
    );

    this.Recognize = function (points: Point[], useProtractor: boolean) {
      var t0 = Date.now();
      var candidate = new Unistroke("", points);

      var u = -1;
      var b = +Infinity;
      for (
        var i = 0;
        i < Unistrokes.length;
        i++ // for each unistroke template
      ) {
        var d;
        if (useProtractor) d = OptimalCosineDistance(Unistrokes[i].Vector, candidate.Vector); // Protractor
        else d = DistanceAtBestAngle(candidate.Points, Unistrokes[i], -AngleRange, +AngleRange, AnglePrecision); // Golden Section Search (original $1)
        if (d < b) {
          b = d; // best (least) distance
          u = i; // unistroke index
        }
      }
      var t1 = Date.now();
      return u == -1
        ? new Result(null, 0.0, t1 - t0)
        : new Result(Unistrokes[u].Name, useProtractor ? 1.0 - b : 1.0 - b / HalfDiagonal, t1 - t0);
    };

    this.AddGesture = function (name: string, points: Point[]) {
      Unistrokes[Unistrokes.length] = new Unistroke(name, points); // append new unistroke
      var num = 0;
      for (var i = 0; i < Unistrokes.length; i++) {
        if (Unistrokes[i].Name == name) num++;
      }
      return num;
    };
  }
}

//
// Private helper functions from here on down
//
function Resample(points: Point[], n: number) {
  var I = PathLength(points) / (n - 1); // interval length
  var D = 0.0;
  var newpoints = new Array(points[0]);
  for (var i = 1; i < points.length; i++) {
    var d = Distance(points[i - 1], points[i]);
    if (D + d >= I) {
      var qx = points[i - 1].x + ((I - D) / d) * (points[i].x - points[i - 1].x);
      var qy = points[i - 1].y + ((I - D) / d) * (points[i].y - points[i - 1].y);
      var q = new Point(qx, qy);
      newpoints[newpoints.length] = q; // append new point 'q'
      points.splice(i, 0, q); // insert 'q' at position i in points s.t. 'q' will be the next i
      D = 0.0;
    } else D += d;
  }
  if (newpoints.length == n - 1)
    // somtimes we fall a rounding-error short of adding the last point, so add it if so
    newpoints[newpoints.length] = new Point(points[points.length - 1].x, points[points.length - 1].y);
  return newpoints;
}

function IndicativeAngle(points: Point[]) {
  var c = Centroid(points);
  return Math.atan2(c.y - points[0].y, c.x - points[0].x);
}

function RotateBy(points: Point[], radians: number) {
  // rotates points around centroid
  var c = Centroid(points);
  var cos = Math.cos(radians);
  var sin = Math.sin(radians);
  var newpoints = [];
  for (var i = 0; i < points.length; i++) {
    var qx = (points[i].x - c.x) * cos - (points[i].y - c.y) * sin + c.x;
    var qy = (points[i].x - c.x) * sin + (points[i].y - c.y) * cos + c.y;
    newpoints[newpoints.length] = new Point(qx, qy);
  }
  return newpoints;
}

function ScaleTo(points: Point[], size: number) {
  // non-uniform scale; assumes 2D gestures (i.e., no lines)
  var B = BoundingBox(points);
  var newpoints = [];
  for (var i = 0; i < points.length; i++) {
    var qx = points[i].x * (size / B.Width);
    var qy = points[i].y * (size / B.Height);
    newpoints[newpoints.length] = new Point(qx, qy);
  }
  return newpoints;
}

function TranslateTo(points: Point[], pt: Point) {
  // translates points' centroid
  var c = Centroid(points);
  var newpoints = [];
  for (var i = 0; i < points.length; i++) {
    var qx = points[i].x + pt.x - c.x;
    var qy = points[i].y + pt.y - c.y;
    newpoints[newpoints.length] = new Point(qx, qy);
  }
  return newpoints;
}

function Vectorize(points: Point[]) {
  // for Protractor
  var sum = 0.0;
  var vector = [];
  for (var i = 0; i < points.length; i++) {
    vector[vector.length] = points[i].x;
    vector[vector.length] = points[i].y;
    sum += points[i].x * points[i].x + points[i].y * points[i].y;
  }
  var magnitude = Math.sqrt(sum);
  for (var i = 0; i < vector.length; i++) vector[i] /= magnitude;
  return vector;
}

function OptimalCosineDistance(v1: number[], v2: number[]) {
  // for Protractor
  var a = 0.0;
  var b = 0.0;
  for (var i = 0; i < v1.length; i += 2) {
    a += v1[i] * v2[i] + v1[i + 1] * v2[i + 1];
    b += v1[i] * v2[i + 1] - v1[i + 1] * v2[i];
  }
  var angle = Math.atan(b / a);
  return Math.acos(a * Math.cos(angle) + b * Math.sin(angle));
}

function DistanceAtBestAngle(points: Point[], T: Unistroke, a: number, b: number, threshold: number) {
  var x1 = Phi * a + (1.0 - Phi) * b;
  var f1 = DistanceAtAngle(points, T, x1);
  var x2 = (1.0 - Phi) * a + Phi * b;
  var f2 = DistanceAtAngle(points, T, x2);
  while (Math.abs(b - a) > threshold) {
    if (f1 < f2) {
      b = x2;
      x2 = x1;
      f2 = f1;
      x1 = Phi * a + (1.0 - Phi) * b;
      f1 = DistanceAtAngle(points, T, x1);
    } else {
      a = x1;
      x1 = x2;
      f1 = f2;
      x2 = (1.0 - Phi) * a + Phi * b;
      f2 = DistanceAtAngle(points, T, x2);
    }
  }
  return Math.min(f1, f2);
}

function DistanceAtAngle(points: Point[], T: Unistroke, radians: number) {
  var newpoints = RotateBy(points, radians);
  return PathDistance(newpoints, T.Points);
}

function Centroid(points: Point[]) {
  let x = 0.0;
  let y = 0.0;

  for (const point of points) {
    x += point.x;
    y += point.y;
  }

  x /= points.length;
  y /= points.length;

  return new Point(x, y);
}

function BoundingBox(points: Point[]) {
  var minX = +Infinity,
    maxX = -Infinity,
    minY = +Infinity,
    maxY = -Infinity;
  for (var i = 0; i < points.length; i++) {
    minX = Math.min(minX, points[i].x);
    minY = Math.min(minY, points[i].y);
    maxX = Math.max(maxX, points[i].x);
    maxY = Math.max(maxY, points[i].y);
  }
  return new Rectangle(minX, minY, maxX - minX, maxY - minY);
}

function PathDistance(pts1: Point[], pts2: Point[]) {
  var d = 0.0;
  for (
    var i = 0;
    i < pts1.length;
    i++ // assumes pts1.length == pts2.length
  )
    d += Distance(pts1[i], pts2[i]);
  return d / pts1.length;
}

function PathLength(points: Point[]) {
  var d = 0.0;
  for (var i = 1; i < points.length; i++) d += Distance(points[i - 1], points[i]);
  return d;
}

function Distance(p1: Point, p2: Point) {
  var dx = p2.x - p1.x;
  var dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function Deg2Rad(d: number) {
  return (d * Math.PI) / 180.0;
}
