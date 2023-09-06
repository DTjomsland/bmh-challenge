console.info( "Starting the BMH Global Demonstration Server..." );

import {
	Router,
	Request,
	Response,
	NextFunction
} from "express"
const express = require('express')

const router = express();
const port = 1010;

router.get( '/', ( req: Request, res: Response, next: NextFunction )=>{
	console.info( "Root page reached" );
	res.status( 200 ).send( "You found me!" );
} )

const server = router.listen(
	port,
	function(){
		console.info( `BMH Global Demonstration Server now listening on port ${port}` )
	}
)


interface GraphDatum {}

function genRandomGraphData() : GraphDatum[]
{
	return [];
}


function genRandomThreeColour()
	{ return randomInteger( 0, 0xFFFFFF ); }

function randomInteger( min : number, max: number )
	{ return Math.floor(Math.random() * (max - min + 1) + min); }




interface Point {
	x: number,
	y: number,
	z: number
}

function genRandomPosition(
	min : number = -20,
	max : number =  20,
) : Point {
	let pt : Point = {
		x: randomInteger( min * 10.0, max * 10.0) / 10.0,
		y: randomInteger( min * 10.0, max * 10.0) / 10.0,
		z: randomInteger( min * 10.0, max * 10.0) / 10.0
	}
	return pt;
}