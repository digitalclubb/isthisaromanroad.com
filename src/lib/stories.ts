/**
 * Hand-written stories for the famous Roman roads of Britain.
 *
 * Each story has a `match` array of substrings looked up against the
 * `properties.itinerary` and `properties.name` fields of the Itiner-e
 * road feature. The first story whose pattern is found in either field
 * is the story shown. Patterns are matched case-insensitively.
 *
 * Ordering matters: "King Street" is also a colloquial name for a stretch
 * of Ermine Street north of Lincoln, so Ermine Street MUST come before
 * King Street in the array to win first-match.
 *
 * House style: British English, no em dashes, no Oxford commas, no
 * commas before "and". Latin place names are wrapped in `<em>` and
 * rendered italic by the display CSS.
 */
import type { Feature } from "geojson";
import type { RoadFeature } from "./roads.js";

export type Story = {
	key: string;
	name: string;
	match: string[];
	body: string;
	/** Latin (or modern, where Latin isn't known) name of the road's starting
	 * point, used in italic on the road page subtitle. */
	from?: string;
	/** As `from`, the destination. */
	to?: string;
};

export const STORIES: Story[] = [
	{
		key: "watling-street",
		name: "Watling Street",
		match: ["Watling Street"],
		from: "Rutupiae",
		to: "Viroconium",
		body: "Watling Street ran from <em>Rutupiae</em> on the Kent coast to <em>Viroconium</em> in Shropshire, crossing Britain at its widest reach. It came ashore at Richborough and headed north-west through Canterbury and Rochester into <em>Londinium</em>, then on past <em>Verulamium</em> toward Wroxeter. Boudica's army marched south along it in AD 60 to burn <em>Londinium</em> and <em>Verulamium</em>. Her revolt ended the following year, probably somewhere on the same road, against the governor Suetonius Paulinus. The line survives almost intact today: the A2 traces it from Dover to London, the A5 from London to Shrewsbury runs along the original surveying within a few metres in many places.",
	},
	{
		key: "ermine-street",
		name: "Ermine Street",
		match: ["Ermine Street"],
		from: "Londinium",
		to: "Eboracum",
		body: "Ermine Street ran north from <em>Londinium</em> to <em>Eboracum</em> at York, the spine of Roman Britain. From Bishopsgate it cut up through Hertfordshire, crossed the great fen at <em>Durolipons</em> at modern Godmanchester then drove straight on into <em>Lindum</em> at Lincoln. North of the Humber it picked up the road to York, the legionary fortress that became the capital of Britannia Inferior after the province was divided in the third century. The Old North Road of the Saxon period followed almost the same line, as does much of today's A1. Crossing the Humber required a ferry; the bridge would not come for another nineteen centuries.",
	},
	{
		key: "fosse-way",
		name: "Fosse Way",
		match: ["Fosse Way"],
		from: "Isca Dumnoniorum",
		to: "Lindum",
		body: "The Fosse Way ran from <em>Isca Dumnoniorum</em> at Exeter to <em>Lindum</em> at Lincoln, near-straight for nearly four hundred kilometres. It marked the western frontier of Roman Britain in the years immediately after the invasion of AD 43, before later governors pushed the line forward into Wales and the Pennines. The name comes from the Latin <em>fossa</em>, meaning ditch: a defensive earthwork once ran beside it. Today the road survives as a chain of country lanes across Somerset, Wiltshire and the East Midlands, kinked occasionally by enclosure but never far from the line a surveyor's <em>groma</em> laid down two thousand years ago.",
	},
	{
		key: "stane-street",
		name: "Stane Street",
		match: ["Stane Street"],
		from: "Londinium",
		to: "Noviomagus Reginorum",
		body: "Stane Street ran from <em>Londinium</em> to <em>Noviomagus Reginorum</em> at Chichester, the most direct line between London and the south coast. It crossed the Mole at Dorking and climbed the chalk of the North Downs near Box Hill, dropped through the Sussex Weald then ran out into the civitas capital of the Regni near the south coast. The surveying is among the boldest in Britain: the road's first stretch from London points almost exactly at the centre of Chichester, ninety kilometres away. The modern A29 follows long sections of it through Sussex. The remainder is footpath and bridleway, easier to walk than to drive.",
	},
	{
		key: "akeman-street",
		name: "Akeman Street",
		match: ["Akeman Street"],
		from: "Verulamium",
		to: "Corinium",
		body: "Akeman Street ran east-west across the southern Midlands, from <em>Verulamium</em> near St Albans to <em>Corinium</em> at Cirencester. It met Watling Street at <em>Verulamium</em> and the Fosse Way at <em>Corinium</em>. Those three roads together framed the heart of Roman Britain. The name is Old English: the people who came after the Romans called Bath <em>Acemannesceaster</em>. Akeman Street is the road that led toward it from the east. A long stretch is preserved as a green lane through Buckinghamshire and Oxfordshire, walkable in a day. Outside Tring the modern A41 picks it up and never quite lets go.",
	},
	{
		key: "dere-street",
		name: "Dere Street",
		match: ["Dere Street"],
		from: "Eboracum",
		to: "Inveresk",
		body: "Dere Street ran north from <em>Eboracum</em> at York to the Antonine Wall, the supply line for the Roman frontier in northern Britain. It crossed the Tees, the Tyne and the Tweed; it served Corbridge (the Roman supply base south of Hadrian's Wall) and it pushed on into what is now Scotland as far as Inveresk near Edinburgh. The Antonine Wall held for barely twenty years; after that Dere Street became the road to Hadrian's Wall and stayed in heavy use for another two centuries. The A1 in Northumberland and the A68 across the Cheviots both run on parts of it.",
	},
	{
		key: "peddars-way",
		name: "Peddars Way",
		match: ["Peddars Way"],
		from: "South-west Norfolk",
		to: "Holme-next-the-Sea",
		body: "Peddars Way ran from a junction with the Icknield Way in south-west Norfolk to the Norfolk coast at Holme-next-the-Sea. It was built in the years after Boudica's revolt, probably as a military road to keep watch on the Iceni who had risen against Rome and lost. The name first appears in medieval records as the pedlars' way, a long-distance footpath of north Norfolk, sandy underfoot and almost flat for the full forty miles. Today it is one of the best preserved Roman roads in Britain to walk, mostly because almost no modern road has ever wanted to follow it.",
	},
	{
		key: "via-devana",
		name: "Via Devana",
		match: ["Via Devana"],
		from: "Camulodunum",
		to: "Deva",
		body: "Via Devana is the modern name given to a road that may never have existed as a single Roman route. The eighteenth-century antiquary Charles Mason coined the term for a supposed road running diagonally from <em>Camulodunum</em> at Colchester through Cambridge to <em>Deva</em> at Chester, the legionary fortress on the Dee. Stretches of Roman road certainly exist along that line, particularly between Colchester and Cambridge, but whether they ever connected as one continuous highway is disputed. The Cambridge to Godmanchester section survives clearly. West of that, the Via Devana is more a Georgian idea than a Roman fact.",
	},
	{
		key: "sarn-helen",
		name: "Sarn Helen",
		match: ["Sarn Helen"],
		from: "Segontium",
		to: "Maridunum",
		body: "Sarn Helen is the Welsh name for the chain of Roman roads that ran north to south through Wales, from <em>Segontium</em> near Caernarfon to <em>Maridunum</em> at Carmarthen. The name comes from Elen Luyddog, Helen of the Hosts, the British wife of the Roman usurper Magnus Maximus whose marching armies she was said to have provisioned in the late fourth century. Stretches of Sarn Helen are still walkable across the heart of Snowdonia, particularly across the moors above Ffestiniog where the road is plain in the turf. Much of the rest is buried beneath modern lanes or lost to forestry.",
	},
	{
		key: "stanegate",
		name: "Stanegate",
		match: ["Stanegate"],
		from: "Coria",
		to: "Luguvalium",
		body: "Stanegate ran east-west across the narrow neck of northern Britain between <em>Coria</em> at Corbridge and <em>Luguvalium</em> at Carlisle, on the line where Hadrian would later build his wall. It was laid out in the early second century under Trajan, on the line of earlier Flavian forts at Vindolanda and Corbridge. For a generation it was the frontier road of Roman Britain before there was a frontier: a string of forts along its length kept watch on what lay north. When the wall went up around AD 122, Stanegate dropped a little south of the new line and continued as a supply road to the wall's garrisons. The modern A69 partly follows it.",
	},
	{
		key: "king-street",
		name: "King Street",
		match: ["King Street"],
		from: "Durobrivae",
		to: "Lindum",
		body: "King Street ran north from <em>Durobrivae</em> near Water Newton to <em>Lindum</em> at Lincoln, a parallel route to Ermine Street through the Lincolnshire fens. It crossed the wetlands on a built causeway raised above the floods that drowned other Roman tracks. Where Ermine Street took the higher ground to the east, King Street kept lower and straighter through the levels. Today it survives in long sections as the B1180 and as parish lanes between Bourne and Sleaford. Antiquarian tradition gave it the royal name; Romans called it nothing in particular that has come down to us.",
	},
	{
		key: "pye-road",
		name: "Pye Road",
		match: ["Pye Road"],
		from: "Camulodunum",
		to: "Venta Icenorum",
		body: "Pye Road ran north from <em>Camulodunum</em> at Colchester to <em>Venta Icenorum</em> at Caistor St Edmund, binding the veterans' colony at Colchester to the Iceni capital in Norfolk. It crossed the Stour, the Waveney and the Tas, dropping in and out of the river valleys of east Suffolk. After the fall of Rome it remained the main road through East Anglia. Today the A140 follows almost the same line from Ipswich to Norwich. The medieval name is of disputed origin; most readings derive it from Old English <em>pie</em> for magpie, though why a road should take the bird's name is anyone's guess.",
	},
	{
		key: "devils-highway",
		name: "The Devil's Highway",
		match: ["Devil's Highway", "Devils Highway"],
		from: "Londinium",
		to: "Calleva Atrebatum",
		body: "The Devil's Highway ran west from <em>Londinium</em> to <em>Calleva Atrebatum</em> at Silchester, crossing the Thames at <em>Pontes</em> near Staines. It cut a fast line through the heathland of the Berkshire downs, the shortest road from London to the great inland town at Silchester. The name appeared in medieval surveys, long after the road had fallen out of use: country people who could not believe so straight a road could be human work attributed it to the devil. Today most of it lies under modern roads or under farmland, but a clear stretch survives across Crowthorne and Wokingham as a footpath through the pines.",
	},
	{
		key: "ackling-dyke",
		name: "Ackling Dyke",
		match: ["Ackling Dyke"],
		from: "Sorviodunum",
		to: "Durnovaria",
		body: "Ackling Dyke ran south-west from <em>Sorviodunum</em> at Old Sarum to <em>Durnovaria</em> at Dorchester, climbing the chalk downs of Cranborne Chase. Long sections survive as a high, broad <em>agger</em> raised three metres above the surrounding fields, one of the most impressive Roman earthworks left in Britain. The road brushed past the Iron Age hillfort at Badbury Rings, where you can still walk it for several miles between barrows and beech clumps. The name is Anglo-Saxon, possibly from <em>æcca</em> meaning oak or from a personal name; nobody is certain. It is now a long-distance footpath through some of the quietest country in southern England.",
	},
	{
		key: "stone-street",
		name: "Stone Street",
		match: ["Stone Street"],
		from: "Durovernum Cantiacorum",
		to: "Portus Lemanis",
		body: "Stone Street ran south from <em>Durovernum Cantiacorum</em> at Canterbury to <em>Portus Lemanis</em> at Lympne on the Kent coast, joining the chief town of the Cantii to one of the Saxon Shore forts that watched the Channel. It is among the straightest of all British Roman roads, holding its line for twenty kilometres across the chalk of the North Downs. The B2068 still follows it almost exactly. Cleared of trees and waiting for the eye, the road's surveying is plain: stand at one end and you can see the other. The name is medieval, simply Stone Street for the road's metalled surface in a country of green lanes.",
	},
	{
		key: "ryknild-street",
		name: "Ryknild Street",
		match: ["Ryknild Street", "Ricknild Street", "Riknild Street"],
		from: "Bourton-on-the-Water",
		to: "Templeborough",
		body: "Ryknild Street ran north from the Fosse Way at Bourton-on-the-Water through the West Midlands to <em>Templeborough</em> south of Sheffield. It crossed Watling Street at <em>Letocetum</em>, the small Roman town that became Wall in Staffordshire, where the two great roads met at right angles. The medieval name echoes the prehistoric Icknield Way to the south, though whether the two names share an origin is disputed. Long sections survive as the modern A38 through Derbyshire and Yorkshire. North of Burton-on-Trent the road runs almost dead straight for fifty kilometres, the surveying made easy by the broad and level Trent valley.",
	},
	{
		key: "maiden-way",
		name: "Maiden Way",
		match: ["Maiden Way"],
		from: "Bravoniacum",
		to: "Magnis",
		body: "Maiden Way ran north from <em>Bravoniacum</em> at Kirkby Thore through the Pennine moorland to the fort at <em>Magnis</em> at Carvoran on the line of Hadrian's Wall. It is the most desolate of the great British Roman roads, climbing across exposed fell country at over four hundred metres for much of its length. The name comes from the Old English <em>mægden</em>, maiden in the older sense of unspoilt or never taken, as with Maiden Castle further south. The road served the lead mines of Alston Moor as well as the wall garrisons. Sections survive as bridleway through some of the emptiest country in England, particularly across the moor above Kirkland where the road is plain as a pale ribbon in the heather.",
	},
	{
		key: "devils-causeway",
		name: "The Devil's Causeway",
		match: ["Devil's Causeway", "Devils Causeway"],
		from: "Beukley",
		to: "Berwick",
		body: "The Devil's Causeway branched off Dere Street at Beukley north of Corbridge and ran north-east to the mouth of the Tweed at Berwick. It was one of the Roman roads built deep into northern Britain after the conquest of the lowlands, probably serving the network of forts that watched the north-east coast. Long stretches survive as 'Roman Road' on Ordnance Survey maps, a straight line of footpath and farm track across the open Northumberland uplands. The name is medieval and predictable: a road too straight to be the work of men. The B6342 follows part of its line; for the rest you walk.",
	},
	{
		// "High Street" is a generic enough name that the match has to be
		// specific. The Lake District Roman road's standard archaeological
		// label is "High Street" usually paired with "Roman" or with the
		// fort names. Restrict to forms unlikely to false-match modern
		// urban-thoroughfare references.
		key: "high-street",
		name: "High Street",
		match: ["High Street Roman", "Galava-Brocavum", "Brocavum-Galava"],
		from: "Galava",
		to: "Brocavum",
		body: "High Street is the name of the Roman road that crossed the high fells of the Lake District between the forts at <em>Galava</em> at Ambleside and <em>Brocavum</em> at Brougham. It climbed straight up onto the long ridge that gives the road and the mountain their shared name, holding to ground above seven hundred metres for most of its length before descending into the Eden valley. It was the highest Roman road in Britain and may have been the most exposed. Today the line is a popular high-level walking route, with cairns and the broken-up <em>agger</em> still visible across the bare summits. Walkers come for the views; the Romans came because no easier line existed.",
	},
	{
		key: "icknield-way",
		name: "Icknield Way",
		match: ["Icknield Way"],
		body: "The Icknield Way is older than the Romans. A prehistoric trackway running along the chalk from East Anglia to the Wessex downs, it was the principal route between Norfolk and the south coast for many centuries before the conquest. The Romans paved sections of it where the line suited their road network, particularly between Ivinghoe and Tring, but they never built it whole. The medieval name is from the Iceni tribe of Norfolk and Suffolk, whose territory the eastern end crossed. Today it is one of the oldest continuously used paths in Europe, a designated National Trail from Norfolk to Ivinghoe Beacon in the Chilterns.",
	},
	{
		key: "military-way",
		name: "The Military Way",
		match: ["Military Way"],
		body: "The Military Way was the Roman supply road that ran along a frontier wall behind the line itself, linking the forts, milecastles and turrets along its length. Two Roman walls in Britain had one: a longer route behind Hadrian's Wall in Cumbria and Northumberland with a shorter twin behind the Antonine Wall across the central belt of Scotland. The road stayed in use through the centuries of Roman occupation in the north. It is still walkable in many places as a slightly raised line of grass and stone: an unspectacular thing on its own but the backbone of the most remote frontier the empire ever held.",
	},
	{
		key: "stainmore-pass",
		name: "Stainmore Pass road",
		match: ["Stainmore"],
		from: "Cataractonium",
		to: "Glannoventa",
		body: "The Stainmore Pass road carried Roman supplies west across the Pennines from <em>Cataractonium</em> at Catterick to <em>Glannoventa</em> at Ravenglass on the Cumbrian coast. It climbed to four hundred and fifty metres at the top of Stainmore, where the fort at <em>Lavatris</em> at Bowes guarded the bleak summit. It was the connecting line between Dere Street and the Cumbrian forts: without it Roman Cumbria would have been cut off from the eastern half of the empire by the Pennine hills. The modern A66 follows the same pass. In bad weather it closes for the same reasons the Romans must have closed it.",
	},
];

/**
 * Returns the matching story for a road feature, or null if none of the
 * patterns appear in the road's `itinerary` or `name` properties.
 */
export function findStoryFor(road: RoadFeature): Story | null {
	const itinerary = (road.properties.itinerary ?? "").toLowerCase();
	const name = (road.properties.name ?? "").toLowerCase();
	for (const story of STORIES) {
		for (const pattern of story.match) {
			const p = pattern.toLowerCase();
			if (itinerary.includes(p) || name.includes(p)) return story;
		}
	}
	return null;
}

/**
 * Find every road-feature whose itinerary or name matches the story's
 * patterns. Used by the per-road page (`/road/[slug]`) to render the
 * full road on the map. Same matching rules as `findStoryFor` but
 * applied in reverse: given a story, return all qualifying features.
 */
export function segmentsForStory<T extends Feature>(story: Story, features: ReadonlyArray<T>): T[] {
	const lowered = story.match.map((p) => p.toLowerCase());
	return features.filter((f) => {
		const props = (f.properties ?? {}) as { itinerary?: string; name?: string };
		const itin = (props.itinerary ?? "").toLowerCase();
		const name = (props.name ?? "").toLowerCase();
		return lowered.some((p) => itin.includes(p) || name.includes(p));
	});
}
