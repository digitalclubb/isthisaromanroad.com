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
import type { RoadFeature } from "./roads.js";

export type Story = {
	key: string;
	name: string;
	match: string[];
	body: string;
};

export const STORIES: Story[] = [
	{
		key: "watling-street",
		name: "Watling Street",
		match: ["Watling Street"],
		body: "Watling Street ran from <em>Rutupiae</em> on the Kent coast to <em>Viroconium</em> in Shropshire, crossing Britain at its widest reach. It came ashore at Richborough and headed north-west through Canterbury and Rochester into <em>Londinium</em>, then on past <em>Verulamium</em> toward Wroxeter. Boudica's army marched south along it in AD 60 to burn <em>Londinium</em> and <em>Verulamium</em>. Her revolt ended the following year, probably somewhere on the same road, against the governor Suetonius Paulinus. The line survives almost intact today: the A2 traces it from Dover to London, the A5 from London to Shrewsbury runs along the original surveying within a few metres in many places.",
	},
	{
		key: "ermine-street",
		name: "Ermine Street",
		match: ["Ermine Street"],
		body: "Ermine Street ran north from <em>Londinium</em> to <em>Eboracum</em> at York, the spine of Roman Britain. From Bishopsgate it cut up through Hertfordshire, crossed the great fen at <em>Durolipons</em> at modern Godmanchester then drove straight on into <em>Lindum</em> at Lincoln. North of the Humber it picked up the road to York, the legionary fortress that became the capital of Britannia Inferior after the province was divided in the third century. The Old North Road of the Saxon period followed almost the same line, as does much of today's A1. Crossing the Humber required a ferry; the bridge would not come for another nineteen centuries.",
	},
	{
		key: "fosse-way",
		name: "Fosse Way",
		match: ["Fosse Way"],
		body: "The Fosse Way ran from <em>Isca Dumnoniorum</em> at Exeter to <em>Lindum</em> at Lincoln, near-straight for nearly four hundred kilometres. It marked the western frontier of Roman Britain in the years immediately after the invasion of AD 43, before later governors pushed the line forward into Wales and the Pennines. The name comes from the Latin <em>fossa</em>, meaning ditch: a defensive earthwork once ran beside it. Today the road survives as a chain of country lanes across Somerset, Wiltshire and the East Midlands, kinked occasionally by enclosure but never far from the line a surveyor's <em>groma</em> laid down two thousand years ago.",
	},
	{
		key: "stane-street",
		name: "Stane Street",
		match: ["Stane Street"],
		body: "Stane Street ran from <em>Londinium</em> to <em>Noviomagus Reginorum</em> at Chichester, the most direct line between London and the south coast. It crossed the Mole at Dorking and climbed the chalk of the North Downs near Box Hill, dropped through the Sussex Weald then ran out into the civitas capital of the Regni near the south coast. The surveying is among the boldest in Britain: the road's first stretch from London points almost exactly at the centre of Chichester, ninety kilometres away. The modern A29 follows long sections of it through Sussex. The remainder is footpath and bridleway, easier to walk than to drive.",
	},
	{
		key: "akeman-street",
		name: "Akeman Street",
		match: ["Akeman Street"],
		body: "Akeman Street ran east-west across the southern Midlands, from <em>Verulamium</em> near St Albans to <em>Corinium</em> at Cirencester. It met Watling Street at <em>Verulamium</em> and the Fosse Way at <em>Corinium</em>. Those three roads together framed the heart of Roman Britain. The name is Old English: the people who came after the Romans called Bath <em>Acemannesceaster</em>. Akeman Street is the road that led toward it from the east. A long stretch is preserved as a green lane through Buckinghamshire and Oxfordshire, walkable in a day. Outside Tring the modern A41 picks it up and never quite lets go.",
	},
	{
		key: "dere-street",
		name: "Dere Street",
		match: ["Dere Street"],
		body: "Dere Street ran north from <em>Eboracum</em> at York to the Antonine Wall, the supply line for the Roman frontier in northern Britain. It crossed the Tees, the Tyne and the Tweed; it served Corbridge (the Roman supply base south of Hadrian's Wall) and it pushed on into what is now Scotland as far as Inveresk near Edinburgh. The Antonine Wall held for barely twenty years; after that Dere Street became the road to Hadrian's Wall and stayed in heavy use for another two centuries. The A1 in Northumberland and the A68 across the Cheviots both run on parts of it.",
	},
	{
		key: "peddars-way",
		name: "Peddars Way",
		match: ["Peddars Way"],
		body: "Peddars Way ran from a junction with the Icknield Way in south-west Norfolk to the Norfolk coast at Holme-next-the-Sea. It was built in the years after Boudica's revolt, probably as a military road to keep watch on the Iceni who had risen against Rome and lost. The name first appears in medieval records as the pedlars' way, a long-distance footpath of north Norfolk, sandy underfoot and almost flat for the full forty miles. Today it is one of the best preserved Roman roads in Britain to walk, mostly because almost no modern road has ever wanted to follow it.",
	},
	{
		key: "via-devana",
		name: "Via Devana",
		match: ["Via Devana"],
		body: "Via Devana is the modern name given to a road that may never have existed as a single Roman route. The eighteenth-century antiquary Charles Mason coined the term for a supposed road running diagonally from <em>Camulodunum</em> at Colchester through Cambridge to <em>Deva</em> at Chester, the legionary fortress on the Dee. Stretches of Roman road certainly exist along that line, particularly between Colchester and Cambridge, but whether they ever connected as one continuous highway is disputed. The Cambridge to Godmanchester section survives clearly. West of that, the Via Devana is more a Georgian idea than a Roman fact.",
	},
	{
		key: "sarn-helen",
		name: "Sarn Helen",
		match: ["Sarn Helen"],
		body: "Sarn Helen is the Welsh name for the chain of Roman roads that ran north to south through Wales, from <em>Segontium</em> near Caernarfon to <em>Maridunum</em> at Carmarthen. The name comes from Elen Luyddog, Helen of the Hosts, the British wife of the Roman usurper Magnus Maximus whose marching armies she was said to have provisioned in the late fourth century. Stretches of Sarn Helen are still walkable across the heart of Snowdonia, particularly across the moors above Ffestiniog where the road is plain in the turf. Much of the rest is buried beneath modern lanes or lost to forestry.",
	},
	{
		key: "stanegate",
		name: "Stanegate",
		match: ["Stanegate"],
		body: "Stanegate ran east-west across the narrow neck of northern Britain between <em>Coria</em> at Corbridge and <em>Luguvalium</em> at Carlisle, on the line where Hadrian would later build his wall. It was laid out in the early second century under Trajan, on the line of earlier Flavian forts at Vindolanda and Corbridge. For a generation it was the frontier road of Roman Britain before there was a frontier: a string of forts along its length kept watch on what lay north. When the wall went up around AD 122, Stanegate dropped a little south of the new line and continued as a supply road to the wall's garrisons. The modern A69 partly follows it.",
	},
	{
		key: "king-street",
		name: "King Street",
		match: ["King Street"],
		body: "King Street ran north from <em>Durobrivae</em> near Water Newton to <em>Lindum</em> at Lincoln, a parallel route to Ermine Street through the Lincolnshire fens. It crossed the wetlands on a built causeway raised above the floods that drowned other Roman tracks. Where Ermine Street took the higher ground to the east, King Street kept lower and straighter through the levels. Today it survives in long sections as the B1180 and as parish lanes between Bourne and Sleaford. Antiquarian tradition gave it the royal name; Romans called it nothing in particular that has come down to us.",
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
