/**
 * Folds Natural Earth's British admin_1 units into the historic counties
 * people actually search by.
 *
 * Natural Earth's GB subdivisions are current local-government areas: a mix of
 * administrative counties (Kent, Norfolk), unitary authorities carved out of
 * them (Medway, Milton Keynes, Peterborough), metropolitan boroughs and London
 * boroughs. Nobody searches "Roman roads in Central Bedfordshire". They search
 * "Roman roads in Bedfordshire", "in Kent", "in Yorkshire".
 *
 * So each unit maps to a historic county. Where a unit already is one, it maps
 * to itself and needs no entry here; only the carve-outs and the boroughs are
 * listed. Anything unmapped keeps its own name.
 *
 * Yorkshire is treated as one county rather than four ridings plus a dozen
 * boroughs: the Roman road network there reads as one thing, and "Roman roads
 * in Yorkshire" is overwhelmingly the searched form.
 */
export const COUNTY_OF: Record<string, string> = {
	// Unitary authorities carved out of a historic county
	Medway: "Kent",
	"Milton Keynes": "Buckinghamshire",
	Peterborough: "Cambridgeshire",
	"Central Bedfordshire": "Bedfordshire",
	Bedford: "Bedfordshire",
	Luton: "Bedfordshire",
	"Brighton and Hove": "East Sussex",
	"Southend-on-Sea": "Essex",
	Thurrock: "Essex",
	Portsmouth: "Hampshire",
	Southampton: "Hampshire",
	"Isle of Wight": "Hampshire",
	Reading: "Berkshire",
	Slough: "Berkshire",
	Wokingham: "Berkshire",
	"West Berkshire": "Berkshire",
	"Bracknell Forest": "Berkshire",
	"Royal Borough of Windsor and Maidenhead": "Berkshire",
	Swindon: "Wiltshire",
	Poole: "Dorset",
	Bournemouth: "Dorset",
	Torbay: "Devon",
	Plymouth: "Devon",
	"Isles of Scilly": "Cornwall",
	Bristol: "Gloucestershire",
	"South Gloucestershire": "Gloucestershire",
	"Bath and North East Somerset": "Somerset",
	"North Somerset": "Somerset",
	Derby: "Derbyshire",
	Leicester: "Leicestershire",
	Nottingham: "Nottinghamshire",
	"Stoke-on-Trent": "Staffordshire",
	"Telford and Wrekin": "Shropshire",
	// Widnes is historic Lancashire, Runcorn historic Cheshire. Natural Earth
	// also ships a second feature named "Halton" covering the Wirral, which is
	// Cheshire either way.
	Halton: "Lancashire",
	Warrington: "Cheshire",
	"Cheshire East": "Cheshire",
	"Cheshire West and Chester": "Cheshire",
	"Blackburn with Darwen": "Lancashire",
	Blackpool: "Lancashire",
	Darlington: "Durham",
	Hartlepool: "Durham",
	"Stockton-on-Tees": "Durham",
	Middlesbrough: "Yorkshire",
	"Redcar and Cleveland": "Yorkshire",

	// Yorkshire, in all its administrative fragments
	"North Yorkshire": "Yorkshire",
	"East Riding of Yorkshire": "Yorkshire",
	"North Lincolnshire": "Lincolnshire",
	"North East Lincolnshire": "Lincolnshire",
	"Kingston upon Hull": "Yorkshire",
	York: "Yorkshire",
	Leeds: "Yorkshire",
	Bradford: "Yorkshire",
	Sheffield: "Yorkshire",
	Wakefield: "Yorkshire",
	Doncaster: "Yorkshire",
	Rotherham: "Yorkshire",
	Barnsley: "Yorkshire",
	Kirklees: "Yorkshire",
	Calderdale: "Yorkshire",

	// Metropolitan boroughs, to their historic county
	Birmingham: "Warwickshire",
	Solihull: "Warwickshire",
	Coventry: "Warwickshire",
	Dudley: "Worcestershire",
	Sandwell: "Staffordshire",
	Walsall: "Staffordshire",
	Wolverhampton: "Staffordshire",
	Manchester: "Lancashire",
	Salford: "Lancashire",
	Bolton: "Lancashire",
	Bury: "Lancashire",
	Oldham: "Lancashire",
	Rochdale: "Lancashire",
	Stockport: "Cheshire",
	// Hyde, Dukinfield and Stalybridge are historic Cheshire.
	Tameside: "Cheshire",
	// Altrincham, Sale, Bowdon and Hale are historic Cheshire; only Stretford
	// and Urmston are Lancashire.
	Trafford: "Cheshire",
	Wigan: "Lancashire",
	Liverpool: "Lancashire",
	Sefton: "Lancashire",
	Knowsley: "Lancashire",
	Merseyside: "Lancashire",
	"Newcastle upon Tyne": "Northumberland",
	"North Tyneside": "Northumberland",
	Gateshead: "Durham",
	"South Tyneside": "Durham",
	Sunderland: "Durham",

	// Welsh principal areas. Only the South Wales valleys authorities are folded,
	// into Glamorgan, which is both the historic county and the searched name.
	// Denbighshire, Flintshire, Monmouthshire, Anglesey, Pembrokeshire,
	// Carmarthenshire and Ceredigion are left alone: they ARE historic counties,
	// and folding them into Clwyd or Gwent (1974 creations, abolished 1996)
	// would have inverted the point of this table.
	Bridgend: "Glamorgan",
	Cardiff: "Glamorgan",
	Swansea: "Glamorgan",
	"Neath Port Talbot": "Glamorgan",
	"Vale of Glamorgan": "Glamorgan",
	"Merthyr Tydfil": "Glamorgan",
	"Rhondda, Cynon, Taff": "Glamorgan",
};

/**
 * Greater London's 33 boroughs. Roman roads here belong to Londinium and its
 * approaches, not to Middlesex or Surrey as a modern reader would understand
 * them, so they all fold into one London entry.
 */
export const LONDON_BOROUGHS = new Set([
	"Barking and Dagenham",
	"Barnet",
	"Bexley",
	"Brent",
	"Bromley",
	"Camden",
	"City",
	"Croydon",
	"Ealing",
	"Enfield",
	"Greenwich",
	"Hackney",
	"Hammersmith and Fulham",
	"Haringey",
	"Harrow",
	"Havering",
	"Hillingdon",
	"Hounslow",
	"Islington",
	"Kensington and Chelsea",
	"Kingston upon Thames",
	"Lambeth",
	"Lewisham",
	"Merton",
	"Newham",
	"Redbridge",
	"Richmond upon Thames",
	"Southwark",
	"Sutton",
	"Tower Hamlets",
	"Waltham Forest",
	"Wandsworth",
	"Westminster",
]);

/** The historic county a Natural Earth admin_1 unit belongs to. */
export function countyFor(unitName: string): string {
	if (LONDON_BOROUGHS.has(unitName)) return "London";
	return COUNTY_OF[unitName] ?? unitName;
}
