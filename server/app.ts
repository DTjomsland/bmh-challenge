import { Router, Request, Response, NextFunction } from "express";
const { uniqueNamesGenerator, animals } = require("unique-names-generator");

//----Server Setup----//
const cors = require("cors");
const express = require("express");
const router = express();
const port = 1337;
router.use(cors());
console.info("Starting the BMH Global Demonstration Server...");
const server = router.listen(port, function () {
  console.info(`BMH Global Demonstration Server now listening on port ${port}`);
});

//----Interfaces----//
interface GraphDatum {
  name: string;
  color: number;
  value: number;
}

interface Point {
  x: number;
  y: number;
  z: number;
}

//----Route Functions----//
// Generate random data for the pie chart
function genRandomGraphData(): GraphDatum[] {
  let data: GraphDatum[] = [];
  for (let i = 0; i < 5; i++) {
    // Generate a unique animal
    let shortName = uniqueNamesGenerator({
      dictionaries: [animals],
      length: 1,
    });
    let datum: GraphDatum = {
      name: shortName,
      color: genRandomThreeColour(),
      value: randomInteger(0, 100),
    };
    data.push(datum);
  }
  return data;
}

// Generate a random color
function genRandomThreeColour() {
  return randomInteger(0, 0xffffff);
}

// Generate a random integer
function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Generate a random position for moon
function genRandomPosition(min: number = -20, max: number = 20): Point {
  let pt: Point = {
    x: randomInteger(min * 10.0, max * 10.0) / 10.0,
    y: randomInteger(min * 10.0, max * 10.0) / 10.0,
    z: randomInteger(min * 10.0, max * 10.0) / 10.0,
  };
  return pt;
}

//----Route Handlers----//
router.get("/graph", (req: Request, res: Response, next: NextFunction) => {
  console.info("Graph page reached");
  const data = genRandomGraphData();
  console.info("Data:", data);
  res.status(200).json(data);
});

router.get("/color", (req: Request, res: Response, next: NextFunction) => {
  console.info("Color page reached");
  const firstMoonColor = genRandomThreeColour();
  const secondMoonColor = genRandomThreeColour();
  console.info("First Moon Color:", firstMoonColor);
  console.info("Second Moon Color:", secondMoonColor);
  res
    .status(200)
    .json({
      firstMoonColor: firstMoonColor,
      secondMoonColor: secondMoonColor,
    });
});

router.get("/position", (req: Request, res: Response, next: NextFunction) => {
  console.info("Position page reached");
  const firstMoonPosition = genRandomPosition();
  const secondMoonPosition = genRandomPosition();
  console.info("First Moon Position:", firstMoonPosition);
  console.info("Second Moon Position:", secondMoonPosition);
  res
    .status(200)
    .json({
      firstMoonPosition: firstMoonPosition,
      secondMoonPosition: secondMoonPosition,
    });
 
});